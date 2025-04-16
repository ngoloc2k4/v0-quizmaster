# QuizMaster AI - Database Schema

## Overview

Hệ thống QuizMaster AI sử dụng PostgreSQL làm cơ sở dữ liệu chính. Dưới đây là chi tiết schema cho từng bảng trong cơ sở dữ liệu.

## Bảng `users`

Lưu trữ thông tin người dùng và quản trị viên.

\`\`\`sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    avatar_url VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'USER', -- USER, ADMIN
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Bảng `quizzes`

Lưu trữ thông tin về các bài quiz.

\`\`\`sql
CREATE TABLE quizzes (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    creator_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL DEFAULT 'General',
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    is_ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quizzes_creator ON quizzes(creator_id);
CREATE INDEX idx_quizzes_tag ON quizzes(tag);
\`\`\`

## Bảng `questions`

Lưu trữ các câu hỏi trong quiz.

\`\`\`sql
CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    quiz_id BIGINT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    explanation TEXT,
    question_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_quiz ON questions(quiz_id);
\`\`\`

## Bảng `answers`

Lưu trữ các đáp án cho mỗi câu hỏi.

\`\`\`sql
CREATE TABLE answers (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    answer_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_answers_question ON answers(question_id);
\`\`\`

## Bảng `flashcards`

Lưu trữ thông tin về các flashcard.

\`\`\`sql
CREATE TABLE flashcards (
    id BIGSERIAL PRIMARY KEY,
    front_content TEXT NOT NULL,
    back_content TEXT NOT NULL,
    creator_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL DEFAULT 'General',
    is_ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_flashcards_creator ON flashcards(creator_id);
CREATE INDEX idx_flashcards_tag ON flashcards(tag);
\`\`\`

## Bảng `quiz_attempts`

Lưu trữ lịch sử làm quiz của người dùng.

\`\`\`sql
CREATE TABLE quiz_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id BIGINT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score INT NOT NULL DEFAULT 0,
    max_score INT NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
\`\`\`

## Bảng `quiz_attempt_answers`

Lưu trữ các câu trả lời của người dùng trong mỗi lần làm quiz.

\`\`\`sql
CREATE TABLE quiz_attempt_answers (
    id BIGSERIAL PRIMARY KEY,
    attempt_id BIGINT NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer_id BIGINT REFERENCES answers(id) ON DELETE SET NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_attempt_answers_attempt ON quiz_attempt_answers(attempt_id);
\`\`\`

## Bảng `flashcard_study_sessions`

Lưu trữ thông tin về các phiên học flashcard.

\`\`\`sql
CREATE TABLE flashcard_study_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_flashcard_study_sessions_user ON flashcard_study_sessions(user_id);
\`\`\`

## Bảng `flashcard_study_items`

Lưu trữ chi tiết về các flashcard được học trong mỗi phiên.

\`\`\`sql
CREATE TABLE flashcard_study_items (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL REFERENCES flashcard_study_sessions(id) ON DELETE CASCADE,
    flashcard_id BIGINT NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
    confidence_level INT NOT NULL DEFAULT 0, -- 0: Not rated, 1-5: Confidence level
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_flashcard_study_items_session ON flashcard_study_items(session_id);
\`\`\`

## Bảng `chat_messages`

Lưu trữ lịch sử chat giữa người dùng và AI.

\`\`\`sql
CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_ai BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_messages_user ON chat_messages(user_id);
\`\`\`

## Bảng `tags`

Lưu trữ danh sách các tag được sử dụng trong hệ thống.

\`\`\`sql
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Bảng `user_activities`

Lưu trữ hoạt động của người dùng để thống kê và phân tích.

\`\`\`sql
CREATE TABLE user_activities (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- LOGIN, QUIZ_CREATE, QUIZ_ATTEMPT, FLASHCARD_CREATE, CHAT, etc.
    entity_id BIGINT, -- ID of the related entity (quiz, flashcard, etc.)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_activities_user ON user_activities(user_id);
CREATE INDEX idx_user_activities_type ON user_activities(activity_type);
\`\`\`

## Bảng `refresh_tokens`

Lưu trữ refresh token cho xác thực JWT.

\`\`\`sql
CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
\`\`\`

## Mối quan hệ giữa các bảng

1. **User - Quiz**: Một người dùng có thể tạo nhiều quiz (1:N)
2. **User - Flashcard**: Một người dùng có thể tạo nhiều flashcard (1:N)
3. **User - Quiz Attempt**: Một người dùng có thể thực hiện nhiều lần làm quiz (1:N)
4. **User - Chat Message**: Một người dùng có thể có nhiều tin nhắn chat (1:N)
5. **Quiz - Question**: Một quiz có nhiều câu hỏi (1:N)
6. **Question - Answer**: Một câu hỏi có nhiều đáp án (1:N)
7. **Quiz - Quiz Attempt**: Một quiz có thể được làm nhiều lần bởi nhiều người dùng (1:N)
8. **Quiz Attempt - Quiz Attempt Answer**: Một lần làm quiz có nhiều câu trả lời (1:N)
9. **User - Flashcard Study Session**: Một người dùng có thể có nhiều phiên học flashcard (1:N)
10. **Flashcard Study Session - Flashcard Study Item**: Một phiên học có nhiều flashcard (1:N)

## Chỉ mục và Tối ưu hóa

- Các khóa ngoại đều được đánh chỉ mục để tối ưu hiệu suất truy vấn
- Các trường thường xuyên được sử dụng để tìm kiếm (như tag, creator_id) đều có chỉ mục
- Cascade delete được sử dụng để đảm bảo tính toàn vẹn dữ liệu khi xóa các bản ghi cha

## Bảo mật dữ liệu

- Mật khẩu được mã hóa trước khi lưu vào cơ sở dữ liệu
- Token xác thực và đặt lại mật khẩu có thời hạn sử dụng
- Quyền truy cập được kiểm soát thông qua vai trò (role) của người dùng
