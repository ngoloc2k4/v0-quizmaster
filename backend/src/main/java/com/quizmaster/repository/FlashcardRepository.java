package com.quizmaster.repository;

import com.quizmaster.model.Flashcard;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlashcardRepository extends MongoRepository<Flashcard, String> {
    List<Flashcard> findByCreatedBy(String createdBy);
    List<Flashcard> findByIsPublicTrue();
    List<Flashcard> findByIsPublic(boolean isPublic);
    List<Flashcard> findByTitleContainingIgnoreCase(String title);
    List<Flashcard> findByTagsContaining(String tag);
    List<Flashcard> findTop10ByOrderByCreatedAtDesc();
    long countByCreatedAtAfter(LocalDateTime date);
}
