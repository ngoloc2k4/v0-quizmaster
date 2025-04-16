package com.quizmaster.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quizmaster.dto.request.ChatMessageRequest;
import com.quizmaster.dto.request.CreateFlashcardRequest;
import com.quizmaster.dto.request.CreateQuizRequest;
import com.quizmaster.dto.request.GenerateFlashcardRequest;
import com.quizmaster.dto.request.GenerateQuizRequest;
import com.quizmaster.dto.response.ChatMessageResponse;
import com.quizmaster.dto.response.ChatSessionResponse;
import com.quizmaster.dto.response.FlashcardResponse;
import com.quizmaster.dto.response.QuizResponse;
import com.quizmaster.model.ChatSession;
import com.quizmaster.model.Quiz;
import com.quizmaster.repository.ChatSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OpenrouterService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ChatSessionRepository chatSessionRepository;
    private final QuizService quizService;
    private final FlashcardService flashcardService;

    @Value("${openrouter.api.key}")
    private String apiKey;

    @Value("${openrouter.api.url}")
    private String apiUrl;

    @Value("${openrouter.default.model}")
    private String defaultModel;

    public ChatSessionResponse createChatSession(String title) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        ChatSession chatSession = ChatSession.builder()
                .userId(username)
                .title(title != null && !title.isBlank() ? title : "New Chat")
                .messages(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        ChatSession savedSession = chatSessionRepository.save(chatSession);

        return mapToChatSessionResponse(savedSession);
    }

    public List<ChatSessionResponse> getUserChatSessions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        List<ChatSession> chatSessions = chatSessionRepository.findByUserIdOrderByUpdatedAtDesc(username);

        return chatSessions.stream()
                .map(this::mapToChatSessionResponse)
                .collect(Collectors.toList());
    }

    public ChatSessionResponse getChatSessionById(String sessionId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        ChatSession chatSession = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Chat session not found"));

        if (!chatSession.getUserId().equals(username)) {
            throw new RuntimeException("Unauthorized access to chat session");
        }

        return mapToChatSessionResponse(chatSession);
    }

    public ChatMessageResponse sendChatMessage(String sessionId, ChatMessageRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        ChatSession chatSession = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Chat session not found"));

        if (!chatSession.getUserId().equals(username)) {
            throw new RuntimeException("Unauthorized access to chat session");
        }

        // Create user message
        String userMessageId = UUID.randomUUID().toString();
        ChatSession.ChatMessage userMessage = ChatSession.ChatMessage.builder()
                .id(userMessageId)
                .content(request.getContent())
                .role("user")
                .timestamp(LocalDateTime.now())
                .build();

        // Add user message to session
        chatSession.getMessages().add(userMessage);

        // Prepare messages for API call
        List<Map<String, String>> messages = new ArrayList<>();
        
        // Add system message
        messages.add(Map.of(
                "role", "system",
                "content", "You are a helpful AI assistant for the QuizMaster AI platform. You help users with creating quizzes, flashcards, and answering their questions about various topics."
        ));
        
        // Add previous messages for context (limit to last 10 messages)
        int startIndex = Math.max(0, chatSession.getMessages().size() - 10);
        for (int i = startIndex; i < chatSession.getMessages().size(); i++) {
            ChatSession.ChatMessage message = chatSession.getMessages().get(i);
            messages.add(Map.of(
                    "role", message.getRole(),
                    "content", message.getContent()
            ));
        }

        // Call Openrouter API
        String model = request.getModel() != null && !request.getModel().isBlank() 
                ? request.getModel() 
                : defaultModel;
        
        String aiResponse = callOpenrouterApi(messages, model);

        // Create AI message
        String aiMessageId = UUID.randomUUID().toString();
        ChatSession.ChatMessage aiMessage = ChatSession.ChatMessage.builder()
                .id(aiMessageId)
                .content(aiResponse)
                .role("assistant")
                .model(model)
                .timestamp(LocalDateTime.now())
                .build();

        // Add AI message to session
        chatSession.getMessages().add(aiMessage);
        chatSession.setUpdatedAt(LocalDateTime.now());

        // Update chat session title if it's the first message
        if (chatSession.getMessages().size() <= 2 && (chatSession.getTitle().equals("New Chat") || chatSession.getTitle().isBlank())) {
            String title = generateChatTitle(chatSession.getMessages());
            chatSession.setTitle(title);
        }

        // Save updated session
        chatSessionRepository.save(chatSession);

        // Return AI message response
        return ChatMessageResponse.builder()
                .id(aiMessageId)
                .content(aiResponse)
                .role("assistant")
                .model(model)
                .timestamp(aiMessage.getTimestamp())
                .build();
    }

    public QuizResponse generateQuiz(GenerateQuizRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Prepare prompt for quiz generation
        String prompt = String.format(
                "Create a quiz about '%s' with %d questions at %s difficulty level. " +
                "Format the response as JSON with the following structure: " +
                "{ \"title\": \"Quiz Title\", \"description\": \"Quiz Description\", " +
                "\"questions\": [ { \"text\": \"Question text\", \"type\": \"MULTIPLE_CHOICE\", " +
                "\"options\": [ { \"text\": \"Option 1\", \"isCorrect\": true }, { \"text\": \"Option 2\", \"isCorrect\": false } ] } ] }",
                request.getTopic(),
                request.getNumberOfQuestions(),
                request.getDifficulty()
        );

        // Call Openrouter API
        String model = request.getModel() != null && !request.getModel().isBlank() 
                ? request.getModel() 
                : defaultModel;
        
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of(
                "role", "system",
                "content", "You are a quiz creation assistant. You create educational quizzes with accurate information. Always respond with valid JSON."
        ));
        messages.add(Map.of(
                "role", "user",
                "content", prompt
        ));

        String response = callOpenrouterApi(messages, model);

        try {
            // Extract JSON from response
            String jsonStr = extractJsonFromResponse(response);
            
            // Parse JSON to create quiz
            JsonNode quizJson = objectMapper.readTree(jsonStr);
            
            // Create quiz request from AI response
            CreateQuizRequest quizRequest = new CreateQuizRequest();
            quizRequest.setTitle(quizJson.get("title").asText());
            quizRequest.setDescription(quizJson.get("description").asText());
            quizRequest.setTimeLimit(30); // Default time limit
            quizRequest.setPublic(true);
            
            if (request.getTags() != null && !request.getTags().isEmpty()) {
                quizRequest.setTags(request.getTags());
            } else {
                quizRequest.setTags(Collections.singletonList(request.getTopic()));
            }
            
            List<CreateQuizRequest.QuestionDto> questions = new ArrayList<>();
            JsonNode questionsJson = quizJson.get("questions");
            
            for (JsonNode questionJson : questionsJson) {
                CreateQuizRequest.QuestionDto questionDto = new CreateQuizRequest.QuestionDto();
                questionDto.setText(questionJson.get("text").asText());
                questionDto.setType(Quiz.Question.QuestionType.valueOf(questionJson.get("type").asText()));
                
                List<CreateQuizRequest.QuestionDto.OptionDto> options = new ArrayList<>();
                JsonNode optionsJson = questionJson.get("options");
                
                for (JsonNode optionJson : optionsJson) {
                    CreateQuizRequest.QuestionDto.OptionDto optionDto = new CreateQuizRequest.QuestionDto.OptionDto();
                    optionDto.setText(optionJson.get("text").asText());
                    optionDto.setCorrect(optionJson.get("isCorrect").asBoolean());
                    options.add(optionDto);
                }
                
                questionDto.setOptions(options);
                questions.add(questionDto);
            }
            
            quizRequest.setQuestions(questions);
            
            // Create quiz using quiz service
            return quizService.createQuiz(quizRequest);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate quiz: " + e.getMessage(), e);
        }
    }

    public FlashcardResponse generateFlashcard(GenerateFlashcardRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Prepare prompt for flashcard generation
        String prompt = String.format(
                "Create a set of flashcards about '%s' with %d cards. " +
                "Format the response as JSON with the following structure: " +
                "{ \"title\": \"Flashcard Title\", \"description\": \"Flashcard Description\", " +
                "\"cards\": [ { \"front\": \"Front text\", \"back\": \"Back text\", \"position\": 0 } ] }",
                request.getTopic(),
                request.getNumberOfCards()
        );

        // Call Openrouter API
        String model = request.getModel() != null && !request.getModel().isBlank() 
                ? request.getModel() 
                : defaultModel;
        
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of(
                "role", "system",
                "content", "You are a flashcard creation assistant. You create educational flashcards with accurate information. Always respond with valid JSON."
        ));
        messages.add(Map.of(
                "role", "user",
                "content", prompt
        ));

        String response = callOpenrouterApi(messages, model);

        try {
            // Extract JSON from response
            String jsonStr = extractJsonFromResponse(response);
            
            // Parse JSON to create flashcard
            JsonNode flashcardJson = objectMapper.readTree(jsonStr);
            
            // Create flashcard request from AI response
            CreateFlashcardRequest flashcardRequest = new CreateFlashcardRequest();
            flashcardRequest.setTitle(flashcardJson.get("title").asText());
            flashcardRequest.setDescription(flashcardJson.get("description").asText());
            flashcardRequest.setPublic(true);
            
            if (request.getTags() != null && !request.getTags().isEmpty()) {
                flashcardRequest.setTags(request.getTags());
            } else {
                flashcardRequest.setTags(Collections.singletonList(request.getTopic()));
            }
            
            List<CreateFlashcardRequest.CardDto> cards = new ArrayList<>();
            JsonNode cardsJson = flashcardJson.get("cards");
            
            for (JsonNode cardJson : cardsJson) {
                CreateFlashcardRequest.CardDto cardDto = new CreateFlashcardRequest.CardDto();
                cardDto.setFront(cardJson.get("front").asText());
                cardDto.setBack(cardJson.get("back").asText());
                cardDto.setPosition(cardJson.get("position").asInt());
                cards.add(cardDto);
            }
            
            flashcardRequest.setCards(cards);
            
            // Create flashcard using flashcard service
            return flashcardService.createFlashcard(flashcardRequest);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate flashcard: " + e.getMessage(), e);
        }
    }

    public void deleteChatSession(String sessionId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        ChatSession chatSession = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Chat session not found"));

        if (!chatSession.getUserId().equals(username)) {
            throw new RuntimeException("Unauthorized access to chat session");
        }

        chatSessionRepository.delete(chatSession);
    }

    // Helper methods
    private String callOpenrouterApi(List<Map<String, String>> messages, String model) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("HTTP-Referer", "https://quizmaster.ai");

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.7);
        requestBody.put("max_tokens", 2000);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            String response = restTemplate.postForObject(apiUrl, request, String.class);
            JsonNode responseJson = objectMapper.readTree(response);
            return responseJson.path("choices").path(0).path("message").path("content").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to call Openrouter API: " + e.getMessage(), e);
        }
    }

    private String generateChatTitle(List<ChatSession.ChatMessage> messages) {
        // Find the first user message
        Optional<ChatSession.ChatMessage> firstUserMessage = messages.stream()
                .filter(m -> "user".equals(m.getRole()))
                .findFirst();

        if (firstUserMessage.isPresent()) {
            String content = firstUserMessage.get().getContent();
            // Truncate to first 30 chars or first sentence
            int endIndex = Math.min(30, content.length());
            String title = content.substring(0, endIndex);
            
            if (title.length() == 30 && !title.endsWith(".") && !title.endsWith("?") && !title.endsWith("!")) {
                title += "...";
            }
            
            return title;
        }
        
        return "New Chat";
    }

    private String extractJsonFromResponse(String response) {
        // Check if response is already valid JSON
        try {
            objectMapper.readTree(response);
            return response;
        } catch (JsonProcessingException e) {
            // Not valid JSON, try to extract JSON from text
        }

        // Look for JSON between backticks or code blocks
        if (response.contains("```json")) {
            int start = response.indexOf("```json") + 7;
            int end = response.indexOf("```", start);
            if (end > start) {
                return response.substring(start, end).trim();
            }
        }

        if (response.contains("```")) {
            int start = response.indexOf("```") + 3;
            int end = response.indexOf("```", start);
            if (end > start) {
                return response.substring(start, end).trim();
            }
        }

        // Look for JSON between curly braces
        int start = response.indexOf("{");
        int end = response.lastIndexOf("}") + 1;
        if (start >= 0 && end > start) {
            return response.substring(start, end).trim();
        }

        throw new RuntimeException("Could not extract valid JSON from response");
    }

    private ChatSessionResponse mapToChatSessionResponse(ChatSession chatSession) {
        List<ChatMessageResponse> messageResponses = chatSession.getMessages().stream()
                .map(message -> ChatMessageResponse.builder()
                        .id(message.getId())
                        .content(message.getContent())
                        .role(message.getRole())
                        .model(message.getModel())
                        .timestamp(message.getTimestamp())
                        .build())
                .collect(Collectors.toList());

        return ChatSessionResponse.builder()
                .id(chatSession.getId())
                .title(chatSession.getTitle())
                .messages(messageResponses)
                .createdAt(chatSession.getCreatedAt())
                .updatedAt(chatSession.getUpdatedAt())
                .build();
    }
}
