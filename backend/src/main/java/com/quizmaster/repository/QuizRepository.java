package com.quizmaster.repository;

import com.quizmaster.model.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QuizRepository extends MongoRepository<Quiz, String> {
    List<Quiz> findByCreatedBy(String createdBy);
    List<Quiz> findByIsPublicTrue();
    List<Quiz> findByIsPublic(boolean isPublic);
    List<Quiz> findByTitleContainingIgnoreCase(String title);
    List<Quiz> findByTagsContaining(String tag);
    List<Quiz> findTop10ByOrderByCreatedAtDesc();
    long countByCreatedAtAfter(LocalDateTime date);
}
