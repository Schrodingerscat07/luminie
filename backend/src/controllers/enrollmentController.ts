import { Request, Response } from 'express'
import { prisma } from '../server'

export const enrollmentController = {
  async getMyEnrollments(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      const enrollments = await prisma.enrollment.findMany({
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
              },
              tags: true,
              _count: {
                select: {
                  enrollments: true,
                  reviews: true
                }
              }
            }
          }
        },
        orderBy: { enrolledAt: 'desc' }
      })

      return res.json({
        success: true,
        data: enrollments
      })
    } catch (error) {
      console.error('Get my enrollments error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getEnrollmentById(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      const enrollment = await prisma.enrollment.findFirst({
        where: {
          id: Number(id),
          studentId: userId
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
              },
              tags: true,
              modules: {
                include: {
                  lectures: {
                    orderBy: { orderIndex: 'asc' }
                  },
                  assignments: {
                    include: {
                      questions: true,
                      submissions: {
                        where: { studentId: userId }
                      }
                    },
                    orderBy: { orderIndex: 'asc' }
                  }
                },
                orderBy: { orderIndex: 'asc' }
              }
            }
          }
        }
      })

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Enrollment not found'
        })
      }

      return res.json({
        success: true,
        data: enrollment
      })
    } catch (error) {
      console.error('Get enrollment by ID error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getEnrollmentProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      const enrollment = await prisma.enrollment.findFirst({
        where: {
          id: Number(id),
          studentId: userId
        },
        include: {
          course: {
            include: {
              modules: {
                include: {
                  lectures: true,
                  assignments: {
                    include: {
                      submissions: {
                        where: { studentId: userId }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Enrollment not found'
        })
      }

      // Calculate progress
      const totalLectures = enrollment.course.modules.reduce((sum: number, module: any) => sum + module.lectures.length, 0)
      const totalAssignments = enrollment.course.modules.reduce((sum: number, module: any) => sum + module.assignments.length, 0)
      const completedAssignments = enrollment.course.modules.reduce((sum: number, module: any) => 
        sum + module.assignments.filter((assignment: any) => assignment.submissions.length > 0).length, 0
      )

      const progress = {
        totalLectures,
        totalAssignments,
        completedAssignments,
        completionPercentage: totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0
      }

      return res.json({
        success: true,
        data: {
          enrollment,
          progress
        }
      })
    } catch (error) {
      console.error('Get enrollment progress error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async completeModule(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params
      const { moduleId } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if user is enrolled in the course
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          id: Number(id),
          studentId: userId
        }
      })

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Enrollment not found'
        })
      }

      // In a real implementation, you would track module completion
      // For now, we'll just return success
      return res.json({
        success: true,
        message: 'Module marked as completed'
      })
    } catch (error) {
      console.error('Complete module error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async completeLecture(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params
      const { lectureId } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if user is enrolled in the course
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          id: Number(id),
          studentId: userId
        }
      })

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Enrollment not found'
        })
      }

      // In a real implementation, you would track lecture completion
      // For now, we'll just return success
      return res.json({
        success: true,
        message: 'Lecture marked as completed'
      })
    } catch (error) {
      console.error('Complete lecture error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getUpcomingDeadlines(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Get upcoming deadlines (assignments due within next 7 days)
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: userId },
        include: {
          course: {
            include: {
              modules: {
                include: {
                  assignments: {
                    where: {
                      dueDays: {
                        lte: 7
                      }
                    },
                    include: {
                      submissions: {
                        where: { studentId: userId }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })

      const upcomingDeadlines = enrollments.flatMap((enrollment: any) =>
        enrollment.course.modules.flatMap((module: any) =>
          module.assignments.map((assignment: any) => ({
            course: enrollment.course,
            assignment,
            dueDate: new Date(Date.now() + assignment.dueDays * 24 * 60 * 60 * 1000),
            isSubmitted: assignment.submissions.length > 0
          }))
        )
      ).sort((a: any, b: any) => a.dueDate.getTime() - b.dueDate.getTime())

      return res.json({
        success: true,
        data: upcomingDeadlines
      })
    } catch (error) {
      console.error('Get upcoming deadlines error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getRecentActivity(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Get recent activity (enrollments, submissions, reviews)
      const [enrollments, submissions, reviews] = await Promise.all([
        prisma.enrollment.findMany({
          where: { studentId: userId },
          include: { course: true },
          orderBy: { enrolledAt: 'desc' },
          take: 5
        }),
        prisma.assignmentSubmission.findMany({
          where: { studentId: userId },
          include: {
            assignment: {
              include: {
                module: {
                  include: { course: true }
                }
              }
            }
          },
          orderBy: { submittedAt: 'desc' },
          take: 5
        }),
        prisma.courseReview.findMany({
          where: { studentId: userId },
          include: { course: true },
          orderBy: { createdAt: 'desc' },
          take: 5
        })
      ])

      const activities = [
        ...enrollments.map((e: any) => ({
          type: 'enrollment',
          course: e.course,
          timestamp: e.enrolledAt,
          description: `Enrolled in ${e.course.title}`
        })),
        ...submissions.map((s: any) => ({
          type: 'submission',
          course: s.assignment.module.course,
          timestamp: s.submittedAt,
          description: `Submitted assignment: ${s.assignment.title}`
        })),
        ...reviews.map((r: any) => ({
          type: 'review',
          course: r.course,
          timestamp: r.createdAt,
          description: `Reviewed ${r.course.title}`
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      return res.json({
        success: true,
        data: activities.slice(0, 10)
      })
    } catch (error) {
      console.error('Get recent activity error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }
}