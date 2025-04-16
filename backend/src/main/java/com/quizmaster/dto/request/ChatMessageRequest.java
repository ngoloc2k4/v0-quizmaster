package com.quizmaster.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageRequest {
    
    @NotBlank(message = "Message content is required")
    @Size(max = 2000, message = "Message content must be less than 2000 characters")
    private String content;
    
    private String model;
}
