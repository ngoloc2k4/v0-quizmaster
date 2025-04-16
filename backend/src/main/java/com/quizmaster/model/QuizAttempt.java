package com.quizmaster.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "quiz_attempts")
public class QuizAttempt {
    
    @Id
    private String id;
    
    private String userId;
    
    private String quizId;
    
    private int score;
    
    private int totalQuestions;
    
    private int correctAnswers;
    
    private int wrongAnswers;
    
    private int unanswered;
    
    private int timeSpent; // in seconds
    
    private boolean completed;
    
    private LocalDateTime startedAt;
    
    private LocalDateTime completedAt;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
