package com.quizmaster.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageResponse {
    
    private String id;
    private String content;
    private String role; // user or assistant
    private String model;
    private LocalDateTime timestamp;
}
