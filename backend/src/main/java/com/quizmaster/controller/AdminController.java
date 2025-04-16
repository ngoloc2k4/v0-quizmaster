package com.quizmaster.controller;

import com.quizmaster.dto.request.UpdateUserStatusRequest;
import com.quizmaster.dto.response.AdminDashboardStatsResponse;
import com.quizmaster.dto.response.FlashcardResponse;
import com.quizmaster.dto.response.MessageResponse;
import com.quizmaster.dto.response.QuizResponse;
import com.quizmaster.dto.response.UserAdminResponse;
import com.quizmaster.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin dashboard API endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;

    @Operation(summary = "Get dashboard statistics", description = "Retrieves statistics for the admin dashboard")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully", 
                    content = @Content(schema = @Schema(implementation = AdminDashboardStatsResponse.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - not an admin")
    })
    @GetMapping("/dashboard/stats")
    public ResponseEntity<AdminDashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @Operation(summary = "Get all users", description = "Retrieves all users with pagination")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - not an admin")
    })
    @GetMapping("/users")
    public ResponseEntity<Page<UserAdminResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        return ResponseEntity.ok(adminService.getAllUsers(pageable));
    }

    @Operation(summary = "Get user by ID", description = "Retrieves a user by their ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User retrieved successfully", 
                    content = @Content(schema = @Schema(implementation = UserAdminResponse.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - not an admin"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/users/{userId}")
    public ResponseEntity<UserAdminResponse> getUserById(@PathVariable String userId) {
        return ResponseEntity.ok(adminService.getUserById(userId));
    }

    @Operation(summary = "Update user status", description = "Updates a user's enabled and locked status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User status updated successfully", 
                    content = @Content(schema = @Schema(implementation = UserAdminResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - not an admin"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PutMapping("/users/status")
    public ResponseEntity<UserAdminResponse> updateUserStatus(@Valid @RequestBody UpdateUserStatusRequest request) {
        return ResponseEntity.ok(adminService.updateUserStatus(request));
    }

    @Operation(summary = "Get recent quizzes", description = "Retrieves the most recently created quizzes")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Quizzes retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - not an admin")
    })
    @GetMapping("/recent/quizzes")
    public ResponseEntity<List<QuizResponse>> getRecentQuizzes(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(adminService.getRecentQuizzes(limit));
    }

    @Operation(summary = "Get recent flashcards", description = "Retrieves the most recently created flashcards")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Flashcards retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - not an admin")
    })
    @GetMapping("/recent/flashcards")
    public ResponseEntity<List<FlashcardResponse>> getRecentFlashcards(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(adminService.getRecentFlashcards(limit));
    }
}
