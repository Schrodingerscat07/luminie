import { Request, Response } from 'express'
import { prisma } from '../server'

export const assignmentController = {
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
  },

  async getSubmission(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      const submission = await prisma.assignmentSubmission.findUnique({
        where: {
          studentId_assignmentId: {
            studentId: userId,
            assignmentId: Number(id)
          }
        },
        include: {
          answers: {
            include: {
              question: true
            }
          }
        }
      })

      if (!submission) {
        return res.status(404).json({
          success: false,
          message: 'Submission not found'
        })
      }

      return res.json({
        success: true,
        data: submission
      })
    } catch (error) {
      console.error('Get submission error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getAssignmentResults(req: Request, res: Response) {
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
          questions: true,
          submissions: {
            where: { studentId: userId },
            include: {
              answers: true
            }
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
      console.error('Get assignment results error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getMyAssignments(req: Request, res: Response) {
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
      console.error('Get my assignments error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getUpcomingAssignments(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Get upcoming assignments (due within next 7 days)
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

      const upcomingAssignments = enrollments.flatMap((enrollment: any) =>
        enrollment.course.modules.flatMap((module: any) =>
          module.assignments.map((assignment: any) => ({
            ...assignment,
            course: enrollment.course,
            module,
            submission: assignment.submissions[0] || null,
            dueDate: new Date(Date.now() + assignment.dueDays * 24 * 60 * 60 * 1000)
          }))
        )
      )

      return res.json({
        success: true,
        data: upcomingAssignments
      })
    } catch (error) {
      console.error('Get upcoming assignments error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async getSubmittedAssignments(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      const submissions = await prisma.assignmentSubmission.findMany({
        where: { studentId: userId },
        include: {
          assignment: {
            include: {
              module: {
                include: {
                  course: true
                }
              }
            }
          },
          answers: {
            include: {
              question: true
            }
          }
        },
        orderBy: { submittedAt: 'desc' }
      })

      return res.json({
        success: true,
        data: submissions
      })
    } catch (error) {
      console.error('Get submitted assignments error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }
}