package com.quizmaster.service;

import com.quizmaster.dto.request.CreateQuizRequest;
import com.quizmaster.dto.request.SubmitQuizRequest;
import com.quizmaster.dto.response.QuizAttemptResponse;
import com.quizmaster.dto.response.QuizResponse;
import com.quizmaster.model.Quiz;
import com.quizmaster.model.QuizAttempt;
import com.quizmaster.repository.QuizAttemptRepository;
import com.quizmaster.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    public QuizResponse createQuiz(CreateQuizRequest request) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        // Convert questions and options from DTO to model
        List<Quiz.Question> questions = request.getQuestions().stream()
                .map(questionDto -> {
                    List<Quiz.Question.Option> options = questionDto.getOptions().stream()
                            .map(optionDto -> Quiz.Question.Option.builder()
                                    .id(UUID.randomUUID().toString())
                                    .text(optionDto.getText())
                                    .isCorrect(optionDto.isCorrect())
                                    .build())
                            .collect(Collectors.toList());
                    
                    return Quiz.Question.builder()
                            .id(UUID.randomUUID().toString())
                            .text(questionDto.getText())
                            .imageUrl(questionDto.getImageUrl())
                            .type(questionDto.getType())
                            .options(options)
                            .explanation(questionDto.getExplanation())
                            .build();
                })
                .collect(Collectors.toList());
        
        // Create and save quiz
        Quiz quiz = Quiz.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .tags(request.getTags())
                .createdBy(username)
                .isPublic(request.isPublic())
                .timeLimit(request.getTimeLimit())
                .questions(questions)
                .build();
        
        Quiz savedQuiz = quizRepository.save(quiz);
        
        // Convert to response DTO
        return mapQuizToResponse(savedQuiz);
    }
    
    public List<QuizResponse> getAllQuizzes() {
        return quizRepository.findAll().stream()
                .map(this::mapQuizToResponse)
                .collect(Collectors.toList());
    }
    
    public List<QuizResponse> getPublicQuizzes() {
        return quizRepository.findByIsPublic(true).stream()
                .map(this::mapQuizToResponse)
                .collect(Collectors.toList());
    }
    
    public List<QuizResponse> getMyQuizzes() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        return quizRepository.findByCreatedBy(username).stream()
                .map(this::mapQuizToResponse)
                .collect(Collectors.toList());
    }
    
    public List<QuizResponse> getQuizzesByTag(String tag) {
        return quizRepository.findByTagsContaining(tag).stream()
                .map(this::mapQuizToResponse)
                .collect(Collectors.toList());
    }
    
    public List<QuizResponse> searchQuizzes(String keyword) {
        return quizRepository.findByTitleContainingIgnoreCase(keyword).stream()
                .map(this::mapQuizToResponse)
                .collect(Collectors.toList());
    }
    
    public QuizResponse getQuizById(String id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        return mapQuizToResponse(quiz);
    }
    
    public QuizAttemptResponse startQuiz(String quizId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        QuizAttempt quizAttempt = QuizAttempt.builder()
                .userId(username)
                .quizId(quizId)
                .score(0)
                .totalQuestions(quiz.getQuestions().size())
                .correctAnswers(0)
                .wrongAnswers(0)
                .unanswered(quiz.getQuestions().size())
                .timeSpent(0)
                .completed(false)
                .startedAt(LocalDateTime.now())
                .build();
        
        QuizAttempt savedAttempt = quizAttemptRepository.save(quizAttempt);
        
        return mapQuizAttemptToResponse(savedAttempt, quiz.getTitle());
    }
    
    public QuizAttemptResponse submitQuiz(String attemptId, SubmitQuizRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        QuizAttempt quizAttempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Quiz attempt not found"));
        
        // Verify that the attempt belongs to the current user
        if (!quizAttempt.getUserId().equals(username)) {
            throw new RuntimeException("Unauthorized access to quiz attempt");
        }
        
        // Verify that the attempt is not already completed
        if (quizAttempt.isCompleted()) {
            throw new RuntimeException("Quiz attempt already completed");
        }
        
        Quiz quiz = quizRepository.findById(quizAttempt.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        // Calculate score
        int correctAnswers = 0;
        int wrongAnswers = 0;
        int unanswered = 0;
        
        Map<String, List<String>> userAnswers = request.getAnswers();
        
        for (Quiz.Question question : quiz.getQuestions()) {
            String questionId = question.getId();
            
            if (!userAnswers.containsKey(questionId) || userAnswers.get(questionId).isEmpty()) {
                unanswered++;
                continue;
            }
            
            List<String> selectedOptionIds = userAnswers.get(questionId);
            
            // For single choice and true/false questions
            if (question.getType() == Quiz.Question.QuestionType.SINGLE_CHOICE || 
                question.getType() == Quiz.Question.QuestionType.TRUE_FALSE) {
                
                if (selectedOptionIds.size() > 1) {
                    wrongAnswers++;
                    continue;
                }
                
                String selectedOptionId = selectedOptionIds.get(0);
                boolean isCorrect = question.getOptions().stream()
                        .filter(option -> option.getId().equals(selectedOptionId))
                        .findFirst()
                        .map(Quiz.Question.Option::isCorrect)
                        .orElse(false);
                
                if (isCorrect) {
                    correctAnswers++;
                } else {
                    wrongAnswers++;
                }
            } 
            // For multiple choice questions
            else if (question.getType() == Quiz.Question.QuestionType.MULTIPLE_CHOICE) {
                // Get all correct option IDs
                Set<String> correctOptionIds = question.getOptions().stream()
                        .filter(Quiz.Question.Option::isCorrect)
                        .map(Quiz.Question.Option::getId)
                        .collect(Collectors.toSet());
                
                // Get all selected option IDs
                Set<String> selectedOptionIdsSet = new HashSet<>(selectedOptionIds);
                
                // Check if selected options match exactly with correct options
                if (correctOptionIds.equals(selectedOptionIdsSet)) {
                    correctAnswers++;
                } else {
                    wrongAnswers++;
                }
            }
        }
        
        // Calculate score (percentage)
        int totalQuestions = quiz.getQuestions().size();
        int score = totalQuestions > 0 ? (correctAnswers * 100) / totalQuestions : 0;
        
        // Update quiz attempt
        quizAttempt.setScore(score);
        quizAttempt.setCorrectAnswers(correctAnswers);
        quizAttempt.setWrongAnswers(wrongAnswers);
        quizAttempt.setUnanswered(unanswered);
        quizAttempt.setTimeSpent(request.getTimeSpent());
        quizAttempt.setCompleted(true);
        quizAttempt.setCompletedAt(LocalDateTime.now());
        
        QuizAttempt savedAttempt = quizAttemptRepository.save(quizAttempt);
        
        return mapQuizAttemptToResponse(savedAttempt, quiz.getTitle());
    }
    
    public List<QuizAttemptResponse> getMyQuizAttempts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        List<QuizAttempt> attempts = quizAttemptRepository.findByUserId(username);
        
        return attempts.stream()
                .map(attempt -> {
                    String quizTitle = quizRepository.findById(attempt.getQuizId())
                            .map(Quiz::getTitle)
                            .orElse("Unknown Quiz");
                    
                    return mapQuizAttemptToResponse(attempt, quizTitle);
                })
                .collect(Collectors.toList());
    }
    
    public QuizAttemptResponse getQuizAttemptById(String attemptId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Quiz attempt not found"));
        
        // Verify that the attempt belongs to the current user
        if (!attempt.getUserId().equals(username)) {
            throw new RuntimeException("Unauthorized access to quiz attempt");
        }
        
        String quizTitle = quizRepository.findById(attempt.getQuizId())
                .map(Quiz::getTitle)
                .orElse("Unknown Quiz");
        
        return mapQuizAttemptToResponse(attempt, quizTitle);
    }
    
    public void deleteQuiz(String quizId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        // Verify that the quiz belongs to the current user
        if (!quiz.getCreatedBy().equals(username)) {
            throw new RuntimeException("Unauthorized access to quiz");
        }
        
        // Delete all attempts for this quiz
        List<QuizAttempt> attempts = quizAttemptRepository.findByQuizId(quizId);
        quizAttemptRepository.deleteAll(attempts);
        
        // Delete the quiz
        quizRepository.delete(quiz);
    }
    
    // Helper methods to map entities to DTOs
    private QuizResponse mapQuizToResponse(Quiz quiz) {
        List<QuizResponse.QuestionDto> questionDtos = quiz.getQuestions().stream()
                .map(question -> {
                    List<QuizResponse.QuestionDto.OptionDto> optionDtos = question.getOptions().stream()
                            .map(option -> QuizResponse.QuestionDto.OptionDto.builder()
                                    .id(option.getId())
                                    .text(option.getText())
                                    // isCorrect field is omitted in response to prevent cheating
                                    .build())
                            .collect(Collectors.toList());
                    
                    return QuizResponse.QuestionDto.builder()
                            .id(question.getId())
                            .text(question.getText())
                            .imageUrl(question.getImageUrl())
                            .type(question.getType())
                            .options(optionDtos)
                            .explanation(question.getExplanation())
                            .build();
                })
                .collect(Collectors.toList());
        
        return QuizResponse.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .tags(quiz.getTags())
                .createdBy(quiz.getCreatedBy())
                .isPublic(quiz.isPublic())
                .timeLimit(quiz.getTimeLimit())
                .questions(questionDtos)
                .createdAt(quiz.getCreatedAt())
                .updatedAt(quiz.getUpdatedAt())
                .build();
    }
    
    private QuizAttemptResponse mapQuizAttemptToResponse(QuizAttempt attempt, String quizTitle) {
        return QuizAttemptResponse.builder()
                .id(attempt.getId())
                .quizId(attempt.getQuizId())
                .quizTitle(quizTitle)
                .score(attempt.getScore())
                .totalQuestions(attempt.getTotalQuestions())
                .correctAnswers(attempt.getCorrectAnswers())
                .wrongAnswers(attempt.getWrongAnswers())
                .unanswered(attempt.getUnanswered())
                .timeSpent(attempt.getTimeSpent())
                .completed(attempt.isCompleted())
                .startedAt(attempt.getStartedAt())
                .completedAt(attempt.getCompletedAt())
                .build();
    }
}
