package com.quizmaster.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FlashcardResponse {
   private String id;
   private String title;
   private String description;
   private String createdBy;
   private LocalDateTime createdAt;
   private LocalDateTime updatedAt;
   private boolean isPublic;
   private List<String> tags;
   private int cardCount; // Added this field
   private List<CardDto> cards;
   
   // Nested CardDto class
   @Data
   @Builder
   @AllArgsConstructor
   @NoArgsConstructor
   public static class CardDto {
       private String id;
       private String front;
       private String back;
       private String imageUrl;
       private int position;
   }
}
