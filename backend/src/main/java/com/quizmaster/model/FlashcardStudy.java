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
@Document(collection = "flashcard_studies")
public class FlashcardStudy {
    
    @Id
    private String id;
    
    private String userId;
    
    private String flashcardId;
    
    private int totalCards;
    
    private int cardsStudied;
    
    private int cardsRemembered;
    
    private int cardsToReview;
    
    private boolean completed;
    
    private int timeSpent; // in seconds
    
    private LocalDateTime startedAt;
    
    private LocalDateTime completedAt;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
