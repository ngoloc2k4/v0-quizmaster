package com.quizmaster.dto.response;

import com.quizmaster.model.ChatSession;
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
public class ChatSessionResponse {
    
    private String id;
    private String title;
    private List<ChatMessageResponse> messages;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
