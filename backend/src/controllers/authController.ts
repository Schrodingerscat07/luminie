import { Request, Response } from 'express'
import { prisma } from '../server'
import jwt, { SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const authController = {
  async googleAuth(req: Request, res: Response) {
    // This would integrate with Passport.js Google OAuth strategy
    // For now, returning a placeholder response
    return res.json({ message: 'Google OAuth endpoint - to be implemented' })
  },

  async googleCallback(req: Request, res: Response) {
    // This would handle the Google OAuth callback
    // For now, returning a placeholder response
    return res.json({ message: 'Google OAuth callback - to be implemented' })
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(500).json({
          success: false,
          message: 'Email and password are required'
        })
      }

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          interests: true
        }
      })

      if (!user) {
        return res.status(500).json({
          success: false,
          message: 'Invalid credentials'
        })
      }

      // For Google OAuth users, password might not exist
      // This is a simplified version - in production, you'd handle this differently
      if (!user.googleId) {
        return res.status(500).json({
          success: false,
          message: 'Please use Google OAuth to sign in'
        })
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          isProfessor: user.isProfessor,
          isAdmin: user.isAdmin
        },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
      )

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
          token
        }
      })
    } catch (error) {
      console.error('Login error:', error)
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async logout(req: Request, res: Response) {
    // In a JWT-based system, logout is typically handled client-side
    // by removing the token from storage
    return res.json({
      success: true,
      message: 'Logged out successfully'
    })
  },

  async getCurrentUser(req: Request, res: Response) {
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
      console.error('Get current user error:', error)
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        })
      }

      // Verify refresh token and generate new access token
      // This is a simplified version - in production, you'd use a proper refresh token system
      return res.json({
        success: true,
        message: 'Token refresh - to be implemented'
      })
    } catch (error) {
      console.error('Refresh token error:', error)
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  },

  async setupProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const { interests } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      if (!interests || !Array.isArray(interests)) {
        return res.status(400).json({
          success: false,
          message: 'Interests array is required'
        })
      }

      // Update user interests
      await prisma.userInterest.deleteMany({
        where: { userId }
      })

      await prisma.userInterest.createMany({
        data: interests.map((tagName: string) => ({
          userId,
          tagName
        }))
      })

      return res.json({
        success: true,
        message: 'Profile setup completed successfully'
      })
    } catch (error) {
      console.error('Setup profile error:', error)
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }
}
