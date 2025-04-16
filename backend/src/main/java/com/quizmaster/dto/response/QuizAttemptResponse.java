package com.quizmaster.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuizAttemptResponse {
    
    private String id;
    private String quizId;
    private String quizTitle;
    private int score;
    private int totalQuestions;
    private int correctAnswers;
    private int wrongAnswers;
    private int unanswered;
    private int timeSpent; // in seconds
    private boolean completed;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
