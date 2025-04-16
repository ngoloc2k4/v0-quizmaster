package com.quizmaster.dto.response;

import com.quizmaster.model.Quiz;
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
public class QuizResponse {
   private String id;
   private String title;
   private String description;
   private String createdBy;
   private LocalDateTime createdAt;
   private LocalDateTime updatedAt;
   private boolean isPublic;
   private List<String> tags;
   private int timeLimit;
   private int questionCount; // Added this field
   private List<QuestionDto> questions;
   
   // Nested QuestionDto class
   @Data
   @Builder
   @AllArgsConstructor
   @NoArgsConstructor
   public static class QuestionDto {
       private String id;
       private String text;
       private String imageUrl;
       private Quiz.Question.QuestionType type;
       private List<OptionDto> options;
       private String explanation;
       
       @Data
       @Builder
       @AllArgsConstructor
       @NoArgsConstructor
       public static class OptionDto {
           private String id;
           private String text;
           // isCorrect is omitted in response to prevent cheating
       }
   }
}
