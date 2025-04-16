package com.quizmaster.controller;

import com.quizmaster.dto.request.CreateQuizRequest;
import com.quizmaster.dto.request.SubmitQuizRequest;
import com.quizmaster.dto.response.MessageResponse;
import com.quizmaster.dto.response.QuizAttemptResponse;
import com.quizmaster.dto.response.QuizResponse;
import com.quizmaster.service.QuizService;
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
@RequestMapping("/quizzes")
@RequiredArgsConstructor
@Tag(name = "Quiz", description = "Quiz management API endpoints")
@SecurityRequirement(name = "bearerAuth")
public class QuizController {

    private final QuizService quizService;

    @Operation(summary = "Create a new quiz", description = "Creates a new quiz with questions and options")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Quiz created successfully", 
                    content = @Content(schema = @Schema(implementation = QuizResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping
    public ResponseEntity<QuizResponse> createQuiz(@Valid @RequestBody CreateQuizRequest request) {
        return ResponseEntity.ok(quizService.createQuiz(request));
    }

    @Operation(summary = "Get all quizzes", description = "Retrieves all quizzes")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Quizzes retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping
    public ResponseEntity<List<QuizResponse>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    @Operation(summary = "Get public quizzes", description = "Retrieves all public quizzes")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Public quizzes retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/public")
    public ResponseEntity<List<QuizResponse>> getPublicQuizzes() {
        return ResponseEntity.ok(quizService.getPublicQuizzes());
    }

    @Operation(summary = "Get my quizzes", description = "Retrieves quizzes created by the authenticated user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User's quizzes retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/my")
    public ResponseEntity<List<QuizResponse>> getMyQuizzes() {
        return ResponseEntity.ok(quizService.getMyQuizzes());
    }

    @Operation(summary = "Get quizzes by tag", description = "Retrieves quizzes with the specified tag")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Quizzes retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<QuizResponse>> getQuizzesByTag(@PathVariable String tag) {
        return ResponseEntity.ok(quizService.getQuizzesByTag(tag));
    }

    @Operation(summary = "Search quizzes", description = "Searches quizzes by title")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Quizzes retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/search")
    public ResponseEntity<List<QuizResponse>> searchQuizzes(@RequestParam String keyword) {
        return ResponseEntity.ok(quizService.searchQuizzes(keyword));
    }

    @Operation(summary = "Get quiz by ID", description = "Retrieves a quiz by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Quiz retrieved successfully", 
                    content = @Content(schema = @Schema(implementation = QuizResponse.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "404", description = "Quiz not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<QuizResponse> getQuizById(@PathVariable String id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @Operation(summary = "Start a quiz", description = "Starts a new quiz attempt")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Quiz attempt started successfully", 
                    content = @Content(schema = @Schema(implementation = QuizAttemptResponse.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "404", description = "Quiz not found")
    })
    @PostMapping("/{id}/start")
    public ResponseEntity<QuizAttemptResponse> startQuiz(@PathVariable String id) {
        return ResponseEntity.ok(quizService.startQuiz(id));
    }

    @Operation(summary = "Submit a quiz attempt", description = "Submits answers for a quiz attempt")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Quiz attempt submitted successfully", 
                    content = @Content(schema = @Schema(implementation = QuizAttemptResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "404", description = "Quiz attempt not found")
    })
    @PostMapping("/attempts/{attemptId}/submit")
    public ResponseEntity<QuizAttemptResponse> submitQuiz(
            @PathVariable String attemptId,
            @Valid @RequestBody SubmitQuizRequest request
    ) {
        return ResponseEntity.ok(quizService.submitQuiz(attemptId, request));
    }

    @Operation(summary = "Get my quiz attempts", description = "Retrieves quiz attempts by the authenticated user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Quiz attempts retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/attempts/my")
    public ResponseEntity<List<QuizAttemptResponse>> getMyQuizAttempts() {
        return ResponseEntity.ok(quizService.getMyQuizAttempts());
    }

    @Operation(summary = "Get quiz attempt by ID", description = "Retrieves a quiz attempt by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Quiz attempt retrieved successfully", 
                    content = @Content(schema = @Schema(implementation = QuizAttemptResponse.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "404", description = "Quiz attempt not found")
    })
    @GetMapping("/attempts/{attemptId}")
    public ResponseEntity<QuizAttemptResponse> getQuizAttemptById(@PathVariable String attemptId) {
        return ResponseEntity.ok(quizService.getQuizAttemptById(attemptId));
    }

    @Operation(summary = "Delete a quiz", description = "Deletes a quiz and all its attempts")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Quiz deleted successfully", 
                    content = @Content(schema = @Schema(implementation = MessageResponse.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - not the quiz creator"),
        @ApiResponse(responseCode = "404", description = "Quiz not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteQuiz(@PathVariable String id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.ok(new MessageResponse("Quiz deleted successfully", true));
    }
}
