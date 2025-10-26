import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../server'

interface AuthRequest extends Request {
  user?: {
    userId: number
    email: string
    isProfessor: boolean
    isAdmin: boolean
  }
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      })
    }

    req.user = {
      userId: user.id,
      email: user.email,
      isProfessor: user.isProfessor,
      isAdmin: user.isAdmin
    }

    return next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }
}

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    })
  }
  return next()
}

export const professorMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isProfessor && !req.user?.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Professor access required'
    })
  }
  return next()
}
