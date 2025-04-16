package com.quizmaster.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserStatusRequest {
    @NotBlank(message = "User ID is required")
    private String userId;
    
    private boolean enabled;
    private boolean locked;
}
