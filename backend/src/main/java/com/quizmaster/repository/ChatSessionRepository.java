package com.quizmaster.repository;

import com.quizmaster.model.ChatSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatSessionRepository extends MongoRepository<ChatSession, String> {
    List<ChatSession> findByUserId(String userId);
    List<ChatSession> findByUserIdOrderByUpdatedAtDesc(String userId);
}
