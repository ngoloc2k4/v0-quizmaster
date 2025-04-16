package com.quizmaster.dto.request;

import jakarta.validation.constraints.NotBlank;
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
public class GenerateFlashcardRequest {
    
    @NotBlank(message = "Topic is required")
    @Size(max = 200, message = "Topic must be less than 200 characters")
    private String topic;
    
    private int numberOfCards;
    
    private List<String> tags;
    
    private String model;
}
