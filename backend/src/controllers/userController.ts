import { Request, Response } from 'express'
import { prisma } from '../server'

export const userController = {
  async getPredefinedTags(req: Request, res: Response) {
    try {
      const tags = await prisma.predefinedTag.findMany({
        orderBy: { category: 'asc' }
      })

      return res.json({
        success: true,
        data: tags
      })
    } catch (error) {
      console.error('Get predefined tags error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          interests: true
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
        data: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          profilePictureUrl: user.profilePictureUrl,
          isProfessor: user.isProfessor,
          isAdmin: user.isAdmin,
          interests: user.interests.map((interest: any) => interest.tagName)
        }
      })
    } catch (error) {
      console.error('Get profile error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { fullName, interests } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Update user profile
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          fullName: fullName || undefined
        }
      })

      // Update interests if provided
      if (interests && Array.isArray(interests)) {
        await prisma.userInterest.deleteMany({
          where: { userId }
        })

        await prisma.userInterest.createMany({
          data: interests.map((tagName: string) => ({
            userId,
            tagName
          }))
        })
      }

      return res.json({
        success: true,
        data: user
      })
    } catch (error) {
      console.error('Update profile error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getDashboard(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          interests: true
        }
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      // Get user's enrolled courses
      const enrolledCourses = await prisma.enrollment.findMany({
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
        orderBy: { enrolledAt: 'desc' },
        take: 10
      })

      // Get user's created courses (if creator)
      const createdCourses = await prisma.course.findMany({
        where: { creatorId: userId },
        include: {
          tags: true,
          _count: {
            select: {
              enrollments: true,
              reviews: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })

      return res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            profilePictureUrl: user.profilePictureUrl,
            isProfessor: user.isProfessor,
            isAdmin: user.isAdmin,
            interests: user.interests.map((interest: any) => interest.tagName)
          },
          enrolledCourses,
          createdCourses
        }
      })
    } catch (error) {
      console.error('Get dashboard error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getUserCourses(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      const courses = await prisma.course.findMany({
        where: { creatorId: userId },
        include: {
          tags: true,
          _count: {
            select: {
              enrollments: true,
              reviews: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return res.json({
        success: true,
        data: courses
      })
    } catch (error) {
      console.error('Get user courses error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getEnrolledCourses(req: Request, res: Response) {
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
      console.error('Get enrolled courses error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getCreatedCourses(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      const courses = await prisma.course.findMany({
        where: { creatorId: userId },
        include: {
          tags: true,
          _count: {
            select: {
              enrollments: true,
              reviews: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return res.json({
        success: true,
        data: courses
      })
    } catch (error) {
      console.error('Get created courses error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getUserAssignments(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Get assignments from enrolled courses
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: userId },
        include: {
          course: {
            include: {
              modules: {
                include: {
                  assignments: {
                    include: {
                      questions: true,
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

      const assignments = enrollments.flatMap((enrollment: any) =>
        enrollment.course.modules.flatMap((module: any) =>
          module.assignments.map((assignment: any) => ({
            ...assignment,
            course: enrollment.course,
            module,
            submission: assignment.submissions[0] || null
          }))
        )
      )

      return res.json({
        success: true,
        data: assignments
      })
    } catch (error) {
      console.error('Get user assignments error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getAssignmentById(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      const assignment = await prisma.assignment.findUnique({
        where: { id: Number(id) },
        include: {
          questions: {
            orderBy: { orderIndex: 'asc' }
          },
          module: {
            include: {
              course: true
            }
          },
          submissions: {
            where: { studentId: userId }
          }
        }
      })

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Assignment not found'
        })
      }

      return res.json({
        success: true,
        data: assignment
      })
    } catch (error) {
      console.error('Get assignment by ID error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async submitAssignment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params
      const { answers } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          message: 'Answers array is required'
        })
      }

      // Get assignment with questions
      const assignment = await prisma.assignment.findUnique({
        where: { id: Number(id) },
        include: {
          questions: true
        }
      })

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Assignment not found'
        })
      }

      // Check if already submitted
      const existingSubmission = await prisma.assignmentSubmission.findUnique({
        where: {
          studentId_assignmentId: {
            studentId: userId,
            assignmentId: Number(id)
          }
        }
      })

      if (existingSubmission) {
        return res.status(400).json({
          success: false,
          message: 'Assignment already submitted'
        })
      }

      // Calculate score
      let correctAnswers = 0
      const totalQuestions = assignment.questions.length

      for (const answer of answers) {
        const question = assignment.questions.find((q: any) => q.id === answer.questionId)
        if (question && question.correctOption === answer.selectedOption) {
          correctAnswers++
        }
      }

      const score = (correctAnswers / totalQuestions) * 100

      // Create submission
      const submission = await prisma.assignmentSubmission.create({
        data: {
          studentId: userId,
          assignmentId: Number(id),
          score
        }
      })

      // Create student answers
      await prisma.studentAnswer.createMany({
        data: answers.map((answer: any) => ({
          submissionId: submission.id,
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          isCorrect: assignment.questions.find((q: any) => q.id === answer.questionId)?.correctOption === answer.selectedOption
        }))
      })

      return res.status(201).json({
        success: true,
        data: {
          submission,
          score,
          correctAnswers,
          totalQuestions
        }
      })
    } catch (error) {
      console.error('Submit assignment error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }
}