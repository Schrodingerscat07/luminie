-- CollegeCoursera Database Setup Script
-- Run this script to create the database and all required tables

-- Create database
CREATE DATABASE IF NOT EXISTS collegecoursera;
USE collegecoursera;

-- Users table (handles all user types with role flags)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    profile_picture_url TEXT,
    is_professor BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User interests/tags junction table
CREATE TABLE user_interests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    tag_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_tag (user_id, tag_name)
);

-- Courses table
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    department_or_club VARCHAR(100) NOT NULL,
    creator_id INT NOT NULL,
    is_professor_course BOOLEAN DEFAULT FALSE,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Course tags junction table
CREATE TABLE course_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    tag_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_tag (course_id, tag_name)
);

-- Course modules
CREATE TABLE modules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Lectures within modules
CREATE TABLE lectures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    module_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    video_url TEXT,
    reading_materials_url TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- Assignments (MCQ) within modules
CREATE TABLE assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    module_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    due_days INT NOT NULL,
    weight INT NOT NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- MCQ questions for assignments
CREATE TABLE assignment_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option ENUM('A', 'B', 'C', 'D') NOT NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE
);

-- Student enrollments
CREATE TABLE enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    final_grade DECIMAL(5,2) DEFAULT NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_id)
);

-- Student assignment submissions
CREATE TABLE assignment_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    assignment_id INT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score DECIMAL(5,2) DEFAULT 0.00,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_submission (student_id, assignment_id)
);

-- Student answers to MCQ questions
CREATE TABLE student_answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    submission_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_option ENUM('A', 'B', 'C', 'D') NOT NULL,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (submission_id) REFERENCES assignment_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES assignment_questions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_answer (submission_id, question_id)
);

-- Course ratings and reviews
CREATE TABLE course_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (student_id, course_id)
);

-- Course comments/discussion
CREATE TABLE course_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    parent_comment_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES course_comments(id) ON DELETE CASCADE
);

-- Predefined tags table
CREATE TABLE predefined_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tag_name VARCHAR(100) UNIQUE NOT NULL,
    category ENUM('department', 'technical', 'club', 'general') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert predefined tags
INSERT INTO predefined_tags (tag_name, category) VALUES
-- Academic Departments
('Computer Science', 'department'),
('Information Technology', 'department'),
('Electronics & Communication', 'department'),
('Electrical Engineering', 'department'),
('Mechanical Engineering', 'department'),
('Civil Engineering', 'department'),
('Business & Management', 'department'),
('Mathematics', 'department'),
('Physics', 'department'),

-- Technical Skills & Topics
('Python', 'technical'),
('Java', 'technical'),
('C++', 'technical'),
('JavaScript', 'technical'),
('React.js', 'technical'),
('Node.js', 'technical'),
('SQL', 'technical'),
('MySQL', 'technical'),
('Machine Learning', 'technical'),
('Data Science', 'technical'),
('AI', 'technical'),
('Deep Learning', 'technical'),
('Web Development', 'technical'),
('Mobile App Development', 'technical'),
('Cybersecurity', 'technical'),
('Blockchain', 'technical'),
('Cloud Computing', 'technical'),
('Data Structures & Algorithms', 'technical'),
('Database Management', 'technical'),

-- Student Clubs & Interests
('Coding Club', 'club'),
('Robotics Club', 'club'),
('Entrepreneurship Cell', 'club'),
('Finance Club', 'club'),
('Design Club', 'club'),
('Literary Club', 'club'),

-- General & Career Topics
('Interview Prep', 'general'),
('Resume Building', 'general'),
('Gate Exam', 'general'),
('Communication Skills', 'general');

-- Create indexes for better performance
CREATE INDEX idx_courses_creator ON courses(creator_id);
CREATE INDEX idx_courses_rating ON courses(average_rating);
CREATE INDEX idx_courses_created ON courses(created_at);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_reviews_course ON course_reviews(course_id);
CREATE INDEX idx_reviews_student ON course_reviews(student_id);
CREATE INDEX idx_comments_course ON course_comments(course_id);
CREATE INDEX idx_assignments_module ON assignments(module_id);
CREATE INDEX idx_lectures_module ON lectures(module_id);
CREATE INDEX idx_questions_assignment ON assignment_questions(assignment_id);
CREATE INDEX idx_submissions_student ON assignment_submissions(student_id);
CREATE INDEX idx_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_answers_submission ON student_answers(submission_id);

-- Insert sample admin user (password: admin123 - change this in production!)
INSERT INTO users (google_id, email, full_name, is_admin) VALUES
('admin_sample', 'admin@collegecoursera.com', 'System Administrator', TRUE);

-- Insert sample professor user
INSERT INTO users (google_id, email, full_name, is_professor) VALUES
('prof_sample', 'prof@collegecoursera.com', 'Dr. Sample Professor', TRUE);

-- Insert sample student user
INSERT INTO users (google_id, email, full_name) VALUES
('student_sample', 'student@collegecoursera.com', 'Sample Student');

-- Insert sample interests for student
INSERT INTO user_interests (user_id, tag_name) VALUES
(3, 'Computer Science'),
(3, 'Python'),
(3, 'Machine Learning'),
(3, 'Web Development');

-- Insert sample course
INSERT INTO courses (title, description, department_or_club, creator_id, is_professor_course) VALUES
('Introduction to Machine Learning', 'A comprehensive introduction to machine learning concepts and applications using Python.', 'Computer Science', 2, TRUE);

-- Insert sample course tags
INSERT INTO course_tags (course_id, tag_name) VALUES
(1, 'Machine Learning'),
(1, 'Python'),
(1, 'Data Science'),
(1, 'AI');

-- Insert sample module
INSERT INTO modules (course_id, title, order_index) VALUES
(1, 'Fundamentals of Machine Learning', 1);

-- Insert sample lecture
INSERT INTO lectures (module_id, title, video_url, reading_materials_url, order_index) VALUES
(1, 'What is Machine Learning?', 'https://youtube.com/watch?v=sample1', 'https://drive.google.com/sample1', 1);

-- Insert sample assignment
INSERT INTO assignments (module_id, title, due_days, weight, order_index) VALUES
(1, 'ML Concepts Quiz', 7, 25, 1);

-- Insert sample assignment questions
INSERT INTO assignment_questions (assignment_id, question_text, option_a, option_b, option_c, option_d, correct_option, order_index) VALUES
(1, 'What is supervised learning?', 'Learning without labeled data', 'Learning with labeled data', 'Learning without any data', 'Learning with reinforcement', 'B', 1),
(1, 'Which algorithm is used for classification?', 'Linear Regression', 'K-Means', 'Decision Tree', 'DBSCAN', 'C', 2);

-- Insert sample enrollment
INSERT INTO enrollments (student_id, course_id) VALUES
(3, 1);

-- Insert sample review
INSERT INTO course_reviews (student_id, course_id, rating, comment) VALUES
(3, 1, 5, 'Excellent course! Very well explained concepts.');

-- Insert sample comment
INSERT INTO course_comments (student_id, course_id, comment_text) VALUES
(3, 1, 'Looking forward to learning more about neural networks!');

COMMIT;
