# Project: "CollegeCoursera" Requirements Document (PRD)

## 1. Project Overview

CollegeCoursera is a mini-Coursera platform for our college. It allows students and professors (Creators) to create, manage, and enroll in courses. The app features a dynamic, fluid UI, a simple auto-grading system based on MCQs, and a tag-based recommendation engine.

## 2. Tech Stack

* **Backend:** Node.js with Express.js (or NestJS, AI's choice for robustness)
* **Database:** MySQL
* **Frontend:** React.js (or Next.js for routing) with TypeScript
* **Styling:** TailwindCSS
* **Animations:** Framer Motion (to achieve the liquid/fluid UI animations)
* **Authentication:** Google Authentication (OAuth)

## 3. User Roles & Authentication

1.  **Base User (Student):**
    * Authenticates via Google OAuth.
    * On first sign-up, they *must* fill out a profile:
        * Full Name (from Google)
        * Email (from Google)
        * Profile Picture (from Google)
        * Select their "Interests" from the predefined **Tag List**.
    * Can enroll in any course.
    * Can view enrolled courses in their "Student Dashboard."
    * Can rate and comment on courses.

2.  **Creator:**
    * A "Creator" is just a User who decides to create a course.
    * Gains access to a "Creator Dashboard" to manage their courses.

3.  **Professor (Special Role):**
    * This is a boolean flag (`is_professor`) on the User model.
    * This status can *only* be granted by an Admin.
    * **CRITICAL:** When a user with `is_professor = true` creates a course, that course must be visibly tagged or badged as a "Professor's Course" across the site.

4.  **Admin (Special Role):**
    * This is a boolean flag (`is_admin`) on the User model.
    * Can access a separate "Admin Panel."
    * **Can:** Delete any user or any course.
    * **Can:** Grant/Revoke `is_professor` status for any user.
    * **Can:** Grant/Revoke `is_admin` status for any user.
    * **Can:** View site statistics (Total Users, Total Courses).
    * **Can:** Manually edit a student's final grade for a course (in case of errors).

## 4. Core Features

### Course Creation
* A "Create Course" form in the Creator Dashboard.
* Required Fields:
    * `title` (String)
    * `description` (Text)
    * `department_or_club` (String, e.g., "Computer Science")
    * `tags` (Multi-select from the predefined **Tag List**)

### Course Management (Creator Dashboard)
* Creators can edit their course's details.
* Creators can add "Modules" to their course. A module is just a container for content.
* Inside a module, Creators can add two types of content:
    1.  **Lecture:**
        * `title` (String)
        * `video_url` (String - e.g., YouTube or Google Drive link)
        * `reading_materials_url` (String - e.g., Google Drive link for PDFs/notes)
    2.  **Assignment (MCQ):**
        * `title` (String)
        * `due_days` (Integer - e.g., `20`. This means the assignment is due 20 days after the student *enrolls*.)
        * `weight` (Integer - e.g., `30`. This is its % of the final grade).
        * **MCQ Builder:** A UI for the Creator to add questions. Each question has:
            * One `question_text` (String)
            * Multiple `options` (e.g., A, B, C, D)
            * One `correct_option` (The answer)

### Student Experience
* **Homepage:**
    * A "Recommended for You" section (based on their Interest Tags, prioritizing highest-rated courses).
    * A "Top Rated" section.
* **Search Bar:**
    * Users can search by `course_title`, `tags`, `department`, or `creator_name`.
    * The search bar should be "smart" (autocomplete suggestions).
* **Course Page:**
    * Shows description, creator info, and the list of modules/lectures/assignments.
    * **Grading:** A "Grades" tab where the student can see their scores on each assignment and their auto-calculated final grade.
    * **Commenting:** A simple comment thread for course discussion.
    * **Rating:** A 5-star rating system.
* **Student Dashboard:**
    * Shows all enrolled courses.
    * Shows a calendar or list of their personal upcoming deadlines (calculated from their enrollment date + assignment `due_days`).

### UI/UX
* **Theme:** The site must have a "liquid flow" theme.
* **Backgrounds:** Use animated, fluid, generative art gradients (like the Google Flow website).
* **Animations:** All components (cards, buttons, modals) must have smooth, fluid entrance/exit animations using Framer Motion.

---
## Tag List (For Interest-Selection and Course-Tagging)

**Academic Departments:**
* Computer Science
* Information Technology
* Electronics & Communication
* Electrical Engineering
* Mechanical Engineering
* Civil Engineering
* Business & Management
* Mathematics
* Physics

**Technical Skills & Topics:**
* Python, Java, C++, JavaScript
* React.js, Node.js, SQL, MySQL
* Machine Learning, Data Science, AI, Deep Learning
* Web Development, Mobile App Development
* Cybersecurity, Blockchain, Cloud Computing
* Data Structures & Algorithms
* Database Management

**Student Clubs & Interests:**
* Coding Club, Robotics Club, Entrepreneurship Cell
* Finance Club, Design Club, Literary Club

**General & Career Topics:**
* Interview Prep, Resume Building, Gate Exam, Communication Skills
