package com.quizmaster.repository;

import com.quizmaster.model.FlashcardStudy;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardStudyRepository extends MongoRepository<FlashcardStudy, String> {
    List<FlashcardStudy> findByUserId(String userId);
    List<FlashcardStudy> findByFlashcardId(String flashcardId);
    List<FlashcardStudy> findByUserIdAndFlashcardId(String userId, String flashcardId);
    List<FlashcardStudy> findByUserIdAndCompleted(String userId, boolean completed);
    long countByFlashcardId(String flashcardId);
}
