// User types
export interface User {
  id: number
  googleId: string
  email: string
  fullName: string
  profilePictureUrl?: string
  isProfessor: boolean
  isAdmin: boolean
  createdAt: string
  updatedAt: string
  interests?: string[]
}

// Course types
export interface Course {
  id: number
  title: string
  description: string
  departmentOrClub: string
  creatorId: number
  isProfessorCourse: boolean
  averageRating: number
  totalRatings: number
  createdAt: string
  updatedAt: string
  creator?: User
  tags?: string[]
  modules?: Module[]
  enrollments?: Enrollment[]
  reviews?: CourseReview[]
  comments?: CourseComment[]
}

// Module types
export interface Module {
  id: number
  courseId: number
  title: string
  orderIndex: number
  createdAt: string
  lectures?: Lecture[]
  assignments?: Assignment[]
}

// Lecture types
export interface Lecture {
  id: number
  moduleId: number
  title: string
  videoUrl?: string
  readingMaterialsUrl?: string
  orderIndex: number
  createdAt: string
}

// Assignment types
export interface Assignment {
  id: number
  moduleId: number
  title: string
  dueDays: number
  weight: number
  orderIndex: number
  createdAt: string
  questions?: AssignmentQuestion[]
  submissions?: AssignmentSubmission[]
}

// Assignment Question types
export interface AssignmentQuestion {
  id: number
  assignmentId: number
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption: 'A' | 'B' | 'C' | 'D'
  orderIndex: number
  createdAt: string
}

// Enrollment types
export interface Enrollment {
  id: number
  studentId: number
  courseId: number
  enrolledAt: string
  finalGrade?: number
  student?: User
  course?: Course
}

// Assignment Submission types
export interface AssignmentSubmission {
  id: number
  studentId: number
  assignmentId: number
  submittedAt: string
  score: number
  student?: User
  assignment?: Assignment
  answers?: StudentAnswer[]
}

// Student Answer types
export interface StudentAnswer {
  id: number
  submissionId: number
  questionId: number
  selectedOption: 'A' | 'B' | 'C' | 'D'
  isCorrect: boolean
  submission?: AssignmentSubmission
  question?: AssignmentQuestion
}

// Course Review types
export interface CourseReview {
  id: number
  studentId: number
  courseId: number
  rating: number
  comment?: string
  createdAt: string
  updatedAt: string
  student?: User
  course?: Course
}

// Course Comment types
export interface CourseComment {
  id: number
  studentId: number
  courseId: number
  commentText: string
  parentCommentId?: number
  createdAt: string
  updatedAt: string
  student?: User
  course?: Course
  parentComment?: CourseComment
  replies?: CourseComment[]
}

// Predefined Tag types
export interface PredefinedTag {
  id: number
  tagName: string
  category: 'department' | 'technical' | 'club' | 'general'
  createdAt: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Pagination types
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  tags?: string[]
  department?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Form types
export interface CreateCourseForm {
  title: string
  description: string
  departmentOrClub: string
  tags: string[]
}

export interface CreateModuleForm {
  title: string
  orderIndex: number
}

export interface CreateLectureForm {
  title: string
  videoUrl?: string
  readingMaterialsUrl?: string
  orderIndex: number
}

export interface CreateAssignmentForm {
  title: string
  dueDays: number
  weight: number
  orderIndex: number
  questions: CreateQuestionForm[]
}

export interface CreateQuestionForm {
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption: 'A' | 'B' | 'C' | 'D'
  orderIndex: number
}

export interface AssignmentSubmissionForm {
  answers: {
    questionId: number
    selectedOption: 'A' | 'B' | 'C' | 'D'
  }[]
}

export interface CourseReviewForm {
  rating: number
  comment?: string
}

export interface CourseCommentForm {
  commentText: string
  parentCommentId?: number
}

// Dashboard types
export interface DashboardStats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  averageRating: number
}

export interface StudentDashboardData {
  enrolledCourses: Course[]
  upcomingDeadlines: {
    course: Course
    assignment: Assignment
    dueDate: string
  }[]
  recentActivity: {
    type: 'enrollment' | 'submission' | 'review'
    course: Course
    timestamp: string
  }[]
}

export interface CreatorDashboardData {
  createdCourses: Course[]
  totalEnrollments: number
  averageRating: number
  recentActivity: {
    type: 'course_created' | 'enrollment' | 'review'
    course: Course
    timestamp: string
  }[]
}

// Search types
export interface SearchFilters {
  query?: string
  tags?: string[]
  department?: string
  creator?: string
  minRating?: number
  isProfessorCourse?: boolean
}

// Auth types
export interface AuthUser {
  id: number
  email: string
  fullName: string
  profilePictureUrl?: string
  isProfessor: boolean
  isAdmin: boolean
  interests: string[]
}

// UI Component types
export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
}

export interface InputProps {
  label?: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

