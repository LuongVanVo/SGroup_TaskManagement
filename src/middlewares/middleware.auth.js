import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
import Member from '../model/model.users.js'

export const authTokenMiddleWare = async(req, res, next) => {
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
        req.member = member
        req.token = token
        next()
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: invalid token'
            })
        }
        if (error.name === 'TokenExpiredError') {
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