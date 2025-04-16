package com.quizmaster.dto.request;

import com.quizmaster.model.Quiz;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateQuizRequest {
    
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;
    
    private String description;
    
    private List<String> tags;
    
    private boolean isPublic;
    
    private int timeLimit; // in minutes, 0 means no time limit
    
    @NotEmpty(message = "At least one question is required")
    @Valid
    private List<QuestionDto> questions;
    
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class QuestionDto {
        @NotBlank(message = "Question text is required")
        private String text;
        
        private String imageUrl;
        
        private Quiz.Question.QuestionType type;
        
        @NotEmpty(message = "At least two options are required")
        @Valid
        private List<OptionDto> options;
        
        private String explanation;
        
        @Data
        @Builder
        @AllArgsConstructor
        @NoArgsConstructor
        public static class OptionDto {
            @NotBlank(message = "Option text is required")
            private String text;
            
            private boolean isCorrect;
        }
    }
}
