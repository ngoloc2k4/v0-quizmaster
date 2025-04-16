package com.quizmaster.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubmitQuizRequest {
    
    @NotEmpty(message = "Answers are required")
    private Map<String, List<String>> answers; // questionId -> list of selected optionIds
    
    private int timeSpent; // in seconds
}
