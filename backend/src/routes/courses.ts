import express from 'express'
import { courseController } from '../controllers/courseController'
import { authMiddleware } from '../middleware/auth'
import { Request, Response, NextFunction } from 'express'

const router = express.Router()

// Public routes
router.get('/', courseController.getAllCourses)
router.get('/search', courseController.searchCourses)
router.get('/:id', courseController.getCourseById)
router.get('/:id/modules', courseController.getCourseModules)

// Protected routes
router.use(authMiddleware as any)

// Course management
router.post('/', courseController.createCourse)
router.put('/:id', courseController.updateCourse)
router.delete('/:id', courseController.deleteCourse)

// Course enrollment
router.post('/:id/enroll', courseController.enrollInCourse)
router.delete('/:id/unenroll', courseController.unenrollFromCourse)

// Course reviews
router.get('/:id/reviews', courseController.getCourseReviews)
router.post('/:id/reviews', courseController.createCourseReview)
router.put('/:id/reviews/:reviewId', courseController.updateCourseReview)
router.delete('/:id/reviews/:reviewId', courseController.deleteCourseReview)

// Course comments
router.get('/:id/comments', courseController.getCourseComments)
router.post('/:id/comments', courseController.createCourseComment)
router.put('/:id/comments/:commentId', courseController.updateCourseComment)
router.delete('/:id/comments/:commentId', courseController.deleteCourseComment)

export default router
