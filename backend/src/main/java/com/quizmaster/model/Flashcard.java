package com.quizmaster.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "flashcards")
public class Flashcard {
    
    @Id
    private String id;
    
    @Indexed
    private String title;
    
    private String description;
    
    private List<String> tags;
    
    private String createdBy;
    
    private boolean isPublic;
    
    private List<Card> cards;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Card {
        private String id;
        private String front;
        private String back;
        private String imageUrl;
        private int position;
    }
}
