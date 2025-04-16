package com.quizmaster.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_sessions")
public class ChatSession {
    
    @Id
    private String id;
    
    private String userId;
    
    private String title;
    
    @Builder.Default
    private List<ChatMessage> messages = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatMessage {
        private String id;
        private String content;
        private String role; // user or assistant
        private String model;
        private LocalDateTime timestamp;
    }
}
