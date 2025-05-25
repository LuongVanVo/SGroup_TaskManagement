import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()
import Member from '../model/model.users.js'

export const requireAdminRole = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    let token

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]
    }
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const member = await Member.findById(decoded.id).select('-password')
        if (!member) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: member not found'
            })
        }
        if (member.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: you do not have permission to access this resource'
            })
        }
        req.member = {
            id: member._id,
            userName: member.userName,
            email: member.email,
            fullName: member.fullName,
            role: member.role,
            createdAt: member.createdAt
        }
        req.token = token
        next()
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: invalid token'
            })
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: token expired'
            })
        }
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}