package com.quizmaster.controller;

import com.quizmaster.dto.request.ChatMessageRequest;
import com.quizmaster.dto.request.GenerateFlashcardRequest;
import com.quizmaster.dto.request.GenerateQuizRequest;
import com.quizmaster.dto.response.ChatMessageResponse;
import com.quizmaster.dto.response.ChatSessionResponse;
import com.quizmaster.dto.response.FlashcardResponse;
import com.quizmaster.dto.response.QuizResponse;
import com.quizmaster.dto.response.MessageResponse;
import com.quizmaster.service.OpenrouterService;
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
@RequestMapping("/ai")
@RequiredArgsConstructor
@Tag(name = "AI", description = "AI features API endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AIController {

    private final OpenrouterService openrouterService;

    @Operation(summary = "Create a new chat session", description = "Creates a new chat session for the authenticated user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Chat session created successfully", 
                    content = @Content(schema = @Schema(implementation = ChatSessionResponse.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping("/chat/sessions")
    public ResponseEntity<ChatSessionResponse> createChatSession(@RequestParam(required = false) String title) {
        return ResponseEntity.ok(openrouterService.createChatSession(title));
    }

    @Operation(summary = "Get all chat sessions", description = "Retrieves all chat sessions for the authenticated user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Chat sessions retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/chat/sessions")
    public ResponseEntity<List<ChatSessionResponse>> getUserChatSessions() {
        return ResponseEntity.ok(openrouterService.getUserChatSessions());
    }

    @Operation(summary = "Get chat session by ID", description = "Retrieves a chat session by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Chat session retrieved successfully", 
                    content = @Content(schema = @Schema(implementation = ChatSessionResponse.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "404", description = "Chat session not found")
    })
    @GetMapping("/chat/sessions/{sessionId}")
    public ResponseEntity<ChatSessionResponse> getChatSessionById(@PathVariable String sessionId) {
        return ResponseEntity.ok(openrouterService.getChatSessionById(sessionId));
    }

    @Operation(summary = "Send a chat message", description = "Sends a message to the AI and gets a response")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Message sent successfully", 
                    content = @Content(schema = @Schema(implementation = ChatMessageResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "404", description = "Chat session not found")
    })
    @PostMapping("/chat/sessions/{sessionId}/messages")
    public ResponseEntity<ChatMessageResponse> sendChatMessage(
            @PathVariable String sessionId,
            @Valid @RequestBody ChatMessageRequest request
    ) {
        return ResponseEntity.ok(openrouterService.sendChatMessage(sessionId, request));
    }

    @Operation(summary = "Generate a quiz using AI", description = "Generates a quiz based on the provided topic and parameters")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Quiz generated successfully", 
                    content = @Content(schema = @Schema(implementation = QuizResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping("/generate/quiz")
    public ResponseEntity<QuizResponse> generateQuiz(@Valid @RequestBody GenerateQuizRequest request) {
        return ResponseEntity.ok(openrouterService.generateQuiz(request));
    }

    @Operation(summary = "Generate a flashcard set using AI", description = "Generates a flashcard set based on the provided topic and parameters")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Flashcard set generated successfully", 
                    content = @Content(schema = @Schema(implementation = FlashcardResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping("/generate/flashcard")
    public ResponseEntity<FlashcardResponse> generateFlashcard(@Valid @RequestBody GenerateFlashcardRequest request) {
        return ResponseEntity.ok(openrouterService.generateFlashcard(request));
    }

    @Operation(summary = "Delete a chat session", description = "Deletes a chat session by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Chat session deleted successfully", 
                    content = @Content(schema = @Schema(implementation = MessageResponse.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - not the session owner"),
        @ApiResponse(responseCode = "404", description = "Chat session not found")
    })
    @DeleteMapping("/chat/sessions/{sessionId}")
    public ResponseEntity<MessageResponse> deleteChatSession(@PathVariable String sessionId) {
        openrouterService.deleteChatSession(sessionId);
        return ResponseEntity.ok(new MessageResponse("Chat session deleted successfully", true));
    }
}
