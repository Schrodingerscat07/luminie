import { Request, Response } from 'express'
import { prisma } from '../server'

export const commentController = {
  async getCourseComments(req: Request, res: Response) {
    try {
      const { courseId } = req.params
      const { page = 1, limit = 20 } = req.query

      const skip = (Number(page) - 1) * Number(limit)
      const take = Number(limit)

      const [comments, total] = await Promise.all([
        prisma.courseComment.findMany({
          where: { 
            courseId: Number(courseId),
            parentCommentId: null // Only top-level comments
          },
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                profilePictureUrl: true
              }
            },
            replies: {
              include: {
                student: {
                  select: {
                    id: true,
                    fullName: true,
                    profilePictureUrl: true
                  }
                }
              },
              orderBy: { createdAt: 'asc' }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take
        }),
        prisma.courseComment.count({
          where: { 
            courseId: Number(courseId),
            parentCommentId: null
          }
        })
      ])

      return res.json({
        success: true,
        data: comments,
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
      console.error('Get course comments error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async createComment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { courseId, commentText, parentCommentId } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      if (!commentText) {
        return res.status(400).json({
          success: false,
          message: 'Comment text is required'
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
          message: 'You must be enrolled in this course to comment'
        })
      }

      // Create comment
      const comment = await prisma.courseComment.create({
        data: {
          studentId: userId,
          courseId: Number(courseId),
          commentText,
          parentCommentId: parentCommentId ? Number(parentCommentId) : null
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

      return res.status(201).json({
        success: true,
        data: comment
      })
    } catch (error) {
      console.error('Create comment error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async updateComment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params
      const { commentText } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      if (!commentText) {
        return res.status(400).json({
          success: false,
          message: 'Comment text is required'
        })
      }

      // Check if comment exists and belongs to user
      const existingComment = await prisma.courseComment.findFirst({
        where: {
          id: Number(id),
          studentId: userId
        }
      })

      if (!existingComment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found or you do not have permission to edit it'
        })
      }

      // Update comment
      const comment = await prisma.courseComment.update({
        where: { id: Number(id) },
        data: {
          commentText,
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

      return res.json({
        success: true,
        data: comment
      })
    } catch (error) {
      console.error('Update comment error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async deleteComment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if comment exists and belongs to user
      const existingComment = await prisma.courseComment.findFirst({
        where: {
          id: Number(id),
          studentId: userId
        }
      })

      if (!existingComment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found or you do not have permission to delete it'
        })
      }

      // Delete comment (this will also delete replies due to cascade)
      await prisma.courseComment.delete({
        where: { id: Number(id) }
      })

      return res.json({
        success: true,
        message: 'Comment deleted successfully'
      })
    } catch (error) {
      console.error('Delete comment error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getMyComments(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      const comments = await prisma.courseComment.findMany({
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
        data: comments
      })
    } catch (error) {
      console.error('Get my comments error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }
}