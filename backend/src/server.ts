import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import courseRoutes from './routes/courses'
import userRoutes from './routes/users'
import { moduleController } from './controllers/moduleController'
import { assignmentController } from './controllers/assignmentController'

// Load environment variables
dotenv.config()

// Initialize Prisma client
export const prisma = new PrismaClient()

const app = express()
const PORT = process.env.PORT || 5000

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(compression())
app.use(morgan('combined'))
app.use(limiter)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CollegeCoursera API is running',
    timestamp: new Date().toISOString(),
  })
})

// Basic API routes
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'CollegeCoursera API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      courses: '/api/courses',
      users: '/api/users',
      auth: '/api/auth'
    }
  })
})

// API Routes
app.use('/api/courses', courseRoutes)
app.use('/api/users', userRoutes)

// Module routes
app.post('/api/modules', moduleController.createModule)
app.put('/api/modules/:id', moduleController.updateModule)
app.delete('/api/modules/:id', moduleController.deleteModule)
app.post('/api/modules/:id/lectures', moduleController.createLecture)
app.put('/api/modules/:id/lectures/:lectureId', moduleController.updateLecture)
app.delete('/api/modules/:id/lectures/:lectureId', moduleController.deleteLecture)

// Assignment routes (module-level assignments)
app.post('/api/modules/:id/assignments', moduleController.createAssignment)
app.put('/api/modules/:id/assignments/:assignmentId', moduleController.updateAssignment)
app.delete('/api/modules/:id/assignments/:assignmentId', moduleController.deleteAssignment)

// Assignment questions
app.post('/api/assignments/:assignmentId/questions', moduleController.createQuestion)
app.put('/api/assignments/:assignmentId/questions/:questionId', moduleController.updateQuestion)
app.delete('/api/assignments/:assignmentId/questions/:questionId', moduleController.deleteQuestion)

// Assignment submission
app.post('/api/assignments/:id/submit', assignmentController.submitAssignment)
app.get('/api/assignments/:id/submission', assignmentController.getSubmission)
app.get('/api/assignments/:id/results', assignmentController.getAssignmentResults)
app.get('/api/my-assignments', assignmentController.getMyAssignments)
app.get('/api/upcoming-assignments', assignmentController.getUpcomingAssignments)
app.get('/api/submitted-assignments', assignmentController.getSubmittedAssignments)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📚 CollegeCoursera API is ready!`)
  console.log(`🌐 Health check: http://localhost:${PORT}/health`)
})

export default app