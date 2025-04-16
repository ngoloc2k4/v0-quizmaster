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
@Document(collection = "quizzes")
public class Quiz {
    
    @Id
    private String id;
    
    @Indexed
    private String title;
    
    private String description;
    
    private List<String> tags;
    
    private String createdBy;
    
    private boolean isPublic;
    
    private int timeLimit; // in minutes, 0 means no time limit
    
    private List<Question> questions;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Question {
        private String id;
        private String text;
        private String imageUrl;
        private QuestionType type;
        private List<Option> options;
        private String explanation;
        
        public enum QuestionType {
            SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_FALSE
        }
        
        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Option {
            private String id;
            private String text;
            private boolean isCorrect;
        }
    }
}
