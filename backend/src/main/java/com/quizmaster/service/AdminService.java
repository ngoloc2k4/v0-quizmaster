package com.quizmaster.service;

import com.quizmaster.dto.request.UpdateUserStatusRequest;
import com.quizmaster.dto.response.AdminDashboardStatsResponse;
import com.quizmaster.dto.response.UserAdminResponse;
import com.quizmaster.model.Flashcard;
import com.quizmaster.model.FlashcardStudy;
import com.quizmaster.model.Quiz;
import com.quizmaster.model.QuizAttempt;
import com.quizmaster.model.ChatSession;
import com.quizmaster.model.User;
import com.quizmaster.repository.ChatSessionRepository;
import com.quizmaster.repository.FlashcardRepository;
import com.quizmaster.repository.FlashcardStudyRepository;
import com.quizmaster.repository.QuizAttemptRepository;
import com.quizmaster.repository.QuizRepository;
import com.quizmaster.repository.UserRepository;
import com.quizmaster.dto.response.QuizResponse;
import com.quizmaster.dto.response.FlashcardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

   private final UserRepository userRepository;
   private final QuizRepository quizRepository;
   private final QuizAttemptRepository quizAttemptRepository;
   private final FlashcardRepository flashcardRepository;
   private final FlashcardStudyRepository flashcardStudyRepository;
   private final ChatSessionRepository chatSessionRepository;

   @PreAuthorize("hasRole('ADMIN')")
   public AdminDashboardStatsResponse getDashboardStats() {
       LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
       LocalDateTime startOfWeek = today.minusDays(today.getDayOfWeek().getValue() - 1);
       LocalDateTime startOfMonth = today.withDayOfMonth(1);

       long totalUsers = userRepository.count();
       long totalActiveUsers = userRepository.countByEnabledTrue();
       long totalQuizzes = quizRepository.count();
       long totalFlashcards = flashcardRepository.count();
       long totalQuizAttempts = quizAttemptRepository.count();
       long totalFlashcardStudies = flashcardStudyRepository.count();
       long totalAiChats = chatSessionRepository.count();

       long newUsersToday = userRepository.countByCreatedAtAfter(today);
       long newUsersThisWeek = userRepository.countByCreatedAtAfter(startOfWeek);
       long newUsersThisMonth = userRepository.countByCreatedAtAfter(startOfMonth);

       long quizzesCreatedToday = quizRepository.countByCreatedAtAfter(today);
       long quizzesCreatedThisWeek = quizRepository.countByCreatedAtAfter(startOfWeek);
       long quizzesCreatedThisMonth = quizRepository.countByCreatedAtAfter(startOfMonth);

       long flashcardsCreatedToday = flashcardRepository.countByCreatedAtAfter(today);
       long flashcardsCreatedThisWeek = flashcardRepository.countByCreatedAtAfter(startOfWeek);
       long flashcardsCreatedThisMonth = flashcardRepository.countByCreatedAtAfter(startOfMonth);

       return AdminDashboardStatsResponse.builder()
               .totalUsers(totalUsers)
               .totalActiveUsers(totalActiveUsers)
               .totalQuizzes(totalQuizzes)
               .totalFlashcards(totalFlashcards)
               .totalQuizAttempts(totalQuizAttempts)
               .totalFlashcardStudies(totalFlashcardStudies)
               .totalAiChats(totalAiChats)
               .newUsersToday(newUsersToday)
               .newUsersThisWeek(newUsersThisWeek)
               .newUsersThisMonth(newUsersThisMonth)
               .quizzesCreatedToday(quizzesCreatedToday)
               .quizzesCreatedThisWeek(quizzesCreatedThisWeek)
               .quizzesCreatedThisMonth(quizzesCreatedThisMonth)
               .flashcardsCreatedToday(flashcardsCreatedToday)
               .flashcardsCreatedThisWeek(flashcardsCreatedThisWeek)
               .flashcardsCreatedThisMonth(flashcardsCreatedThisMonth)
               .build();
   }

   @PreAuthorize("hasRole('ADMIN')")
   public Page<UserAdminResponse> getAllUsers(Pageable pageable) {
       Page<User> users = userRepository.findAll(pageable);
       return users.map(this::mapToUserAdminResponse);
   }

   @PreAuthorize("hasRole('ADMIN')")
   public UserAdminResponse getUserById(String userId) {
       User user = userRepository.findById(userId)
               .orElseThrow(() -> new RuntimeException("User not found"));
       return mapToUserAdminResponse(user);
   }

   @PreAuthorize("hasRole('ADMIN')")
   public UserAdminResponse updateUserStatus(UpdateUserStatusRequest request) {
       User user = userRepository.findById(request.getUserId())
               .orElseThrow(() -> new RuntimeException("User not found"));
       
       user.setEnabled(request.isEnabled());
       user.setLocked(request.isLocked());
       
       User updatedUser = userRepository.save(user);
       return mapToUserAdminResponse(updatedUser);
   }

   @PreAuthorize("hasRole('ADMIN')")
   public List<QuizResponse> getRecentQuizzes(int limit) {
       List<Quiz> quizzes = quizRepository.findTop10ByOrderByCreatedAtDesc();
       return quizzes.stream()
               .map(quiz -> {
                   // Map Quiz to QuizResponse
                   return QuizResponse.builder()
                           .id(quiz.getId())
                           .title(quiz.getTitle())
                           .description(quiz.getDescription())
                           .createdBy(quiz.getCreatedBy())
                           .createdAt(quiz.getCreatedAt())
                           .isPublic(quiz.isPublic())
                           .tags(quiz.getTags())
                           .questionCount(quiz.getQuestions().size())
                           .build();
               })
               .limit(limit)
               .collect(Collectors.toList());
   }

   @PreAuthorize("hasRole('ADMIN')")
   public List<FlashcardResponse> getRecentFlashcards(int limit) {
       List<Flashcard> flashcards = flashcardRepository.findTop10ByOrderByCreatedAtDesc();
       return flashcards.stream()
               .map(flashcard -> {
                   // Map Flashcard to FlashcardResponse
                   return FlashcardResponse.builder()
                           .id(flashcard.getId())
                           .title(flashcard.getTitle())
                           .description(flashcard.getDescription())
                           .createdBy(flashcard.getCreatedBy())
                           .createdAt(flashcard.getCreatedAt())
                           .isPublic(flashcard.isPublic())
                           .tags(flashcard.getTags())
                           .cardCount(flashcard.getCards().size())
                           .build();
               })
               .limit(limit)
               .collect(Collectors.toList());
   }

   private UserAdminResponse mapToUserAdminResponse(User user) {
       return UserAdminResponse.builder()
               .id(user.getId())
               .username(user.getUsername())
               .email(user.getEmail())
               .fullName(user.getFullName())
               .avatarUrl(user.getAvatarUrl())
               .emailVerified(user.isEmailVerified())
               .createdAt(user.getCreatedAt())
               .updatedAt(user.getUpdatedAt())
               .quizzesCreated(user.getQuizzesCreated())
               .quizzesCompleted(user.getQuizzesCompleted())
               .flashcardsCreated(user.getFlashcardsCreated())
               .flashcardsStudied(user.getFlashcardsStudied())
               .aiChatsInitiated(user.getAiChatsInitiated())
               .enabled(user.isEnabled())
               .locked(user.isLocked())
               .build();
   }
}
