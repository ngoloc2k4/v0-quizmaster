package com.quizmaster.service;

import com.quizmaster.dto.request.CreateFlashcardRequest;
import com.quizmaster.dto.request.SubmitFlashcardStudyRequest;
import com.quizmaster.dto.response.FlashcardResponse;
import com.quizmaster.dto.response.FlashcardStudyResponse;
import com.quizmaster.dto.response.MessageResponse;
import com.quizmaster.model.Flashcard;
import com.quizmaster.model.FlashcardStudy;
import com.quizmaster.repository.FlashcardRepository;
import com.quizmaster.repository.FlashcardStudyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;
    private final FlashcardStudyRepository flashcardStudyRepository;

    public FlashcardResponse createFlashcard(CreateFlashcardRequest request) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        // Convert cards from DTO to model
        List<Flashcard.Card> cards = request.getCards().stream()
                .map(cardDto -> Flashcard.Card.builder()
                        .id(UUID.randomUUID().toString())
                        .front(cardDto.getFront())
                        .back(cardDto.getBack())
                        .imageUrl(cardDto.getImageUrl())
                        .position(cardDto.getPosition())
                        .build())
                .collect(Collectors.toList());
        
        // Create and save flashcard
        Flashcard flashcard = Flashcard.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .tags(request.getTags())
                .createdBy(username)
                .isPublic(request.isPublic())
                .cards(cards)
                .build();
        
        Flashcard savedFlashcard = flashcardRepository.save(flashcard);
        
        // Convert to response DTO
        return mapFlashcardToResponse(savedFlashcard);
    }
    
    public List<FlashcardResponse> getAllFlashcards() {
        return flashcardRepository.findAll().stream()
                .map(this::mapFlashcardToResponse)
                .collect(Collectors.toList());
    }
    
    public List<FlashcardResponse> getPublicFlashcards() {
        return flashcardRepository.findByIsPublic(true).stream()
                .map(this::mapFlashcardToResponse)
                .collect(Collectors.toList());
    }
    
    public List<FlashcardResponse> getMyFlashcards() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        return flashcardRepository.findByCreatedBy(username).stream()
                .map(this::mapFlashcardToResponse)
                .collect(Collectors.toList());
    }
    
    public List<FlashcardResponse> getFlashcardsByTag(String tag) {
        return flashcardRepository.findByTagsContaining(tag).stream()
                .map(this::mapFlashcardToResponse)
                .collect(Collectors.toList());
    }
    
    public List<FlashcardResponse> searchFlashcards(String keyword) {
        return flashcardRepository.findByTitleContainingIgnoreCase(keyword).stream()
                .map(this::mapFlashcardToResponse)
                .collect(Collectors.toList());
    }
    
    public FlashcardResponse getFlashcardById(String id) {
        Flashcard flashcard = flashcardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flashcard not found"));
        
        return mapFlashcardToResponse(flashcard);
    }
    
    public FlashcardStudyResponse startFlashcardStudy(String flashcardId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new RuntimeException("Flashcard not found"));
        
        FlashcardStudy flashcardStudy = FlashcardStudy.builder()
                .userId(username)
                .flashcardId(flashcardId)
                .totalCards(flashcard.getCards().size())
                .cardsStudied(0)
                .cardsRemembered(0)
                .cardsToReview(flashcard.getCards().size())
                .completed(false)
                .startedAt(LocalDateTime.now())
                .build();
        
        FlashcardStudy savedStudy = flashcardStudyRepository.save(flashcardStudy);
        
        return mapFlashcardStudyToResponse(savedStudy, flashcard.getTitle());
    }
    
    public FlashcardStudyResponse submitFlashcardStudy(String studyId, SubmitFlashcardStudyRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        FlashcardStudy flashcardStudy = flashcardStudyRepository.findById(studyId)
                .orElseThrow(() -> new RuntimeException("Flashcard study not found"));
        
        // Verify that the study belongs to the current user
        if (!flashcardStudy.getUserId().equals(username)) {
            throw new RuntimeException("Unauthorized access to flashcard study");
        }
        
        // Verify that the study is not already completed
        if (flashcardStudy.isCompleted()) {
            throw new RuntimeException("Flashcard study already completed");
        }
        
        Flashcard flashcard = flashcardRepository.findById(flashcardStudy.getFlashcardId())
                .orElseThrow(() -> new RuntimeException("Flashcard not found"));
        
        // Calculate study results
        int cardsStudied = request.getCardResults().size();
        int cardsRemembered = (int) request.getCardResults().values().stream()
                .filter(remembered -> remembered)
                .count();
        int cardsToReview = flashcardStudy.getTotalCards() - cardsRemembered;
        
        // Update flashcard study
        flashcardStudy.setCardsStudied(cardsStudied);
        flashcardStudy.setCardsRemembered(cardsRemembered);
        flashcardStudy.setCardsToReview(cardsToReview);
        flashcardStudy.setTimeSpent(request.getTimeSpent());
        flashcardStudy.setCompleted(true);
        flashcardStudy.setCompletedAt(LocalDateTime.now());
        
        FlashcardStudy savedStudy = flashcardStudyRepository.save(flashcardStudy);
        
        return mapFlashcardStudyToResponse(savedStudy, flashcard.getTitle());
    }
    
    public List<FlashcardStudyResponse> getMyFlashcardStudies() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        List<FlashcardStudy> studies = flashcardStudyRepository.findByUserId(username);
        
        return studies.stream()
                .map(study -> {
                    String flashcardTitle = flashcardRepository.findById(study.getFlashcardId())
                            .map(Flashcard::getTitle)
                            .orElse("Unknown Flashcard");
                    
                    return mapFlashcardStudyToResponse(study, flashcardTitle);
                })
                .collect(Collectors.toList());
    }
    
    public FlashcardStudyResponse getFlashcardStudyById(String studyId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        FlashcardStudy study = flashcardStudyRepository.findById(studyId)
                .orElseThrow(() -> new RuntimeException("Flashcard study not found"));
        
        // Verify that the study belongs to the current user
        if (!study.getUserId().equals(username)) {
            throw new RuntimeException("Unauthorized access to flashcard study");
        }
        
        String flashcardTitle = flashcardRepository.findById(study.getFlashcardId())
                .map(Flashcard::getTitle)
                .orElse("Unknown Flashcard");
        
        return mapFlashcardStudyToResponse(study, flashcardTitle);
    }
    
    public void deleteFlashcard(String flashcardId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new RuntimeException("Flashcard not found"));
        
        // Verify that the flashcard belongs to the current user
        if (!flashcard.getCreatedBy().equals(username)) {
            throw new RuntimeException("Unauthorized access to flashcard");
        }
        
        // Delete all studies for this flashcard
        List<FlashcardStudy> studies = flashcardStudyRepository.findByFlashcardId(flashcardId);
        flashcardStudyRepository.deleteAll(studies);
        
        // Delete the flashcard
        flashcardRepository.delete(flashcard);
    }
    
    // Helper methods to map entities to DTOs
    private FlashcardResponse mapFlashcardToResponse(Flashcard flashcard) {
        List<FlashcardResponse.CardDto> cardDtos = flashcard.getCards().stream()
                .map(card -> FlashcardResponse.CardDto.builder()
                        .id(card.getId())
                        .front(card.getFront())
                        .back(card.getBack())
                        .imageUrl(card.getImageUrl())
                        .position(card.getPosition())
                        .build())
                .collect(Collectors.toList());
        
        return FlashcardResponse.builder()
                .id(flashcard.getId())
                .title(flashcard.getTitle())
                .description(flashcard.getDescription())
                .tags(flashcard.getTags())
                .createdBy(flashcard.getCreatedBy())
                .isPublic(flashcard.isPublic())
                .cards(cardDtos)
                .createdAt(flashcard.getCreatedAt())
                .updatedAt(flashcard.getUpdatedAt())
                .build();
    }
    
    private FlashcardStudyResponse mapFlashcardStudyToResponse(FlashcardStudy study, String flashcardTitle) {
        return FlashcardStudyResponse.builder()
                .id(study.getId())
                .flashcardId(study.getFlashcardId())
                .flashcardTitle(flashcardTitle)
                .totalCards(study.getTotalCards())
                .cardsStudied(study.getCardsStudied())
                .cardsRemembered(study.getCardsRemembered())
                .cardsToReview(study.getCardsToReview())
                .completed(study.isCompleted())
                .timeSpent(study.getTimeSpent())
                .startedAt(study.getStartedAt())
                .completedAt(study.getCompletedAt())
                .build();
    }
}
