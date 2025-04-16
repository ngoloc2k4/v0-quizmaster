package com.quizmaster.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    public void sendVerificationEmail(String email, String name, String token) {
        // Implementation will be added when we have the actual SMTP configuration
        System.out.println("Sending verification email to: " + email);
        System.out.println("Token: " + token);
    }

    public void sendResetPasswordEmail(String email, String name, String token) {
        // Implementation will be added when we have the actual SMTP configuration
        System.out.println("Sending reset password email to: " + email);
        System.out.println("Token: " + token);
    }
}
