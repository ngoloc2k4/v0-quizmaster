package com.quizmaster.controller;

import com.quizmaster.dto.request.CreateFlashcardRequest;
import com.quizmaster.dto.request.SubmitFlashcardStudyRequest;
import com.quizmaster.dto.response.FlashcardResponse;
import com.quizmaster.dto.response.FlashcardStudyResponse;
import com.quizmaster.dto.response.MessageResponse;
import com.quizmaster.service.FlashcardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/flashcards")
@RequiredArgsConstructor
@Tag(name = "Flashcard", description = "Flashcard management API endpoints")
@SecurityRequirement(name = "bearerAuth")
public class FlashcardController {

    private final FlashcardService flashcardService;

    @Operation(summary = "Create a new flashcard", description = "Creates a new flashcard with cards")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Flashcard created successfully", 
                    content = @Content(schema = @Schema(implementation = FlashcardResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping
    public ResponseEntity<FlashcardResponse> createFlashcard(@Valid @RequestBody CreateFlashcardRequest request) {
        return ResponseEntity.ok(flashcardService.createFlashcard(request));
    }

    @Operation(summary = "Get all flashcards", description = "Retrieves all flashcards")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Flashcards retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping
    public ResponseEntity<List<FlashcardResponse>> getAllFlashcards() {
        return ResponseEntity.ok(flashcardService.getAllFlashcards());
    }

    @Operation(summary = "Get public flashcards", description = "Retrieves all public flashcards")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Public flashcards retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/public")
    public ResponseEntity<List<FlashcardResponse>> getPublicFlashcards() {
        return ResponseEntity.ok(flashcardService.getPublicFlashcards());
    }

    @Operation(summary = "Get my flashcards", description = "Retrieves flashcards created by the authenticated user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User's flashcards retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/my")
    public ResponseEntity<List<FlashcardResponse>> getMyFlashcards() {
        return ResponseEntity.ok(flashcardService.getMyFlashcards());
    }

    @Operation(summary = "Get flashcards by tag", description = "Retrieves flashcards with the specified tag")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Flashcards retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<FlashcardResponse>> getFlashcardsByTag(@PathVariable String tag) {
        return ResponseEntity.ok(flashcardService.getFlashcardsByTag(tag));
    }

    @Operation(summary = "Search flashcards", description = "Searches flashcards by title")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Flashcards retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/search")
    public ResponseEntity<List<FlashcardResponse>> searchFlashcards(@RequestParam String keyword) {
        return ResponseEntity.ok(flashcardService.searchFlashcards(keyword));
    }

    @Operation(summary = "Get flashcard by ID", description = "Retrieves a flashcard by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Flashcard retrieved successfully", 
                    content = @Content(schema = @Schema(implementation = FlashcardResponse.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "404", description = "Flashcard not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<FlashcardResponse> getFlashcardById(@PathVariable String id) {
        return ResponseEntity.ok(flashcardService.getFlashcardById(id));
    }

    @Operation(summary = "Start a flashcard study", description = "Starts a new flashcard study session")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Flashcard study started successfully", 
                    content = @Content(schema = @Schema(implementation = FlashcardStudyResponse.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "404", description = "Flashcard not found")
    })
    @PostMapping("/{id}/start")
    public ResponseEntity<FlashcardStudyResponse> startFlashcardStudy(@PathVariable String id) {
        return ResponseEntity.ok(flashcardService.startFlashcardStudy(id));
    }

    @Operation(summary = "Submit a flashcard study", description = "Submits results for a flashcard study session")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Flashcard study submitted successfully", 
                    content = @Content(schema = @Schema(implementation = FlashcardStudyResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "404", description = "Flashcard study not found")
    })
    @PostMapping("/studies/{studyId}/submit")
    public ResponseEntity<FlashcardStudyResponse> submitFlashcardStudy(
            @PathVariable String studyId,
            @Valid @RequestBody SubmitFlashcardStudyRequest request
    ) {
        return ResponseEntity.ok(flashcardService.submitFlashcardStudy(studyId, request));
    }

    @Operation(summary = "Get my flashcard studies", description = "Retrieves flashcard studies by the authenticated user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Flashcard studies retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/studies/my")
    public ResponseEntity<List<FlashcardStudyResponse>> getMyFlashcardStudies() {
        return ResponseEntity.ok(flashcardService.getMyFlashcardStudies());
    }

    @Operation(summary = "Get flashcard study by ID", description = "Retrieves a flashcard study by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Flashcard study retrieved successfully", 
                    content = @Content(schema = @Schema(implementation = FlashcardStudyResponse.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "404", description = "Flashcard study not found")
    })
    @GetMapping("/studies/{studyId}")
    public ResponseEntity<FlashcardStudyResponse> getFlashcardStudyById(@PathVariable String studyId) {
        return ResponseEntity.ok(flashcardService.getFlashcardStudyById(studyId));
    }

    @Operation(summary = "Delete a flashcard", description = "Deletes a flashcard and all its studies")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Flashcard deleted successfully", 
                    content = @Content(schema = @Schema(implementation = MessageResponse.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - not the flashcard creator"),
        @ApiResponse(responseCode = "404", description = "Flashcard not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteFlashcard(@PathVariable String id) {
        flashcardService.deleteFlashcard(id);
        return ResponseEntity.ok(new MessageResponse("Flashcard deleted successfully", true));
    }
}
