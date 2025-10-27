import { Request, Response } from 'express'
import { prisma } from '../server'

export const courseController = {
  async getAllCourses(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search, tags, department, sortBy = 'createdAt', sortOrder = 'desc' } = req.query

      const skip = (Number(page) - 1) * Number(limit)
      const take = Number(limit)

      const where: any = {}

      if (search) {
        where.OR = [
          { title: { contains: search as string } },
          { description: { contains: search as string } },
          { departmentOrClub: { contains: search as string } },
          { creator: { fullName: { contains: search as string } } }
        ]
      }

      if (tags && Array.isArray(tags)) {
        where.tags = {
          some: {
            tagName: { in: tags as string[] }
          }
        }
      }

      if (department) {
        where.departmentOrClub = department
      }

      const [courses, total] = await Promise.all([
        prisma.course.findMany({
          where,
          include: {
            creator: {
              select: {
                id: true,
                fullName: true,
                profilePictureUrl: true,
                isProfessor: true
              }
            },
            tags: true,
            _count: {
              select: {
                enrollments: true,
                reviews: true
              }
            }
          },
          orderBy: {
            [sortBy as string]: sortOrder
          },
          skip,
          take
        }),
        prisma.course.count({ where })
      ])

      return res.json({
        success: true,
        data: courses,
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
      console.error('Get all courses error:', error)
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async searchCourses(req: Request, res: Response) {
    try {
      const { q, tags, department, minRating, isProfessorCourse } = req.query

      const where: any = {}

      if (q) {
        where.OR = [
          { title: { contains: q as string } },
          { description: { contains: q as string } },
          { departmentOrClub: { contains: q as string } },
          { creator: { fullName: { contains: q as string } } }
        ]
      }

      if (tags && Array.isArray(tags)) {
        where.tags = {
          some: {
            tagName: { in: tags as string[] }
          }
        }
      }

      if (department) {
        where.departmentOrClub = department
      }

      if (minRating) {
        where.averageRating = { gte: Number(minRating) }
      }

      if (isProfessorCourse !== undefined) {
        where.isProfessorCourse = isProfessorCourse === 'true'
      }

      const courses = await prisma.course.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              fullName: true,
              profilePictureUrl: true,
              isProfessor: true
            }
          },
          tags: true,
          _count: {
            select: {
              enrollments: true,
              reviews: true
            }
          }
        },
        orderBy: {
          averageRating: 'desc'
        },
        take: 20
      })

      return res.json({
        success: true,
        data: courses
      })
    } catch (error) {
      console.error('Search courses error:', error)
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getCourseById(req: Request, res: Response) {
    try {
      const { id } = req.params

      const course = await prisma.course.findUnique({
        where: { id: Number(id) },
        include: {
          creator: {
            select: {
              id: true,
              fullName: true,
              profilePictureUrl: true,
              isProfessor: true
            }
          },
          tags: true,
          modules: {
            include: {
              lectures: {
                orderBy: { orderIndex: 'asc' }
              },
              assignments: {
                include: {
                  questions: {
                    orderBy: { orderIndex: 'asc' }
                  }
                },
                orderBy: { orderIndex: 'asc' }
              }
            },
            orderBy: { orderIndex: 'asc' }
          },
          reviews: {
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
            take: 10
          },
          _count: {
            select: {
              enrollments: true,
              reviews: true
            }
          }
        }
      })

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        })
      }

      return res.json({
        success: true,
        data: course
      })
    } catch (error) {
      console.error('Get course by ID error:', error)
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getCourseModules(req: Request, res: Response) {
    try {
      const { id } = req.params

      const modules = await prisma.module.findMany({
        where: { courseId: Number(id) },
        include: {
          lectures: {
            orderBy: { orderIndex: 'asc' }
          },
          assignments: {
            include: {
              questions: {
                orderBy: { orderIndex: 'asc' }
              }
            },
            orderBy: { orderIndex: 'asc' }
          }
        },
        orderBy: { orderIndex: 'asc' }
      })

      return res.json({
        success: true,
        data: modules
      })
    } catch (error) {
      console.error('Get course modules error:', error)
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async createCourse(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || 1 // Default to user ID 1 for development
      const { title, description, departmentOrClub, tags } = req.body

      if (!title || !description || !departmentOrClub) {
        return res.status(400).json({
          success: false,
          message: 'Title, description, and department/club are required'
        })
      }

      // Get user to check if they're a professor (or use default)
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      const isProfessorCourse = user?.isProfessor || false

      const course = await prisma.course.create({
        data: {
          title,
          description,
          departmentOrClub,
          creatorId: userId,
          isProfessorCourse,
          tags: {
            create: tags?.map((tagName: string) => ({
              tagName
            })) || []
          }
        },
        include: {
          creator: {
            select: {
              id: true,
              fullName: true,
              profilePictureUrl: true,
              isProfessor: true
            }
          },
          tags: true
        }
      })

      return res.status(201).json({
        success: true,
        data: course
      })
    } catch (error) {
      console.error('Create course error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async updateCourse(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params
      const { title, description, departmentOrClub, tags } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if user owns the course
      const existingCourse = await prisma.course.findFirst({
        where: {
          id: Number(id),
          creatorId: userId
        }
      })

      if (!existingCourse) {
        return res.status(404).json({
          success: false,
          message: 'Course not found or you do not have permission to edit it'
        })
      }

      // Update course
      const course = await prisma.course.update({
        where: { id: Number(id) },
        data: {
          title,
          description,
          departmentOrClub,
          updatedAt: new Date()
        },
        include: {
          creator: {
            select: {
              id: true,
              fullName: true,
              profilePictureUrl: true,
              isProfessor: true
            }
          },
          tags: true
        }
      })

      // Update tags if provided
      if (tags && Array.isArray(tags)) {
        await prisma.courseTag.deleteMany({
          where: { courseId: Number(id) }
        })

        await prisma.courseTag.createMany({
          data: tags.map((tagName: string) => ({
            courseId: Number(id),
            tagName
          }))
        })
      }

      return res.json({
        success: true,
        data: course
      })
    } catch (error) {
      console.error('Update course error:', error)
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async deleteCourse(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || 1 // Default to user ID 1 for development
      const { id } = req.params

      // Check if user owns the course or is admin
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      const existingCourse = await prisma.course.findFirst({
        where: {
          id: Number(id),
          ...(user?.isAdmin ? {} : { creatorId: userId })
        }
      })

      if (!existingCourse) {
        return res.status(404).json({
          success: false,
          message: 'Course not found or you do not have permission to delete it'
        })
      }

      await prisma.course.delete({
        where: { id: Number(id) }
      })

      return res.json({
        success: true,
        message: 'Course deleted successfully'
      })
    } catch (error) {
      console.error('Delete course error:', error)
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async enrollInCourse(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if course exists
      const course = await prisma.course.findUnique({
        where: { id: Number(id) }
      })

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        })
      }

      // Check if already enrolled
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: userId,
            courseId: Number(id)
          }
        }
      })

      if (existingEnrollment) {
        return res.status(400).json({
          success: false,
          message: 'You are already enrolled in this course'
        })
      }

      // Create enrollment
      const enrollment = await prisma.enrollment.create({
        data: {
          studentId: userId,
          courseId: Number(id)
        },
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
        }
      })

        return res.status(500).json({
        success: true,
        data: enrollment
      })
    } catch (error) {
      console.error('Enroll in course error:', error)
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async unenrollFromCourse(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Find and delete enrollment
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: userId,
            courseId: Number(id)
          }
        }
      })

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'You are not enrolled in this course'
        })
      }

      await prisma.enrollment.delete({
        where: {
          studentId_courseId: {
            studentId: userId,
            courseId: Number(id)
          }
        }
      })

      return res.json({
        success: true,
        message: 'Successfully unenrolled from course'
      })
    } catch (error) {
      console.error('Unenroll from course error:', error)
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getCourseReviews(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { page = 1, limit = 10 } = req.query

      const skip = (Number(page) - 1) * Number(limit)
      const take = Number(limit)

      const [reviews, total] = await Promise.all([
        prisma.courseReview.findMany({
          where: { courseId: Number(id) },
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
          where: { courseId: Number(id) }
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

  async createCourseReview(req: Request, res: Response) {
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

      // Check if user is enrolled in the course
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: userId,
            courseId: Number(id)
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
            courseId: Number(id)
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
          courseId: Number(id),
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
      await this.updateCourseRating(Number(id))

        return res.status(500).json({
        success: true,
        data: review
      })
    } catch (error) {
      console.error('Create course review error:', error)
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async updateCourseReview(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id, reviewId } = req.params
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
          id: Number(reviewId),
          studentId: userId,
          courseId: Number(id)
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
        where: { id: Number(reviewId) },
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
      await this.updateCourseRating(Number(id))

      return res.json({
        success: true,
        data: review
      })
    } catch (error) {
      console.error('Update course review error:', error)
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async deleteCourseReview(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id, reviewId } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if review exists and belongs to user
      const existingReview = await prisma.courseReview.findFirst({
        where: {
          id: Number(reviewId),
          studentId: userId,
          courseId: Number(id)
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
        where: { id: Number(reviewId) }
      })

      // Update course average rating
      await this.updateCourseRating(Number(id))

      return res.json({
        success: true,
        message: 'Review deleted successfully'
      })
    } catch (error) {
      console.error('Delete course review error:', error)
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getCourseComments(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { page = 1, limit = 20 } = req.query

      const skip = (Number(page) - 1) * Number(limit)
      const take = Number(limit)

      const [comments, total] = await Promise.all([
        prisma.courseComment.findMany({
          where: { 
            courseId: Number(id),
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
            courseId: Number(id),
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

  async createCourseComment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params
      const { commentText, parentCommentId } = req.body

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
            courseId: Number(id)
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
          courseId: Number(id),
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

        return res.status(500).json({
        success: true,
        data: comment
      })
    } catch (error) {
      console.error('Create course comment error:', error)
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async updateCourseComment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id, commentId } = req.params
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
          id: Number(commentId),
          studentId: userId,
          courseId: Number(id)
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
        where: { id: Number(commentId) },
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
      console.error('Update course comment error:', error)
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async deleteCourseComment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id, commentId } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if comment exists and belongs to user
      const existingComment = await prisma.courseComment.findFirst({
        where: {
          id: Number(commentId),
          studentId: userId,
          courseId: Number(id)
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
        where: { id: Number(commentId) }
      })

      return res.json({
        success: true,
        message: 'Comment deleted successfully'
      })
    } catch (error) {
      console.error('Delete course comment error:', error)
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
