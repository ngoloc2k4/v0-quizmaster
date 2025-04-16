package com.quizmaster.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User implements UserDetails {
    
    @Id
    private String id;
    
    private String username;
    
    private String email;
    
    private String password;
    
    private String fullName;
    
    private String avatarUrl;
    
    @Builder.Default
    private List<String> roles = new ArrayList<>();
    
    private boolean emailVerified;
    
    private String verificationToken;
    
    private LocalDateTime verificationTokenExpiry;
    
    private String resetPasswordToken;
    
    private LocalDateTime resetPasswordTokenExpiry;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Admin dashboard statistics
    private int quizzesCreated;
    
    private int quizzesCompleted;
    
    private int flashcardsCreated;
    
    private int flashcardsStudied;
    
    private int aiChatsInitiated;
    
    private boolean enabled;
    
    private boolean locked;
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList());
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !locked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
