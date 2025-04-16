# QuizMaster AI - System Architecture

## Overview

QuizMaster AI là một ứng dụng web cho phép người dùng tạo, quản lý và thực hiện các bài kiểm tra (quiz) và thẻ ghi nhớ (flashcard), với sự hỗ trợ của AI. Hệ thống được xây dựng với kiến trúc client-server, sử dụng Next.js cho frontend và Spring Boot cho backend.

## Kiến trúc tổng quan

\`\`\`
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Client Layer   │◄────►│  Server Layer   │◄────►│  Database Layer │
│   (Next.js)     │      │  (Spring Boot)  │      │   (PostgreSQL)  │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                                  ▲
                                  │
                                  ▼
                         ┌─────────────────┐
                         │                 │
                         │   AI Service    │
                         │                 │
                         └─────────────────┘
\`\`\`

## Client Layer (Next.js)

Frontend sử dụng Next.js với TypeScript, cung cấp giao diện người dùng đáp ứng và trải nghiệm người dùng mượt mà.

### Cấu trúc thư mục Frontend

\`\`\`
frontend/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ...
│   │   ├── auth/
│   │   ├── quiz/
│   │   ├── flashcard/
│   │   ├── chat/
│   │   └── admin/
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── quiz/
│   │   ├── flashcard/
│   │   ├── chat/
│   │   ├── admin/
│   │   └── ...
│   ├── hooks/
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ...
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── quiz.service.ts
│   │   ├── flashcard.service.ts
│   │   ├── chat.service.ts
│   │   └── ...
│   ├── styles/
│   ├── types/
│   └── utils/
├── .env
├── next.config.js
├── package.json
└── tsconfig.json
\`\`\`

### Các tính năng chính của Frontend

1. **Xác thực người dùng**
   - Đăng ký, đăng nhập, đăng xuất
   - Quản lý hồ sơ người dùng
   - Quên mật khẩu và đặt lại mật khẩu

2. **Quản lý Quiz**
   - Tạo, chỉnh sửa, xóa quiz
   - Làm quiz và xem kết quả
   - Tạo quiz bằng AI

3. **Quản lý Flashcard**
   - Tạo, chỉnh sửa, xóa flashcard
   - Học flashcard
   - Tạo flashcard bằng AI

4. **Chat với AI**
   - Giao diện chat
   - Gợi ý quiz và flashcard

5. **Bảng điều khiển Admin**
   - Quản lý người dùng
   - Quản lý nội dung
   - Thống kê và giám sát

6. **UI/UX**
   - Responsive design
   - Dark/Light mode
   - Hiệu ứng và animation
   - Toast notifications
   - Modal

## Server Layer (Spring Boot)

Backend sử dụng Spring Boot với Java, cung cấp API RESTful và xử lý logic nghiệp vụ.

### Cấu trúc thư mục Backend

\`\`\`
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── quizmaster/
│   │   │           ├── QuizmasterApplication.java
│   │   │           ├── config/
│   │   │           │   ├── SecurityConfig.java
│   │   │           │   ├── JwtConfig.java
│   │   │           │   └── ...
│   │   │           ├── controller/
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── UserController.java
│   │   │           │   ├── QuizController.java
│   │   │           │   ├── FlashcardController.java
│   │   │           │   ├── ChatController.java
│   │   │           │   ├── AdminController.java
│   │   │           │   └── ...
│   │   │           ├── model/
│   │   │           │   ├── User.java
│   │   │           │   ├── Quiz.java
│   │   │           │   ├── Question.java
│   │   │           │   ├── Answer.java
│   │   │           │   ├── Flashcard.java
│   │   │           │   ├── ChatMessage.java
│   │   │           │   └── ...
│   │   │           ├── repository/
│   │   │           │   ├── UserRepository.java
│   │   │           │   ├── QuizRepository.java
│   │   │           │   ├── QuestionRepository.java
│   │   │           │   ├── FlashcardRepository.java
│   │   │           │   └── ...
│   │   │           ├── service/
│   │   │           │   ├── AuthService.java
│   │   │           │   ├── UserService.java
│   │   │           │   ├── QuizService.java
│   │   │           │   ├── FlashcardService.java
│   │   │           │   ├── ChatService.java
│   │   │           │   ├── AIService.java
│   │   │           │   └── ...
│   │   │           ├── dto/
│   │   │           │   ├── request/
│   │   │           │   └── response/
│   │   │           ├── exception/
│   │   │           └── util/
│   │   └── resources/
│   │       ├── application.properties
│   │       └── ...
│   └── test/
├── pom.xml
└── ...
\`\`\`

### Các tính năng chính của Backend

1. **Xác thực và Bảo mật**
   - JWT Authentication
   - Role-based Authorization
   - Password Encryption

2. **API RESTful**
   - User API
   - Quiz API
   - Flashcard API
   - Chat API
   - Admin API

3. **Tích hợp AI**
   - Tạo quiz từ chủ đề
   - Tạo flashcard từ chủ đề
   - Xử lý chat với AI

4. **Xử lý dữ liệu**
   - CRUD operations
   - Data validation
   - Error handling

## Database Layer

Hệ thống sử dụng PostgreSQL làm cơ sở dữ liệu chính.

### Sơ đồ cơ sở dữ liệu

\`\`\`
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│     users     │       │     quizzes   │       │   questions   │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ id            │       │ id            │       │ id            │
│ username      │       │ title         │       │ quiz_id       │
│ email         │       │ description   │       │ content       │
│ password      │       │ creator_id    │       │ explanation   │
│ role          │       │ created_at    │       │ created_at    │
│ is_active     │       │ updated_at    │       │ updated_at    │
│ created_at    │       │ tag           │       └───────────────┘
│ updated_at    │       │ is_public     │               │
└───────────────┘       └───────────────┘               │
        │                       │                        │
        │                       │                        │
        │                       │                ┌───────────────┐
        │                       │                │    answers    │
        │                       │                ├───────────────┤
        │                       │                │ id            │
        │                       │                │ question_id   │
        │                       │                │ content       │
        │                       │                │ is_correct    │
        │                       │                │ created_at    │
        │                       │                │ updated_at    │
        │                       │                └───────────────┘
        │                       │
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  flashcards   │       │ quiz_attempts │       │ chat_messages │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ id            │       │ id            │       │ id            │
│ front_content │       │ user_id       │       │ user_id       │
│ back_content  │       │ quiz_id       │       │ content       │
│ creator_id    │       │ score         │       │ is_ai         │
│ tag           │       │ completed_at  │       │ created_at    │
│ created_at    │       │ created_at    │       └───────────────┘
│ updated_at    │       └───────────────┘
└───────────────┘
\`\`\`

## AI Service

Hệ thống tích hợp với dịch vụ AI để cung cấp các tính năng như tạo quiz, tạo flashcard và chat với AI.

### Tích hợp AI

1. **Tạo Quiz bằng AI**
   - Phân tích chủ đề
   - Tạo câu hỏi và đáp án
   - Tạo lời giải thích

2. **Tạo Flashcard bằng AI**
   - Phân tích chủ đề
   - Tạo nội dung mặt trước và mặt sau

3. **Chat với AI**
   - Xử lý ngôn ngữ tự nhiên
   - Cung cấp gợi ý và hỗ trợ

## API Endpoints

### Authentication API

\`\`\`
POST /api/auth/register - Đăng ký người dùng mới
POST /api/auth/login - Đăng nhập
POST /api/auth/logout - Đăng xuất
POST /api/auth/refresh-token - Làm mới token
POST /api/auth/forgot-password - Quên mật khẩu
POST /api/auth/reset-password - Đặt lại mật khẩu
\`\`\`

### User API

\`\`\`
GET /api/users/me - Lấy thông tin người dùng hiện tại
PUT /api/users/me - Cập nhật thông tin người dùng
PUT /api/users/me/password - Đổi mật khẩu
\`\`\`

### Quiz API

\`\`\`
GET /api/quizzes - Lấy danh sách quiz
GET /api/quizzes/{id} - Lấy chi tiết quiz
POST /api/quizzes - Tạo quiz mới
PUT /api/quizzes/{id} - Cập nhật quiz
DELETE /api/quizzes/{id} - Xóa quiz
GET /api/quizzes/tags - Lấy danh sách tag
GET /api/quizzes/tag/{tag} - Lấy danh sách quiz theo tag
POST /api/quizzes/ai/generate - Tạo quiz bằng AI
POST /api/quizzes/{id}/attempt - Thực hiện quiz
GET /api/quizzes/attempts - Lấy lịch sử làm quiz
\`\`\`

### Flashcard API

\`\`\`
GET /api/flashcards - Lấy danh sách flashcard
GET /api/flashcards/{id} - Lấy chi tiết flashcard
POST /api/flashcards - Tạo flashcard mới
PUT /api/flashcards/{id} - Cập nhật flashcard
DELETE /api/flashcards/{id} - Xóa flashcard
GET /api/flashcards/tags - Lấy danh sách tag
GET /api/flashcards/tag/{tag} - Lấy danh sách flashcard theo tag
POST /api/flashcards/ai/generate - Tạo flashcard bằng AI
\`\`\`

### Chat API

\`\`\`
GET /api/chat/messages - Lấy lịch sử chat
POST /api/chat/messages - Gửi tin nhắn mới
POST /api/chat/ai/suggest-quiz - Gợi ý quiz từ AI
POST /api/chat/ai/suggest-flashcard - Gợi ý flashcard từ AI
\`\`\`

### Admin API

\`\`\`
GET /api/admin/users - Lấy danh sách người dùng
PUT /api/admin/users/{id}/role - Đổi quyền người dùng
PUT /api/admin/users/{id}/status - Khoá/mở khoá tài khoản
GET /api/admin/quizzes - Lấy danh sách quiz
DELETE /api/admin/quizzes/{id} - Xóa quiz
GET /api/admin/flashcards - Lấy danh sách flashcard
DELETE /api/admin/flashcards/{id} - Xóa flashcard
GET /api/admin/stats/users - Thống kê người dùng
GET /api/admin/stats/content - Thống kê nội dung
GET /api/admin/stats/traffic - Thống kê lưu lượng
\`\`\`

## Luồng xác thực

1. Người dùng đăng ký/đăng nhập
2. Server xác thực và trả về JWT token
3. Client lưu token trong localStorage
4. Client gửi token trong header của mỗi request
5. Server xác thực token và xử lý request
6. Khi token hết hạn, client tự động refresh token hoặc redirect về trang đăng nhập

## Luồng tạo và làm Quiz

1. Người dùng tạo quiz (thủ công hoặc bằng AI)
2. Quiz được lưu vào cơ sở dữ liệu
3. Người dùng khác có thể tìm kiếm và làm quiz
4. Kết quả và lời giải được hiển thị sau khi hoàn thành
5. Lịch sử làm quiz được lưu lại

## Luồng tạo và học Flashcard

1. Người dùng tạo flashcard (thủ công hoặc bằng AI)
2. Flashcard được lưu vào cơ sở dữ liệu
3. Người dùng có thể học flashcard bằng cách lật thẻ
4. Tiến trình học được theo dõi

## Luồng Chat với AI

1. Người dùng gửi tin nhắn đến AI
2. AI xử lý và trả lời
3. AI có thể gợi ý quiz hoặc flashcard dựa trên cuộc trò chuyện
4. Lịch sử chat được lưu lại

## Kết luận

Kiến trúc này cung cấp một nền tảng vững chắc cho ứng dụng QuizMaster AI, với sự phân tách rõ ràng giữa các lớp và trách nhiệm. Kiến trúc này cũng cho phép mở rộng dễ dàng trong tương lai.
