import { Request, Response } from 'express'
import { prisma } from '../server'

export const moduleController = {
  async createModule(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { courseId, title, orderIndex } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if user owns the course
      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          creatorId: userId
        }
      })

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found or you do not have permission to add modules'
        })
      }

      const module = await prisma.module.create({
        data: {
          courseId,
          title,
          orderIndex
        }
      })

      return res.status(201).json({
        success: true,
        data: module
      })
    } catch (error) {
      console.error('Create module error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async updateModule(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params
      const { title, orderIndex } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if user owns the course
      const module = await prisma.module.findFirst({
        where: {
          id: Number(id),
          course: {
            creatorId: userId
          }
        }
      })

      if (!module) {
        return res.status(404).json({
          success: false,
          message: 'Module not found or you do not have permission to edit it'
        })
      }

      const updatedModule = await prisma.module.update({
        where: { id: Number(id) },
        data: {
          title,
          orderIndex
        }
      })

      return res.json({
        success: true,
        data: updatedModule
      })
    } catch (error) {
      console.error('Update module error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async deleteModule(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if user owns the course
      const module = await prisma.module.findFirst({
        where: {
          id: Number(id),
          course: {
            creatorId: userId
          }
        }
      })

      if (!module) {
        return res.status(404).json({
          success: false,
          message: 'Module not found or you do not have permission to delete it'
        })
      }

      await prisma.module.delete({
        where: { id: Number(id) }
      })

      return res.json({
        success: true,
        message: 'Module deleted successfully'
      })
    } catch (error) {
      console.error('Delete module error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async createLecture(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params
      const { title, videoUrl, readingMaterialsUrl, orderIndex } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if user owns the course
      const module = await prisma.module.findFirst({
        where: {
          id: Number(id),
          course: {
            creatorId: userId
          }
        }
      })

      if (!module) {
        return res.status(404).json({
          success: false,
          message: 'Module not found or you do not have permission to add lectures'
        })
      }

      const lecture = await prisma.lecture.create({
        data: {
          moduleId: Number(id),
          title,
          videoUrl,
          readingMaterialsUrl,
          orderIndex
        }
      })

      return res.status(201).json({
        success: true,
        data: lecture
      })
    } catch (error) {
      console.error('Create lecture error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async updateLecture(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { lectureId } = req.params
      const { title, videoUrl, readingMaterialsUrl, orderIndex } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if user owns the course
      const lecture = await prisma.lecture.findFirst({
        where: {
          id: Number(lectureId),
          module: {
            course: {
              creatorId: userId
            }
          }
        }
      })

      if (!lecture) {
        return res.status(404).json({
          success: false,
          message: 'Lecture not found or you do not have permission to edit it'
        })
      }

      const updatedLecture = await prisma.lecture.update({
        where: { id: Number(lectureId) },
        data: {
          title,
          videoUrl,
          readingMaterialsUrl,
          orderIndex
        }
      })

      return res.json({
        success: true,
        data: updatedLecture
      })
    } catch (error) {
      console.error('Update lecture error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async deleteLecture(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { lectureId } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if user owns the course
      const lecture = await prisma.lecture.findFirst({
        where: {
          id: Number(lectureId),
          module: {
            course: {
              creatorId: userId
            }
          }
        }
      })

      if (!lecture) {
        return res.status(404).json({
          success: false,
          message: 'Lecture not found or you do not have permission to delete it'
        })
      }

      await prisma.lecture.delete({
        where: { id: Number(lectureId) }
      })

      return res.json({
        success: true,
        message: 'Lecture deleted successfully'
      })
    } catch (error) {
      console.error('Delete lecture error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async createAssignment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params
      const { title, dueDays, weight, orderIndex } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if user owns the course
      const module = await prisma.module.findFirst({
        where: {
          id: Number(id),
          course: {
            creatorId: userId
          }
        }
      })

      if (!module) {
        return res.status(404).json({
          success: false,
          message: 'Module not found or you do not have permission to add assignments'
        })
      }

      const assignment = await prisma.assignment.create({
        data: {
          moduleId: Number(id),
          title,
          dueDays,
          weight,
          orderIndex
        }
      })

      return res.status(201).json({
        success: true,
        data: assignment
      })
    } catch (error) {
      console.error('Create assignment error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async updateAssignment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { assignmentId } = req.params
      const { title, dueDays, weight, orderIndex } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if user owns the course
      const assignment = await prisma.assignment.findFirst({
        where: {
          id: Number(assignmentId),
          module: {
            course: {
              creatorId: userId
            }
          }
        }
      })

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Assignment not found or you do not have permission to edit it'
        })
      }

      const updatedAssignment = await prisma.assignment.update({
        where: { id: Number(assignmentId) },
        data: {
          title,
          dueDays,
          weight,
          orderIndex
        }
      })

      return res.json({
        success: true,
        data: updatedAssignment
      })
    } catch (error) {
      console.error('Update assignment error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async deleteAssignment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { assignmentId } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if user owns the course
      const assignment = await prisma.assignment.findFirst({
        where: {
          id: Number(assignmentId),
          module: {
            course: {
              creatorId: userId
            }
          }
        }
      })

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Assignment not found or you do not have permission to delete it'
        })
      }

      await prisma.assignment.delete({
        where: { id: Number(assignmentId) }
      })

      return res.json({
        success: true,
        message: 'Assignment deleted successfully'
      })
    } catch (error) {
      console.error('Delete assignment error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async createQuestion(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { assignmentId } = req.params
      const { questionText, optionA, optionB, optionC, optionD, correctOption, orderIndex } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if user owns the course
      const assignment = await prisma.assignment.findFirst({
        where: {
          id: Number(assignmentId),
          module: {
            course: {
              creatorId: userId
            }
          }
        }
      })

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Assignment not found or you do not have permission to add questions'
        })
      }

      const question = await prisma.assignmentQuestion.create({
        data: {
          assignmentId: Number(assignmentId),
          questionText,
          optionA,
          optionB,
          optionC,
          optionD,
          correctOption,
          orderIndex
        }
      })

      return res.status(201).json({
        success: true,
        data: question
      })
    } catch (error) {
      console.error('Create question error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async updateQuestion(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { questionId } = req.params
      const { questionText, optionA, optionB, optionC, optionD, correctOption, orderIndex } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if user owns the course
      const question = await prisma.assignmentQuestion.findFirst({
        where: {
          id: Number(questionId),
          assignment: {
            module: {
              course: {
                creatorId: userId
              }
            }
          }
        }
      })

      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found or you do not have permission to edit it'
        })
      }

      const updatedQuestion = await prisma.assignmentQuestion.update({
        where: { id: Number(questionId) },
        data: {
          questionText,
          optionA,
          optionB,
          optionC,
          optionD,
          correctOption,
          orderIndex
        }
      })

      return res.json({
        success: true,
        data: updatedQuestion
      })
    } catch (error) {
      console.error('Update question error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async deleteQuestion(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { questionId } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      // Check if user owns the course
      const question = await prisma.assignmentQuestion.findFirst({
        where: {
          id: Number(questionId),
          assignment: {
            module: {
              course: {
                creatorId: userId
              }
            }
          }
        }
      })

      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found or you do not have permission to delete it'
        })
      }

      await prisma.assignmentQuestion.delete({
        where: { id: Number(questionId) }
      })

      return res.json({
        success: true,
        message: 'Question deleted successfully'
      })
    } catch (error) {
      console.error('Delete question error:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }
}