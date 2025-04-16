# QuizMaster AI - API Endpoints

## Overview

Tài liệu này mô tả chi tiết các API endpoints của hệ thống QuizMaster AI. Các endpoints được tổ chức theo chức năng và bao gồm thông tin về phương thức HTTP, URL, tham số, body request, response và mã trạng thái.

## Base URL

\`\`\`
https://api.quizmaster-ai.com/api/v1
\`\`\`

## Authentication

Hầu hết các endpoints yêu cầu xác thực bằng JWT token. Token phải được gửi trong header của request:

\`\`\`
Authorization: Bearer {jwt_token}
\`\`\`

## 1. Authentication API

### 1.1. Đăng ký người dùng

\`\`\`
POST /auth/register
\`\`\`

**Request Body:**
\`\`\`json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "fullName": "John Doe"
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "id": 1,
  "username": "johndoe",
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "role": "USER",
  "createdAt": "2025-04-15T10:30:00Z"
}
\`\`\`

### 1.2. Đăng nhập

\`\`\`
POST /auth/login
\`\`\`

**Request Body:**
\`\`\`json
{
  "username": "johndoe",
  "password": "securePassword123"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "role": "USER"
  }
}
\`\`\`

### 1.3. Đăng xuất

\`\`\`
POST /auth/logout
\`\`\`

**Request Body:**
\`\`\`json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "message": "Logged out successfully"
}
\`\`\`

### 1.4. Làm mới token

\`\`\`
POST /auth/refresh-token
\`\`\`

**Request Body:**
\`\`\`json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
\`\`\`

### 1.5. Quên mật khẩu

\`\`\`
POST /auth/forgot-password
\`\`\`

**Request Body:**
\`\`\`json
{
  "email": "john.doe@example.com"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "message": "Password reset email sent successfully"
}
\`\`\`

### 1.6. Đặt lại mật khẩu

\`\`\`
POST /auth/reset-password
\`\`\`

**Request Body:**
\`\`\`json
{
  "token": "reset-token-from-email",
  "password": "newSecurePassword123"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "message": "Password reset successfully"
}
\`\`\`

### 1.7. Xác minh email

\`\`\`
GET /auth/verify-email?token={verification_token}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "message": "Email verified successfully"
}
\`\`\`

## 2. User API

### 2.1. Lấy thông tin người dùng hiện tại

\`\`\`
GET /users/me
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": 1,
  "username": "johndoe",
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "avatarUrl": "https://example.com/avatars/johndoe.jpg",
  "role": "USER",
  "createdAt": "2025-04-15T10:30:00Z"
}
\`\`\`

### 2.2. Cập nhật thông tin người dùng

\`\`\`
PUT /users/me
\`\`\`

**Request Body:**
\`\`\`json
{
  "fullName": "John Smith Doe",
  "avatarUrl": "https://example.com/avatars/johndoe_new.jpg"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": 1,
  "username": "johndoe",
  "email": "john.doe@example.com",
  "fullName": "John Smith Doe",
  "avatarUrl": "https://example.com/avatars/johndoe_new.jpg",
  "role": "USER",
  "createdAt": "2025-04-15T10:30:00Z",
  "updatedAt": "2025-04-15T11:45:00Z"
}
\`\`\`

### 2.3. Đổi mật khẩu

\`\`\`
PUT /users/me/password
\`\`\`

**Request Body:**
\`\`\`json
{
  "currentPassword": "securePassword123",
  "newPassword": "evenMoreSecurePassword456"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "message": "Password changed successfully"
}
\`\`\`

## 3. Quiz API

### 3.1. Lấy danh sách quiz

\`\`\`
GET /quizzes?page={page}&size={size}&tag={tag}
\`\`\`

**Query Parameters:**
- `page`: Số trang (mặc định: 0)
- `size`: Số lượng quiz mỗi trang (mặc định: 10)
- `tag`: Lọc theo tag (tùy chọn)

**Response (200 OK):**
\`\`\`json
{
  "content": [
    {
      "id": 1,
      "title": "Basic Mathematics",
      "description": "Test your basic math skills",
      "creator": {
        "id": 1,
        "username": "johndoe"
      },
      "tag": "Math",
      "questionCount": 10,
      "isPublic": true,
      "isAiGenerated": false,
      "createdAt": "2025-04-15T10:30:00Z"
    },
    {
      "id": 2,
      "title": "World History",
      "description": "Test your knowledge of world history",
      "creator": {
        "id": 2,
        "username": "janedoe"
      },
      "tag": "History",
      "questionCount": 15,
      "isPublic": true,
      "isAiGenerated": true,
      "createdAt": "2025-04-15T11:30:00Z"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 42,
  "totalPages": 5,
  "last": false,
  "size": 10,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 10,
  "first": true,
  "empty": false
}
\`\`\`

### 3.2. Lấy chi tiết quiz

\`\`\`
GET /quizzes/{id}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": 1,
  "title": "Basic Mathematics",
  "description": "Test your basic math skills",
  "creator": {
    "id": 1,
    "username": "johndoe"
  },
  "tag": "Math",
  "isPublic": true,
  "isAiGenerated": false,
  "createdAt": "2025-04-15T10:30:00Z",
  "updatedAt": "2025-04-15T10:30:00Z",
  "questions": [
    {
      "id": 1,
      "content": "What is 2 + 2?",
      "explanation": "Basic addition",
      "answers": [
        {
          "id": 1,
          "content": "3",
          "isCorrect": false
        },
        {
          "id": 2,
          "content": "4",
          "isCorrect": true
        },
        {
          "id": 3,
          "content": "5",
          "isCorrect": false
        },
        {
          "id": 4,
          "content": "6",
          "isCorrect": false
        }
      ]
    },
    {
      "id": 2,
      "content": "What is 5 * 5?",
      "explanation": "Basic multiplication",
      "answers": [
        {
          "id": 5,
          "content": "10",
          "isCorrect": false
        },
        {
          "id": 6,
          "content": "15",
          "isCorrect": false
        },
        {
          "id": 7,
          "content": "20",
          "isCorrect": false
        },
        {
          "id": 8,
          "content": "25",
          "isCorrect": true
        }
      ]
    }
  ]
}
\`\`\`

### 3.3. Tạo quiz mới

\`\`\`
POST /quizzes
\`\`\`

**Request Body:**
\`\`\`json
{
  "title": "Science Quiz",
  "description": "Test your knowledge of basic science",
  "tag": "Science",
  "isPublic": true,
  "questions": [
    {
      "content": "What is the chemical symbol for water?",
      "explanation": "Water is composed of hydrogen and oxygen",
      "answers": [
        {
          "content": "H2O",
          "isCorrect": true
        },
        {
          "content": "CO2",
          "isCorrect": false
        },
        {
          "content": "NaCl",
          "isCorrect": false
        },
        {
          "content": "O2",
          "isCorrect": false
        }
      ]
    },
    {
      "content": "What is the largest planet in our solar system?",
      "explanation": "Jupiter is the largest planet in our solar system",
      "answers": [
        {
          "content": "Earth",
          "isCorrect": false
        },
        {
          "content": "Mars",
          "isCorrect": false
        },
        {
          "content": "Jupiter",
          "isCorrect": true
        },
        {
          "content": "Saturn",
          "isCorrect": false
        }
      ]
    }
  ]
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "id": 3,
  "title": "Science Quiz",
  "description": "Test your knowledge of basic science",
  "creator": {
    "id": 1,
    "username": "johndoe"
  },
  "tag": "Science",
  "isPublic": true,
  "isAiGenerated": false,
  "createdAt": "2025-04-15T12:30:00Z",
  "updatedAt": "2025-04-15T12:30:00Z",
  "questions": [
    {
      "id": 3,
      "content": "What is the chemical symbol for water?",
      "explanation": "Water is composed of hydrogen and oxygen",
      "answers": [
        {
          "id": 9,
          "content": "H2O",
          "isCorrect": true
        },
        {
          "id": 10,
          "content": "CO2",
          "isCorrect": false
        },
        {
          "id": 11,
          "content": "NaCl",
          "isCorrect": false
        },
        {
          "id": 12,
          "content": "O2",
          "isCorrect": false
        }
      ]
    },
    {
      "id": 4,
      "content": "What is the largest planet in our solar system?",
      "explanation": "Jupiter is the largest planet in our solar system",
      "answers": [
        {
          "id": 13,
          "content": "Earth",
          "isCorrect": false
        },
        {
          "id": 14,
          "content": "Mars",
          "isCorrect": false
        },
        {
          "id": 15,
          "content": "Jupiter",
          "isCorrect": true
        },
        {
          "id": 16,
          "content": "Saturn",
          "isCorrect": false
        }
      ]
    }
  ]
}
\`\`\`

### 3.4. Cập nhật quiz

\`\`\`
PUT /quizzes/{id}
\`\`\`

**Request Body:**
\`\`\`json
{
  "title": "Updated Science Quiz",
  "description": "Updated description for science quiz",
  "tag": "Science",
  "isPublic": true,
  "questions": [
    {
      "id": 3,
      "content": "What is the chemical symbol for water?",
      "explanation": "Updated explanation: Water is H2O",
      "answers": [
        {
          "id": 9,
          "content": "H2O",
          "isCorrect": true
        },
        {
          "id": 10,
          "content": "CO2",
          "isCorrect": false
        },
        {
          "id": 11,
          "content": "NaCl",
          "isCorrect": false
        },
        {
          "id": 12,
          "content": "O2",
          "isCorrect": false
        }
      ]
    },
    {
      "id": 4,
      "content": "What is the largest planet in our solar system?",
      "explanation": "Jupiter is the largest planet in our solar system",
      "answers": [
        {
          "id": 13,
          "content": "Earth",
          "isCorrect": false
        },
        {
          "id": 14,
          "content": "Mars",
          "isCorrect": false
        },
        {
          "id": 15,
          "content": "Jupiter",
          "isCorrect": true
        },
        {
          "id": 16,
          "content": "Saturn",
          "isCorrect": false
        }
      ]
    }
  ]
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": 3,
  "title": "Updated Science Quiz",
  "description": "Updated description for science quiz",
  "creator": {
    "id": 1,
    "username": "johndoe"
  },
  "tag": "Science",
  "isPublic": true,
  "isAiGenerated": false,
  "createdAt": "2025-04-15T12:30:00Z",
  "updatedAt": "2025-04-15T13:15:00Z",
  "questions": [
    {
      "id": 3,
      "content": "What is the chemical symbol for water?",
      "explanation": "Updated explanation: Water is H2O",
      "answers": [
        {
          "id": 9,
          "content": "H2O",
          "isCorrect": true
        },
        {
          "id": 10,
          "content": "CO2",
          "isCorrect": false
        },
        {
          "id": 11,
          "content": "NaCl",
          "isCorrect": false
        },
        {
          "id": 12,
          "content": "O2",
          "isCorrect": false
        }
      ]
    },
    {
      "id": 4,
      "content": "What is the largest planet in our solar system?",
      "explanation": "Jupiter is the largest planet in our solar system",
      "answers": [
        {
          "id": 13,
          "content": "Earth",
          "isCorrect": false
        },
        {
          "id": 14,
          "content": "Mars",
          "isCorrect": false
        },
        {
          "id": 15,
          "content": "Jupiter",
          "isCorrect": true
        },
        {
          "id": 16,
          "content": "Saturn",
          "isCorrect": false
        }
      ]
    }
  ]
}
\`\`\`

### 3.5. Xóa quiz

\`\`\`
DELETE /quizzes/{id}
\`\`\`

**Response (204 No Content)**

### 3.6. Lấy danh sách tag

\`\`\`
GET /quizzes/tags
\`\`\`

**Response (200 OK):**
\`\`\`json
[
  "General",
  "Math",
  "Science",
  "History",
  "Geography",
  "Literature",
  "Art",
  "Music",
  "Sports",
  "Technology"
]
\`\`\`

### 3.7. Lấy danh sách quiz theo tag

\`\`\`
GET /quizzes/tag/{tag}?page={page}&size={size}
\`\`\`

**Query Parameters:**
- `page`: Số trang (mặc định: 0)
- `size`: Số lượng quiz mỗi trang (mặc định: 10)

**Response (200 OK):**
\`\`\`json
{
  "content": [
    {
      "id": 1,
      "title": "Basic Mathematics",
      "description": "Test your basic math skills",
      "creator": {
        "id": 1,
        "username": "johndoe"
      },
      "tag": "Math",
      "questionCount": 10,
      "isPublic": true,
      "isAiGenerated": false,
      "createdAt": "2025-04-15T10:30:00Z"
    },
    {
      "id": 5,
      "title": "Advanced Mathematics",
      "description": "Test your advanced math skills",
      "creator": {
        "id": 2,
        "username": "janedoe"
      },
      "tag": "Math",
      "questionCount": 8,
      "isPublic": true,
      "isAiGenerated": true,
      "createdAt": "2025-04-15T14:30:00Z"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 12,
  "totalPages": 2,
  "last": false,
  "size": 10,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 10,
  "first": true,
  "empty": false
}
\`\`\`

### 3.8. Tạo quiz bằng AI

\`\`\`
POST /quizzes/ai/generate
\`\`\`

**Request Body:**
\`\`\`json
{
  "topic": "Ancient Rome",
  "difficulty": "Medium",
  "questionCount": 5,
  "tag": "History",
  "model": "openai/gpt-3.5-turbo"
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "id": 6,
  "title": "Ancient Rome Quiz",
  "description": "Test your knowledge of Ancient Rome",
  "creator": {
    "id": 1,
    "username": "johndoe"
  },
  "tag": "History",
  "isPublic": true,
  "isAiGenerated": true,
  "createdAt": "2025-04-15T15:30:00Z",
  "updatedAt": "2025-04-15T15:30:00Z",
  "questions": [
    {
      "id": 10,
      "content": "Who was the first Emperor of Rome?",
      "explanation": "Augustus (born Octavian) became the first Roman Emperor after defeating Mark Antony and Cleopatra at the Battle of Actium in 31 BCE.",
      "answers": [
        {
          "id": 37,
          "content": "Julius Caesar",
          "isCorrect": false
        },
        {
          "id": 38,
          "content": "Augustus",
          "isCorrect": true
        },
        {
          "id": 39,
          "content": "Nero",
          "isCorrect": false
        },
        {
          "id": 40,
          "content": "Constantine",
          "isCorrect": false
        }
      ]
    },
    // More questions...
  ]
}
\`\`\`

### 3.9. Thực hiện quiz

\`\`\`
POST /quizzes/{id}/attempt
\`\`\`

**Request Body:**
\`\`\`json
{
  "answers": [
    {
      "questionId": 1,
      "answerId": 2
    },
    {
      "questionId": 2,
      "answerId": 8
    }
  ]
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": 1,
  "quizId": 1,
  "userId": 1,
  "score": 2,
  "maxScore": 2,
  "completed": true,
  "completedAt": "2025-04-15T16:30:00Z",
  "createdAt": "2025-04-15T16:25:00Z",
  "answers": [
    {
      "questionId": 1,
      "answerId": 2,
      "isCorrect": true,
      "correctAnswerId": 2,
      "explanation": "Basic addition"
    },
    {
      "questionId": 2,
      "answerId": 8,
      "isCorrect": true,
      "correctAnswerId": 8,
      "explanation": "Basic multiplication"
    }
  ]
}
\`\`\`

### 3.10. Lấy lịch sử làm quiz

\`\`\`
GET /quizzes/attempts?page={page}&size={size}
\`\`\`

**Query Parameters:**
- `page`: Số trang (mặc định: 0)
- `size`: Số lượng kết quả mỗi trang (mặc định: 10)

**Response (200 OK):**
\`\`\`json
{
  "content": [
    {
      "id": 1,
      "quiz": {
        "id": 1,
        "title": "Basic Mathematics"
      },
      "score": 2,
      "maxScore": 2,
      "completedAt": "2025-04-15T16:30:00Z"
    },
    {
      "id": 2,
      "quiz": {
        "id": 2,
        "title": "World History"
      },
      "score": 12,
      "maxScore": 15,
      "completedAt": "2025-04-15T17:45:00Z"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 5,
  "totalPages": 1,
  "last": true,
  "size": 10,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 5,
  "first": true,
  "empty": false
}
\`\`\`

## 4. Flashcard API

### 4.1. Lấy danh sách flashcard

\`\`\`
GET /flashcards?page={page}&size={size}&tag={tag}
\`\`\`

**Query Parameters:**
- `page`: Số trang (mặc định: 0)
- `size`: Số lượng flashcard mỗi trang (mặc định: 10)
- `tag`: Lọc theo tag (tùy chọn)

**Response (200 OK):**
\`\`\`json
{
  "content": [
    {
      "id": 1,
      "frontContent": "What is photosynthesis?",
      "backContent": "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water.",
      "creator": {
        "id": 1,
        "username": "johndoe"
      },
      "tag": "Science",
      "isAiGenerated": false,
      "createdAt": "2025-04-15T10:30:00Z"
    },
    {
      "id": 2,
      "frontContent": "What is the capital of France?",
      "backContent": "Paris is the capital of France.",
      "creator": {
        "id": 2,
        "username": "janedoe"
      },
      "tag": "Geography",
      "isAiGenerated": true,
      "createdAt": "2025-04-15T11:30:00Z"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 25,
  "totalPages": 3,
  "last": false,
  "size": 10,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 10,
  "first": true,
  "empty": false
}
\`\`\`

### 4.2. Lấy chi tiết flashcard

\`\`\`
GET /flashcards/{id}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": 1,
  "frontContent": "What is photosynthesis?",
  "backContent": "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water.",
  "creator": {
    "id": 1,
    "username": "johndoe"
  },
  "tag": "Science",
  "isAiGenerated": false,
  "createdAt": "2025-04-15T10:30:00Z",
  "updatedAt": "2025-04-15T10:30:00Z"
}
\`\`\`

### 4.3. Tạo flashcard mới

\`\`\`
POST /flashcards
\`\`\`

**Request Body:**
\`\`\`json
{
  "frontContent": "What is the Pythagorean theorem?",
  "backContent": "In a right-angled triangle, the square of the length of the hypotenuse equals the sum of the squares of the lengths of the other two sides.",
  "tag": "Math"
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "id": 3,
  "frontContent": "What is the Pythagorean theorem?",
  "backContent": "In a right-angled triangle, the square of the length of the hypotenuse equals the sum of the squares of the lengths of the other two sides.",
  "creator": {
    "id": 1,
    "username": "johndoe"
  },
  "tag": "Math",
  "isAiGenerated": false,
  "createdAt": "2025-04-15T18:30:00Z",
  "updatedAt": "2025-04-15T18:30:00Z"
}
\`\`\`

### 4.4. Cập nhật flashcard

\`\`\`
PUT /flashcards/{id}
\`\`\`

**Request Body:**
\`\`\`json
{
  "frontContent": "What is the Pythagorean theorem?",
  "backContent": "Updated: In a right-angled triangle, the square of the length of the hypotenuse (c) equals the sum of the squares of the lengths of the other two sides (a and b). Expressed as: a² + b² = c²",
  "tag": "Math"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": 3,
  "frontContent": "What is the Pythagorean theorem?",
  "backContent": "Updated: In a right-angled triangle, the square of the length of the hypotenuse (c) equals the sum of the squares of the lengths of the other two sides (a and b). Expressed as: a² + b² = c²",
  "creator": {
    "id": 1,
    "username": "johndoe"
  },
  "tag": "Math",
  "isAiGenerated": false,
  "createdAt": "2025-04-15T18:30:00Z",
  "updatedAt": "2025-04-15T19:15:00Z"
}
\`\`\`

### 4.5. Xóa flashcard

\`\`\`
DELETE /flashcards/{id}
\`\`\`

**Response (204 No Content)**

### 4.6. Lấy danh sách tag

\`\`\`
GET /flashcards/tags
\`\`\`

**Response (200 OK):**
\`\`\`json
[
  "General",
  "Math",
  "Science",
  "History",
  "Geography",
  "Literature",
  "Art",
  "Music",
  "Sports",
  "Technology"
]
\`\`\`

### 4.7. Lấy danh sách flashcard theo tag

\`\`\`
GET /flashcards/tag/{tag}?page={page}&size={size}
\`\`\`

**Query Parameters:**
- `page`: Số trang (mặc định: 0)
- `size`: Số lượng flashcard mỗi trang (mặc định: 10)

**Response (200 OK):**
\`\`\`json
{
  "content": [
    {
      "id": 3,
      "frontContent": "What is the Pythagorean theorem?",
      "backContent": "In a right-angled triangle, the square of the length of the hypotenuse equals the sum of the squares of the lengths of the other two sides.",
      "creator": {
        "id": 1,
        "username": "johndoe"
      },
      "tag": "Math",
      "isAiGenerated": false,
      "createdAt": "2025-04-15T18:30:00Z"
    },
    {
      "id": 4,
      "frontContent": "What is the quadratic formula?",
      "backContent": "The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a, where ax² + bx + c = 0.",
      "creator": {
        "id": 2,
        "username": "janedoe"
      },
      "tag": "Math",
      "isAiGenerated": true,
      "createdAt": "2025-04-15T20:30:00Z"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 8,
  "totalPages": 1,
  "last": true,
  "size": 10,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 8,
  "first": true,
  "empty": false
}
\`\`\`

### 4.8. Tạo flashcard bằng AI

\`\`\`
POST /flashcards/ai/generate
\`\`\`

**Request Body:**
\`\`\`json
{
  "topic": "Solar System",
  "cardCount": 5,
  "tag": "Science",
  "model": "openai/gpt-3.5-turbo"
}
\`\`\`

**Response (201 Created):**
\`\`\`json
[
  {
    "id": 5,
    "frontContent": "What is the closest planet to the Sun?",
    "backContent": "Mercury is the closest planet to the Sun. It's a small, rocky planet with extreme temperature variations between day and night due to its proximity to the Sun and lack of substantial atmosphere.",
    "creator": {
      "id": 1,
      "username": "johndoe"
    },
    "tag": "Science",
    "isAiGenerated": true,
    "createdAt": "2025-04-15T21:30:00Z",
    "updatedAt": "2025-04-15T21:30:00Z"
  },
  {
    "id": 6,
    "frontContent": "What is the largest planet in our solar system?",
    "backContent": "Jupiter is the largest planet in our solar system. It's a gas giant primarily composed of hydrogen and helium, with a strong magnetic field and numerous moons.",
    "creator": {
      "id": 1,
      "username": "johndoe"
    },
    "tag": "Science",
    "isAiGenerated": true,
    "createdAt": "2025-04-15T21:30:00Z",
    "updatedAt": "2025-04-15T21:30:00Z"
  },
  // More flashcards...
]
\`\`\`

### 4.9. Bắt đầu phiên học flashcard

\`\`\`
POST /flashcards/study/start
\`\`\`

**Request Body:**
\`\`\`json
{
  "tag": "Science",
  "limit": 10
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "id": 1,
  "userId": 1,
  "createdAt": "2025-04-15T22:30:00Z",
  "flashcards": [
    {
      "id": 5,
      "frontContent": "What is the closest planet to the Sun?",
      "backContent": "Mercury is the closest planet to the Sun. It's a small, rocky planet with extreme temperature variations between day and night due to its proximity to the Sun and lack of substantial atmosphere.",
      "confidenceLevel": 0
    },
    {
      "id": 6,
      "frontContent": "What is the largest planet in our solar system?",
      "backContent": "Jupiter is the largest planet in our solar system. It's a gas giant primarily composed of hydrogen and helium, with a strong magnetic field and numerous moons.",
      "confidenceLevel": 0
    },
    // More flashcards...
  ]
}
\`\`\`

### 4.10. Cập nhật mức độ tự tin cho flashcard

\`\`\`
PUT /flashcards/study/{sessionId}/item/{flashcardId}
\`\`\`

**Request Body:**
\`\`\`json
{
  "confidenceLevel": 4
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": 1,
  "flashcardId": 5,
  "sessionId": 1,
  "confidenceLevel": 4,
  "updatedAt": "2025-04-15T22:35:00Z"
}
\`\`\`

### 4.11. Hoàn thành phiên học flashcard

\`\`\`
PUT /flashcards/study/{sessionId}/complete
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": 1,
  "userId": 1,
  "createdAt": "2025-04-15T22:30:00Z",
  "completedAt": "2025-04-15T22:45:00Z",
  "flashcards": [
    {
      "id": 5,
      "frontContent": "What is the closest planet to the Sun?",
      "backContent": "Mercury is the closest planet to the Sun. It's a small, rocky planet with extreme temperature variations between day and night due to its proximity to the Sun and lack of substantial atmosphere.",
      "confidenceLevel": 4
    },
    {
      "id": 6,
      "frontContent": "What is the largest planet in our solar system?",
      "backContent": "Jupiter is the largest planet in our solar system. It's a gas giant primarily composed of hydrogen and helium, with a strong magnetic field and numerous moons.",
      "confidenceLevel": 5
    },
    // More flashcards...
  ]
}
\`\`\`

## 5. Chat API

### 5.1. Lấy lịch sử chat

\`\`\`
GET /chat/messages?page={page}&size={size}
\`\`\`

**Query Parameters:**
- `page`: Số trang (mặc định: 0)
- `size`: Số lượng tin nhắn mỗi trang (mặc định: 20)

**Response (200 OK):**
\`\`\`json
{
  "content": [
    {
      "id": 1,
      "content": "Hello, can you help me create a quiz about Ancient Greece?",
      "isAi": false,
      "createdAt": "2025-04-15T10:30:00Z"
    },
    {
      "id": 2,
      "content": "Of course! I'd be happy to help you create a quiz about Ancient Greece. Would you like a general overview quiz or would you prefer to focus on a specific aspect such as mythology, philosophy, or historical events?",
      "isAi": true,
      "createdAt": "2025-04-15T10:30:05Z"
    },
    // More messages...
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 10,
  "totalPages": 1,
  "last": true,
  "size": 20,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 10,
  "first": true,
  "empty": false
}
\`\`\`

### 5.2. Gửi tin nhắn mới

\`\`\`
POST /chat/messages
\`\`\`

**Request Body:**
\`\`\`json
{
  "content": "I'd like to focus on Greek mythology.",
  "model": "openai/gpt-3.5-turbo"
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "userMessage": {
    "id": 11,
    "content": "I'd like to focus on Greek mythology.",
    "isAi": false,
    "createdAt": "2025-04-15T11:30:00Z"
  },
  "aiResponse": {
    "id": 12,
    "content": "Great choice! Greek mythology is fascinating. I'll create a quiz focused on Greek mythology for you. The quiz will include questions about major gods and goddesses, famous myths, and legendary heroes. Would you like the quiz to be easy, medium, or difficult?",
    "isAi": true,
    "createdAt": "2025-04-15T11:30:05Z"
  }
}
\`\`\`

### 5.3. Gợi ý quiz từ AI

\`\`\`
POST /chat/ai/suggest-quiz
\`\`\`

**Request Body:**
\`\`\`json
{
  "topic": "Greek Mythology",
  "difficulty": "Medium",
  "questionCount": 5,
  "model": "openai/gpt-3.5-turbo"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "message": {
    "id": 13,
    "content": "Here's a suggested quiz about Greek Mythology:\n\n1. Who is the king of the Greek gods?\n   A) Zeus\n   B) Poseidon\n   C) Apollo\n   D) Hades\n\n2. Which goddess is associated with wisdom and strategic warfare?\n   A) Aphrodite\n   B) Hera\n   C) Athena\n   D) Artemis\n\n...",
    "isAi": true,
    "createdAt": "2025-04-15T12:30:00Z"
  },
  "quizId": 7
}
\`\`\`

### 5.4. Gợi ý flashcard từ AI

\`\`\`
POST /chat/ai/suggest-flashcard
\`\`\`

**Request Body:**
\`\`\`json
{
  "topic": "Greek Mythology",
  "cardCount": 3,
  "model": "openai/gpt-3.5-turbo"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "message": {
    "id": 14,
    "content": "Here are some flashcards about Greek Mythology:\n\n1. Front: Who is Zeus?\n   Back: Zeus is the king of the gods in Greek mythology, ruler of Mount Olympus, and god of the sky, lightning, thunder, law, order, and justice. He is the youngest son of Cronus and Rhea.\n\n2. Front: What is the Trojan War?\n   Back: The Trojan War was a legendary conflict between the Greeks and the city of Troy. It was sparked by the abduction of Queen Helen of Sparta by the Trojan prince Paris. The war lasted for ten years and ended with the Greeks' stratagem of the Trojan Horse.\n\n...",
    "isAi": true,
    "createdAt": "2025-04-15T13:30:00Z"
  },
  "flashcardIds": [7, 8, 9]
}
\`\`\`

## 6. Admin API

### 6.1. Lấy danh sách người dùng

\`\`\`
GET /admin/users?page={page}&size={size}&search={search}
\`\`\`

**Query Parameters:**
- `page`: Số trang (mặc định: 0)
- `size`: Số lượng người dùng mỗi trang (mặc định: 10)
- `search`: Tìm kiếm theo username hoặc email (tùy chọn)

**Response (200 OK):**
\`\`\`json
{
  "content": [
    {
      "id": 1,
      "username": "johndoe",
      "email": "john.doe@example.com",
      "fullName": "John Doe",
      "role": "USER",
      "isActive": true,
      "createdAt": "2025-04-15T10:30:00Z"
    },
    {
      "id": 2,
      "username": "janedoe",
      "email": "jane.doe@example.com",
      "fullName": "Jane Doe",
      "role": "USER",
      "isActive": true,
      "createdAt": "2025-04-15T11:30:00Z"
    },
    // More users...
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 50,
  "totalPages": 5,
  "last": false,
  "size": 10,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 10,
  "first": true,
  "empty": false
}
\`\`\`

### 6.2. Đổi quyền người dùng

\`\`\`
PUT /admin/users/{id}/role
\`\`\`

**Request Body:**
\`\`\`json
{
  "role": "ADMIN"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": 2,
  "username": "janedoe",
  "email": "jane.doe@example.com",
  "fullName": "Jane Doe",
  "role": "ADMIN",
  "isActive": true,
  "createdAt": "2025-04-15T11:30:00Z",
  "updatedAt": "2025-04-15T14:30:00Z"
}
\`\`\`

### 6.3. Khoá/mở khoá tài khoản

\`\`\`
PUT /admin/users/{id}/status
\`\`\`

**Request Body:**
\`\`\`json
{
  "isActive": false
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": 3,
  "username": "bobsmith",
  "email": "bob.smith@example.com",
  "fullName": "Bob Smith",
  "role": "USER",
  "isActive": false,
  "createdAt": "2025-04-15T12:30:00Z",
  "updatedAt": "2025-04-15T15:30:00Z"
}
\`\`\`

### 6.4. Lấy danh sách quiz

\`\`\`
GET /admin/quizzes?page={page}&size={size}&search={search}
\`\`\`

**Query Parameters:**
- `page`: Số trang (mặc định: 0)
- `size`: Số lượng quiz mỗi trang (mặc định: 10)
- `search`: Tìm kiếm theo tiêu đề (tùy chọn)

**Response (200 OK):**
\`\`\`json
{
  "content": [
    {
      "id": 1,
      "title": "Basic Mathematics",
      "creator": {
        "id": 1,
        "username": "johndoe"
      },
      "tag": "Math",
      "questionCount": 10,
      "isPublic": true,
      "isAiGenerated": false,
      "createdAt": "2025-04-15T10:30:00Z"
    },
    // More quizzes...
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 42,
  "totalPages": 5,
  "last": false,
  "size": 10,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 10,
  "first": true,
  "empty": false
}
\`\`\`

### 6.5. Xóa quiz

\`\`\`
DELETE /admin/quizzes/{id}
\`\`\`

**Response (204 No Content)**

### 6.6. Lấy danh sách flashcard

\`\`\`
GET /admin/flashcards?page={page}&size={size}&search={search}
\`\`\`

**Query Parameters:**
- `page`: Số trang (mặc định: 0)
- `size`: Số lượng flashcard mỗi trang (mặc định: 10)
- `search`: Tìm kiếm theo nội dung (tùy chọn)

**Response (200 OK):**
\`\`\`json
{
  "content": [
    {
      "id": 1,
      "frontContent": "What is photosynthesis?",
      "creator": {
        "id": 1,
        "username": "johndoe"
      },
      "tag": "Science",
      "isAiGenerated": false,
      "createdAt": "2025-04-15T10:30:00Z"
    },
    // More flashcards...
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 25,
  "totalPages": 3,
  "last": false,
  "size": 10,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 10,
  "first": true,
  "empty": false
}
\`\`\`

### 6.7. Xóa flashcard

\`\`\`
DELETE /admin/flashcards/{id}
\`\`\`

**Response (204 No Content)**

### 6.8. Thống kê người dùng

\`\`\`
GET /admin/stats/users
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "totalUsers": 50,
  "activeUsers": 48,
  "inactiveUsers": 2,
  "adminUsers": 3,
  "regularUsers": 47,
  "newUsersToday": 5,
  "newUsersThisWeek": 12,
  "newUsersThisMonth": 25,
  "userGrowth": [
    {
      "date": "2025-04-09",
      "count": 3
    },
    {
      "date": "2025-04-10",
      "count": 2
    },
    {
      "date": "2025-04-11",
      "count": 1
    },
    {
      "date": "2025-04-12",
      "count": 4
    },
    {
      "date": "2025-04-13",
      "count": 2
    },
    {
      "date": "2025-04-14",
      "count": 3
    },
    {
      "date": "2025-04-15",
      "count": 5
    }
  ]
}
\`\`\`

### 6.9. Thống kê nội dung

\`\`\`
GET /admin/stats/content
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "totalQuizzes": 42,
  "totalFlashcards": 25,
  "aiGeneratedQuizzes": 15,
  "aiGeneratedFlashcards": 10,
  "quizzesByTag": [
    {
      "tag": "Math",
      "count": 12
    },
    {
      "tag": "Science",
      "count": 10
    },
    {
      "tag": "History",
      "count": 8
    },
    {
      "tag": "Geography",
      "count": 5
    },
    {
      "tag": "Literature",
      "count": 4
    },
    {
      "tag": "General",
      "count": 3
    }
  ],
  "flashcardsByTag": [
    {
      "tag": "Science",
      "count": 8
    },
    {
      "tag": "Math",
      "count": 6
    },
    {
      "tag": "History",
      "count": 5
    },
    {
      "tag": "Geography",
      "count": 3
    },
    {
      "tag": "Literature",
      "count": 2
    },
    {
      "tag": "General",
      "count": 1
    }
  ],
  "contentCreationByDate": [
    {
      "date": "2025-04-09",
      "quizzes": 2,
      "flashcards": 1
    },
    {
      "date": "2025-04-10",
      "quizzes": 3,
      "flashcards": 2
    },
    {
      "date": "2025-04-11",
      "quizzes": 1,
      "flashcards": 3
    },
    {
      "date": "2025-04-12",
      "quizzes": 4,
      "flashcards": 2
    },
    {
      "date": "2025-04-13",
      "quizzes": 2,
      "flashcards": 1
    },
    {
      "date": "2025-04-14",
      "quizzes": 3,
      "flashcards": 3
    },
    {
      "date": "2025-04-15",
      "quizzes": 5,
      "flashcards": 4
    }
  ]
}
\`\`\`

### 6.10. Thống kê lưu lượng

\`\`\`
GET /admin/stats/traffic
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "totalVisits": 1250,
  "uniqueVisitors": 350,
  "averageSessionDuration": 420,
  "bounceRate": 25.5,
  "trafficByDate": [
    {
      "date": "2025-04-09",
      "visits": 150,
      "uniqueVisitors": 45
    },
    {
      "date": "2025-04-10",
      "visits": 165,
      "uniqueVisitors": 50
    },
    {
      "date": "2025-04-11",
      "visits": 140,
      "uniqueVisitors": 42
    },
    {
      "date": "2025-04-12",
      "visits": 180,
      "uniqueVisitors": 55
    },
    {
      "date": "2025-04-13",
      "visits": 190,
      "uniqueVisitors": 58
    },
    {
      "date": "2025-04-14",
      "visits": 200,
      "uniqueVisitors": 60
    },
    {
      "date": "2025-04-15",
      "visits": 225,
      "uniqueVisitors": 70
    }
  ],
  "topPages": [
    {
      "page": "/",
      "visits": 300
    },
    {
      "page": "/quizzes",
      "visits": 250
    },
    {
      "page": "/flashcards",
      "visits": 200
    },
    {
      "page": "/chat",
      "visits": 150
    },
    {
      "page": "/login",
      "visits": 100
    }
  ]
}
\`\`\`

## Mã lỗi

| Mã lỗi | Mô tả |
|--------|-------|
| 400 | Bad Request - Yêu cầu không hợp lệ |
| 401 | Unauthorized - Không có quyền truy cập |
| 403 | Forbidden - Không có quyền thực hiện hành động |
| 404 | Not Found - Không tìm thấy tài nguyên |
| 409 | Conflict - Xung đột dữ liệu |
| 422 | Unprocessable Entity - Dữ liệu không hợp lệ |
| 429 | Too Many Requests - Quá nhiều yêu cầu |
| 500 | Internal Server Error - Lỗi máy chủ |

## Cấu trúc lỗi

\`\`\`json
{
  "timestamp": "2025-04-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid request parameters",
  "path": "/api/v1/quizzes",
  "details": [
    "Title is required",
    "At least one question is required"
  ]
}
\`\`\`
