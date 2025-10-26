import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

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

// Placeholder routes
app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Courses endpoint - to be implemented'
  })
})

app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Users endpoint - to be implemented'
  })
})

app.get('/api/auth', (req, res) => {
  res.json({
    success: true,
    message: 'Auth endpoint - to be implemented'
  })
})

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