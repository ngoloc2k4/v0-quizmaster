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
public class FlashcardStudyResponse {
    
    private String id;
    private String flashcardId;
    private String flashcardTitle;
    private int totalCards;
    private int cardsStudied;
    private int cardsRemembered;
    private int cardsToReview;
    private boolean completed;
    private int timeSpent; // in seconds
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
