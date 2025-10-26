import express from 'express'
import { userController } from '../controllers/userController'
import { authMiddleware } from '../middleware/auth'
import { Request, Response, NextFunction } from 'express'

const router = express.Router()

// Public routes
router.get('/tags', userController.getPredefinedTags)

// Protected routes
router.use(authMiddleware as any)

// User profile
router.get('/profile', userController.getProfile)
router.put('/profile', userController.updateProfile)
router.get('/dashboard', userController.getDashboard)

// User courses
router.get('/courses', userController.getUserCourses)
router.get('/enrolled-courses', userController.getEnrolledCourses)
router.get('/created-courses', userController.getCreatedCourses)

// User assignments
router.get('/assignments', userController.getUserAssignments)
router.get('/assignments/:id', userController.getAssignmentById)
router.post('/assignments/:id/submit', userController.submitAssignment)

export default router
