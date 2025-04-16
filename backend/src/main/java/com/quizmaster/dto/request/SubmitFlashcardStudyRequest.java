package com.quizmaster.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubmitFlashcardStudyRequest {
    
    @NotEmpty(message = "Card results are required")
    private Map<String, Boolean> cardResults; // cardId -> remembered (true/false)
    
    private int timeSpent; // in seconds
}
