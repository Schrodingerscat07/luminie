import { Request, Response } from 'express'
import { prisma } from '../server'

export const reviewController = {
  async getCourseReviews(req: Request, res: Response) {
    try {
      const { courseId } = req.params
      const { page = 1, limit = 10 } = req.query

      const skip = (Number(page) - 1) * Number(limit)
      const take = Number(limit)

      const [reviews, total] = await Promise.all([
        prisma.courseReview.findMany({
          where: { courseId: Number(courseId) },
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                profilePictureUrl: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take
        }),
        prisma.courseReview.count({
          where: { courseId: Number(courseId) }
        })
      ])

      return res.json({
        success: true,
        data: reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
          hasNext: skip + take < total,
          hasPrev: Number(page) > 1
        }
      })
    } catch (error) {
      console.error('Get course reviews error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async createReview(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { courseId, rating, comment } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        })
      }

      // Check if user is enrolled in the course
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: userId,
            courseId: Number(courseId)
          }
        }
      })

      if (!enrollment) {
        return res.status(400).json({
          success: false,
          message: 'You must be enrolled in this course to review it'
        })
      }

      // Check if user already reviewed this course
      const existingReview = await prisma.courseReview.findUnique({
        where: {
          studentId_courseId: {
            studentId: userId,
            courseId: Number(courseId)
          }
        }
      })

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this course'
        })
      }

      // Create review
      const review = await prisma.courseReview.create({
        data: {
          studentId: userId,
          courseId: Number(courseId),
          rating,
          comment
        },
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
              profilePictureUrl: true
            }
          }
        }
      })

      // Update course average rating
      await this.updateCourseRating(Number(courseId))

      return res.status(201).json({
        success: true,
        data: review
      })
    } catch (error) {
      console.error('Create review error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async updateReview(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params
      const { rating, comment } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        })
      }

      // Check if review exists and belongs to user
      const existingReview = await prisma.courseReview.findFirst({
        where: {
          id: Number(id),
          studentId: userId
        }
      })

      if (!existingReview) {
        return res.status(404).json({
          success: false,
          message: 'Review not found or you do not have permission to edit it'
        })
      }

      // Update review
      const review = await prisma.courseReview.update({
        where: { id: Number(id) },
        data: {
          rating,
          comment,
          updatedAt: new Date()
        },
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
              profilePictureUrl: true
            }
          }
        }
      })

      // Update course average rating
      await this.updateCourseRating(existingReview.courseId)

      return res.json({
        success: true,
        data: review
      })
    } catch (error) {
      console.error('Update review error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async deleteReview(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if review exists and belongs to user
      const existingReview = await prisma.courseReview.findFirst({
        where: {
          id: Number(id),
          studentId: userId
        }
      })

      if (!existingReview) {
        return res.status(404).json({
          success: false,
          message: 'Review not found or you do not have permission to delete it'
        })
      }

      // Delete review
      await prisma.courseReview.delete({
        where: { id: Number(id) }
      })

      // Update course average rating
      await this.updateCourseRating(existingReview.courseId)

      return res.json({
        success: true,
        message: 'Review deleted successfully'
      })
    } catch (error) {
      console.error('Delete review error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getMyReviews(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      const reviews = await prisma.courseReview.findMany({
        where: { studentId: userId },
        include: {
          course: {
            include: {
              creator: {
                select: {
                  id: true,
                  fullName: true,
                  profilePictureUrl: true,
                  isProfessor: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return res.json({
        success: true,
        data: reviews
      })
    } catch (error) {
      console.error('Get my reviews error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  // Helper method to update course rating
  async updateCourseRating(courseId: number) {
    try {
      const reviews = await prisma.courseReview.findMany({
        where: { courseId },
        select: { rating: true }
      })

      if (reviews.length > 0) {
        const averageRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length

        await prisma.course.update({
          where: { id: courseId },
          data: {
            averageRating: Number(averageRating.toFixed(2)),
            totalRatings: reviews.length
          }
        })
      }
    } catch (error) {
      console.error('Update course rating error:', error)
    }
  }
}