package com.quizmaster.repository;

import com.quizmaster.model.QuizAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends MongoRepository<QuizAttempt, String> {
    List<QuizAttempt> findByUserId(String userId);
    List<QuizAttempt> findByQuizId(String quizId);
    List<QuizAttempt> findByUserIdAndQuizId(String userId, String quizId);
    List<QuizAttempt> findByUserIdAndCompleted(String userId, boolean completed);
    long countByQuizId(String quizId);
}
