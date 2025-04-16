package com.quizmaster.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardStatsResponse {
    private long totalUsers;
    private long totalActiveUsers;
    private long totalQuizzes;
    private long totalFlashcards;
    private long totalQuizAttempts;
    private long totalFlashcardStudies;
    private long totalAiChats;
    private long newUsersToday;
    private long newUsersThisWeek;
    private long newUsersThisMonth;
    private long quizzesCreatedToday;
    private long quizzesCreatedThisWeek;
    private long quizzesCreatedThisMonth;
    private long flashcardsCreatedToday;
    private long flashcardsCreatedThisWeek;
    private long flashcardsCreatedThisMonth;
}
