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
public class UserAdminResponse {
    private String id;
    private String username;
    private String email;
    private String fullName;
    private String avatarUrl;
    private boolean emailVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int quizzesCreated;
    private int quizzesCompleted;
    private int flashcardsCreated;
    private int flashcardsStudied;
    private int aiChatsInitiated;
    private boolean enabled;
    private boolean locked;
}
