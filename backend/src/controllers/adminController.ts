import { Request, Response } from 'express'
import { prisma } from '../server'

export const adminController = {
  async getAllUsers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search, role } = req.query

      const skip = (Number(page) - 1) * Number(limit)
      const take = Number(limit)

      const where: any = {}

      if (search) {
        where.OR = [
          { fullName: { contains: search as string } },
          { email: { contains: search as string } }
        ]
      }

      if (role === 'professor') {
        where.isProfessor = true
      } else if (role === 'admin') {
        where.isAdmin = true
      } else if (role === 'student') {
        where.isProfessor = false
        where.isAdmin = false
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          include: {
            interests: true,
            _count: {
              select: {
                createdCourses: true,
                enrollments: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take
        }),
        prisma.user.count({ where })
      ])

      return res.json({
        success: true,
        data: users,
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
      console.error('Get all users error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params

      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: {
          interests: true,
          createdCourses: {
            include: {
              tags: true,
              _count: {
                select: {
                  enrollments: true,
                  reviews: true
                }
              }
            }
          },
          enrollments: {
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
          },
          _count: {
            select: {
              createdCourses: true,
              enrollments: true,
              courseReviews: true,
              courseComments: true
            }
          }
        }
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      return res.json({
        success: true,
        data: user
      })
    } catch (error) {
      console.error('Get user by ID error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async updateUserRole(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { isProfessor, isAdmin } = req.body

      const user = await prisma.user.findUnique({
        where: { id: Number(id) }
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          isProfessor: isProfessor !== undefined ? isProfessor : user.isProfessor,
          isAdmin: isAdmin !== undefined ? isAdmin : user.isAdmin
        }
      })

      return res.json({
        success: true,
        data: updatedUser
      })
    } catch (error) {
      console.error('Update user role error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params

      const user = await prisma.user.findUnique({
        where: { id: Number(id) }
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      await prisma.user.delete({
        where: { id: Number(id) }
      })

      return res.json({
        success: true,
        message: 'User deleted successfully'
      })
    } catch (error) {
      console.error('Delete user error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getAllCourses(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search, department, isProfessorCourse } = req.query

      const skip = (Number(page) - 1) * Number(limit)
      const take = Number(limit)

      const where: any = {}

      if (search) {
        where.OR = [
          { title: { contains: search as string } },
          { description: { contains: search as string } },
          { creator: { fullName: { contains: search as string } } }
        ]
      }

      if (department) {
        where.departmentOrClub = department
      }

      if (isProfessorCourse !== undefined) {
        where.isProfessorCourse = isProfessorCourse === 'true'
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
          orderBy: { createdAt: 'desc' },
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

  async deleteCourse(req: Request, res: Response) {
    try {
      const { id } = req.params

      const course = await prisma.course.findUnique({
        where: { id: Number(id) }
      })

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
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

  async getStats(req: Request, res: Response) {
    try {
      const [
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalReviews,
        averageRating,
        professorCourses,
        studentCourses
      ] = await Promise.all([
        prisma.user.count(),
        prisma.course.count(),
        prisma.enrollment.count(),
        prisma.courseReview.count(),
        prisma.course.aggregate({
          _avg: { averageRating: true }
        }),
        prisma.course.count({
          where: { isProfessorCourse: true }
        }),
        prisma.course.count({
          where: { isProfessorCourse: false }
        })
      ])

      return res.json({
        success: true,
        data: {
          totalUsers,
          totalCourses,
          totalEnrollments,
          totalReviews,
          averageRating: averageRating._avg.averageRating || 0,
          professorCourses,
          studentCourses
        }
      })
    } catch (error) {
      console.error('Get stats error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getCourseStats(req: Request, res: Response) {
    try {
      const [
        totalCourses,
        coursesByDepartment,
        coursesByMonth,
        topRatedCourses
      ] = await Promise.all([
        prisma.course.count(),
        prisma.course.groupBy({
          by: ['departmentOrClub'],
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } }
        }),
        prisma.course.groupBy({
          by: ['createdAt'],
          _count: { id: true },
          where: {
            createdAt: {
              gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
            }
          }
        }),
        prisma.course.findMany({
          orderBy: { averageRating: 'desc' },
          take: 10,
          include: {
            creator: {
              select: {
                id: true,
                fullName: true,
                profilePictureUrl: true,
                isProfessor: true
              }
            },
            _count: {
              select: {
                enrollments: true,
                reviews: true
              }
            }
          }
        })
      ])

      return res.json({
        success: true,
        data: {
          totalCourses,
          coursesByDepartment,
          coursesByMonth,
          topRatedCourses
        }
      })
    } catch (error) {
      console.error('Get course stats error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getUserStats(req: Request, res: Response) {
    try {
      const [
        totalUsers,
        usersByRole,
        usersByMonth,
        activeUsers
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.groupBy({
          by: ['isProfessor', 'isAdmin'],
          _count: { id: true }
        }),
        prisma.user.groupBy({
          by: ['createdAt'],
          _count: { id: true },
          where: {
            createdAt: {
              gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
            }
          }
        }),
        prisma.user.count({
          where: {
            enrollments: {
              some: {}
            }
          }
        })
      ])

      return res.json({
        success: true,
        data: {
          totalUsers,
          usersByRole,
          usersByMonth,
          activeUsers
        }
      })
    } catch (error) {
      console.error('Get user stats error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getEnrollmentStats(req: Request, res: Response) {
    try {
      const [
        totalEnrollments,
        enrollmentsByMonth,
        enrollmentsByCourse,
        completionRates
      ] = await Promise.all([
        prisma.enrollment.count(),
        prisma.enrollment.groupBy({
          by: ['enrolledAt'],
          _count: { id: true },
          where: {
            enrolledAt: {
              gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
            }
          }
        }),
        prisma.enrollment.groupBy({
          by: ['courseId'],
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 10
        }),
        prisma.enrollment.aggregate({
          _avg: { finalGrade: true }
        })
      ])

      return res.json({
        success: true,
        data: {
          totalEnrollments,
          enrollmentsByMonth,
          enrollmentsByCourse,
          averageCompletionRate: completionRates._avg.finalGrade || 0
        }
      })
    } catch (error) {
      console.error('Get enrollment stats error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async updateFinalGrade(req: Request, res: Response) {
    try {
      const { enrollmentId } = req.params
      const { finalGrade } = req.body

      if (finalGrade < 0 || finalGrade > 100) {
        return res.status(400).json({
          success: false,
          message: 'Final grade must be between 0 and 100'
        })
      }

      const enrollment = await prisma.enrollment.findUnique({
        where: { id: Number(enrollmentId) }
      })

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Enrollment not found'
        })
      }

      const updatedEnrollment = await prisma.enrollment.update({
        where: { id: Number(enrollmentId) },
        data: { finalGrade }
      })

      return res.json({
        success: true,
        data: updatedEnrollment
      })
    } catch (error) {
      console.error('Update final grade error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }
}