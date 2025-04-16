package com.quizmaster.dto.request;

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
public class CreateFlashcardRequest {
    
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;
    
    private String description;
    
    private List<String> tags;
    
    private boolean isPublic;
    
    @NotEmpty(message = "At least one card is required")
    @Valid
    private List<CardDto> cards;
    
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CardDto {
        @NotBlank(message = "Front content is required")
        private String front;
        
        @NotBlank(message = "Back content is required")
        private String back;
        
        private String imageUrl;
        
        private int position;
    }
}
