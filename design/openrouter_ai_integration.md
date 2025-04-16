# QuizMaster AI - Openrouter.ai API Integration

## Overview

QuizMaster AI sẽ tích hợp Openrouter.ai API để cung cấp các tính năng AI như tạo quiz, tạo flashcard và chat với AI. Openrouter.ai cho phép truy cập vào nhiều model AI khác nhau, bao gồm cả các model miễn phí, giúp dự án có tính linh hoạt cao trong việc lựa chọn model phù hợp với từng tính năng.

## Kiến trúc tích hợp

\`\`\`
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Client Layer   │◄────►│  Server Layer   │◄────►│  Database Layer │
│   (Next.js)     │      │  (Spring Boot)  │      │   (PostgreSQL)  │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                                  ▲
                                  │
                                  ▼
                         ┌─────────────────┐
                         │                 │
                         │  Openrouter.ai  │
                         │      API        │
                         │                 │
                         └─────────────────┘
\`\`\`

## Openrouter.ai API

Openrouter.ai là một dịch vụ cho phép truy cập vào nhiều model AI khác nhau thông qua một API thống nhất. Dịch vụ này cung cấp:

1. Truy cập vào nhiều model AI từ các nhà cung cấp khác nhau
2. Khả năng chọn model phù hợp với từng tác vụ
3. Hỗ trợ các model miễn phí và trả phí
4. API đơn giản và dễ tích hợp

## Tích hợp vào Backend

### Cấu trúc thư mục

\`\`\`
backend/
└── src/
    └── main/
        └── java/
            └── com/
                └── quizmaster/
                    ├── config/
                    │   └── OpenrouterConfig.java
                    ├── service/
                    │   └── AIService.java
                    └── client/
                        └── OpenrouterClient.java
\`\`\`

### Cấu hình Openrouter.ai

\`\`\`java
// OpenrouterConfig.java
@Configuration
public class OpenrouterConfig {
    
    @Value("${openrouter.api.key}")
    private String apiKey;
    
    @Value("${openrouter.api.url}")
    private String apiUrl;
    
    @Bean
    public RestTemplate openrouterRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getInterceptors().add((request, body, execution) -> {
            request.getHeaders().add("Authorization", "Bearer " + apiKey);
            request.getHeaders().add("HTTP-Referer", "https://quizmaster-ai.com");
            return execution.execute(request, body);
        });
        return restTemplate;
    }
}
\`\`\`

### Client Openrouter.ai

\`\`\`java
// OpenrouterClient.java
@Service
public class OpenrouterClient {
    
    private final RestTemplate openrouterRestTemplate;
    private final String apiUrl;
    
    @Autowired
    public OpenrouterClient(RestTemplate openrouterRestTemplate, @Value("${openrouter.api.url}") String apiUrl) {
        this.openrouterRestTemplate = openrouterRestTemplate;
        this.apiUrl = apiUrl;
    }
    
    public OpenrouterResponse generateCompletion(OpenrouterRequest request) {
        return openrouterRestTemplate.postForObject(apiUrl, request, OpenrouterResponse.class);
    }
}
\`\`\`

### Model Request và Response

\`\`\`java
// OpenrouterRequest.java
@Data
public class OpenrouterRequest {
    private String model;
    private List<Message> messages;
    private Double temperature;
    private Integer max_tokens;
    private Boolean stream;
    
    @Data
    public static class Message {
        private String role;
        private String content;
    }
}

// OpenrouterResponse.java
@Data
public class OpenrouterResponse {
    private String id;
    private String model;
    private List<Choice> choices;
    private Usage usage;
    
    @Data
    public static class Choice {
        private Message message;
        private Integer index;
        private String finish_reason;
    }
    
    @Data
    public static class Message {
        private String role;
        private String content;
    }
    
    @Data
    public static class Usage {
        private Integer prompt_tokens;
        private Integer completion_tokens;
        private Integer total_tokens;
    }
}
\`\`\`

### Service AI

\`\`\`java
// AIService.java
@Service
public class AIService {
    
    private final OpenrouterClient openrouterClient;
    
    @Value("${openrouter.default.model}")
    private String defaultModel;
    
    @Autowired
    public AIService(OpenrouterClient openrouterClient) {
        this.openrouterClient = openrouterClient;
    }
    
    public String generateQuiz(String topic, String difficulty, int questionCount, String model) {
        String promptTemplate = "Create a %s difficulty quiz about %s with %d multiple choice questions. " +
                "For each question, provide 4 options and mark the correct answer. " +
                "Also provide a brief explanation for the correct answer.";
        
        String prompt = String.format(promptTemplate, difficulty, topic, questionCount);
        
        OpenrouterRequest request = new OpenrouterRequest();
        request.setModel(model != null ? model : defaultModel);
        request.setTemperature(0.7);
        request.setMax_tokens(2000);
        request.setStream(false);
        
        List<OpenrouterRequest.Message> messages = new ArrayList<>();
        messages.add(new OpenrouterRequest.Message());
        messages.get(0).setRole("system");
        messages.get(0).setContent("You are an expert quiz creator who creates educational and engaging quizzes.");
        
        messages.add(new OpenrouterRequest.Message());
        messages.get(1).setRole("user");
        messages.get(1).setContent(prompt);
        
        request.setMessages(messages);
        
        OpenrouterResponse response = openrouterClient.generateCompletion(request);
        return response.getChoices().get(0).getMessage().getContent();
    }
    
    public String generateFlashcard(String topic, int cardCount, String model) {
        String promptTemplate = "Create %d flashcards about %s. " +
                "For each flashcard, provide a front side with a question or concept, " +
                "and a back side with a detailed explanation or answer.";
        
        String prompt = String.format(promptTemplate, cardCount, topic);
        
        OpenrouterRequest request = new OpenrouterRequest();
        request.setModel(model != null ? model : defaultModel);
        request.setTemperature(0.7);
        request.setMax_tokens(2000);
        request.setStream(false);
        
        List<OpenrouterRequest.Message> messages = new ArrayList<>();
        messages.add(new OpenrouterRequest.Message());
        messages.get(0).setRole("system");
        messages.get(0).setContent("You are an expert educator who creates concise and informative flashcards.");
        
        messages.add(new OpenrouterRequest.Message());
        messages.get(1).setRole("user");
        messages.get(1).setContent(prompt);
        
        request.setMessages(messages);
        
        OpenrouterResponse response = openrouterClient.generateCompletion(request);
        return response.getChoices().get(0).getMessage().getContent();
    }
    
    public String chatWithAI(List<OpenrouterRequest.Message> conversationHistory, String model) {
        OpenrouterRequest request = new OpenrouterRequest();
        request.setModel(model != null ? model : defaultModel);
        request.setTemperature(0.9);
        request.setMax_tokens(1000);
        request.setStream(false);
        request.setMessages(conversationHistory);
        
        OpenrouterResponse response = openrouterClient.generateCompletion(request);
        return response.getChoices().get(0).getMessage().getContent();
    }
}
\`\`\`

## API Endpoints cho tích hợp AI

\`\`\`
POST /api/ai/quiz/generate
    - Request Body: {
        "topic": "String",
        "difficulty": "String (Easy, Medium, Hard)",
        "questionCount": "Integer",
        "model": "String (optional)"
    }
    - Response: Generated quiz content

POST /api/ai/flashcard/generate
    - Request Body: {
        "topic": "String",
        "cardCount": "Integer",
        "model": "String (optional)"
    }
    - Response: Generated flashcard content

POST /api/ai/chat
    - Request Body: {
        "messages": [
            {
                "role": "String (user, assistant)",
                "content": "String"
            }
        ],
        "model": "String (optional)"
    }
    - Response: AI response message
\`\`\`

## Cấu hình trong application.properties

\`\`\`properties
# Openrouter.ai Configuration
openrouter.api.key=${OPENROUTER_API_KEY}
openrouter.api.url=https://openrouter.ai/api/v1/chat/completions
openrouter.default.model=openai/gpt-3.5-turbo
\`\`\`

## Tích hợp vào Frontend

### Service AI trong Next.js

\`\`\`typescript
// services/ai.service.ts
import { api } from './api';

export interface AIQuizRequest {
  topic: string;
  difficulty: string;
  questionCount: number;
  model?: string;
}

export interface AIFlashcardRequest {
  topic: string;
  cardCount: number;
  model?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIChatRequest {
  messages: ChatMessage[];
  model?: string;
}

export const aiService = {
  generateQuiz: async (request: AIQuizRequest): Promise<string> => {
    const response = await api.post('/api/ai/quiz/generate', request);
    return response.data;
  },
  
  generateFlashcard: async (request: AIFlashcardRequest): Promise<string> => {
    const response = await api.post('/api/ai/flashcard/generate', request);
    return response.data;
  },
  
  chat: async (request: AIChatRequest): Promise<string> => {
    const response = await api.post('/api/ai/chat', request);
    return response.data;
  }
};
\`\`\`

### Component tạo Quiz bằng AI

\`\`\`tsx
// components/quiz/AIQuizGenerator.tsx
import React, { useState } from 'react';
import { aiService, AIQuizRequest } from '../../services/ai.service';

const AIQuizGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [model, setModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const request: AIQuizRequest = {
        topic,
        difficulty,
        questionCount,
        model: model || undefined
      };
      
      const response = await aiService.generateQuiz(request);
      setResult(response);
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card">
      <div className="card-header">
        <h2>Generate Quiz with AI</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="topic">Topic</label>
            <input
              type="text"
              id="topic"
              className="form-control"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              className="form-control"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="questionCount">Number of Questions</label>
            <input
              type="number"
              id="questionCount"
              className="form-control"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              min="1"
              max="20"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="model">AI Model (Optional)</label>
            <input
              type="text"
              id="model"
              className="form-control"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Default: openai/gpt-3.5-turbo"
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Quiz'}
          </button>
        </form>
        
        {loading && <div className="mt-3">Generating your quiz...</div>}
        
        {result && (
          <div className="mt-4">
            <h3>Generated Quiz</h3>
            <pre className="bg-light p-3">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIQuizGenerator;
\`\`\`

## Các model AI miễn phí có thể sử dụng

Openrouter.ai cung cấp truy cập vào nhiều model AI miễn phí, bao gồm:

1. **openai/gpt-3.5-turbo** - Model đa năng, phù hợp cho hầu hết các tác vụ
2. **anthropic/claude-instant-v1** - Model phản hồi nhanh, phù hợp cho chat
3. **google/palm-2-chat-bison** - Model chat của Google
4. **meta-llama/llama-2-13b-chat** - Model mã nguồn mở từ Meta
5. **mistralai/mistral-7b-instruct** - Model nhỏ nhưng hiệu quả

## Xử lý và phân tích phản hồi từ AI

Phản hồi từ AI cần được xử lý và phân tích để chuyển đổi thành định dạng phù hợp với cơ sở dữ liệu của ứng dụng:

\`\`\`java
// QuizParserService.java
@Service
public class QuizParserService {
    
    public Quiz parseQuizFromAIResponse(String aiResponse, Long creatorId, String tag) {
        Quiz quiz = new Quiz();
        quiz.setTitle(extractTitle(aiResponse));
        quiz.setDescription(extractDescription(aiResponse));
        quiz.setCreatorId(creatorId);
        quiz.setTag(tag);
        quiz.setIsAiGenerated(true);
        
        List<Question> questions = extractQuestions(aiResponse);
        // Save quiz and questions to database
        
        return quiz;
    }
    
    private String extractTitle(String aiResponse) {
        // Logic to extract title from AI response
        return "AI Generated Quiz";
    }
    
    private String extractDescription(String aiResponse) {
        // Logic to extract description from AI response
        return "This quiz was generated by AI";
    }
    
    private List<Question> extractQuestions(String aiResponse) {
        // Logic to extract questions, options, correct answers, and explanations
        List<Question> questions = new ArrayList<>();
        // Parsing logic
        return questions;
    }
}
\`\`\`

## Bảo mật và giới hạn sử dụng

Để đảm bảo sử dụng API một cách hiệu quả và an toàn:

1. **Rate Limiting**: Giới hạn số lượng yêu cầu AI mỗi người dùng có thể thực hiện trong một khoảng thời gian
2. **Content Filtering**: Kiểm tra nội dung đầu vào và đầu ra để đảm bảo tuân thủ quy định
3. **Logging**: Ghi lại các yêu cầu và phản hồi để giám sát và phân tích
4. **Error Handling**: Xử lý lỗi từ API một cách thanh lịch

\`\`\`java
// RateLimitService.java
@Service
public class RateLimitService {
    
    private final Map<Long, Integer> userRequestCount = new ConcurrentHashMap<>();
    private final Map<Long, Long> userLastRequestTime = new ConcurrentHashMap<>();
    
    @Value("${openrouter.rate-limit.max-requests}")
    private int maxRequests;
    
    @Value("${openrouter.rate-limit.window-minutes}")
    private int windowMinutes;
    
    public boolean allowRequest(Long userId) {
        long currentTime = System.currentTimeMillis();
        long windowMillis = windowMinutes * 60 * 1000;
        
        // Reset count if window has passed
        if (userLastRequestTime.containsKey(userId) && 
            currentTime - userLastRequestTime.get(userId) > windowMillis) {
            userRequestCount.put(userId, 0);
        }
        
        // Update last request time
        userLastRequestTime.put(userId, currentTime);
        
        // Check and increment count
        int count = userRequestCount.getOrDefault(userId, 0);
        if (count >= maxRequests) {
            return false;
        }
        
        userRequestCount.put(userId, count + 1);
        return true;
    }
}
\`\`\`

## Kết luận

Tích hợp Openrouter.ai API vào QuizMaster AI cung cấp một giải pháp linh hoạt và mạnh mẽ cho các tính năng AI của ứng dụng. Việc sử dụng Openrouter.ai cho phép:

1. Truy cập vào nhiều model AI khác nhau, bao gồm cả các model miễn phí
2. Tùy chọn model phù hợp với từng tính năng cụ thể
3. Dễ dàng mở rộng và nâng cấp khi có model mới
4. Tối ưu chi phí bằng cách sử dụng các model miễn phí khi phù hợp

Kiến trúc được thiết kế để dễ dàng tích hợp và mở rộng, đồng thời đảm bảo hiệu suất và bảo mật.
