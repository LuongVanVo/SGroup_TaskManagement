import Member from '../model/model.users.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
dotenv.config()

const salt = 10
// create a new member 
const createMemberService = async (memberData) => {
    try {
        const newMember = await Member.create(memberData)
        return newMember
    } catch(error) {
        throw new Error(error)
    }
}

// get all members
const getAllMembersService = async () => {
    try {
        const members = await Member.find()
        return members
    } catch(error) {
        throw new Error(error)
    }
}

// register a new member
const registerMemberService = async (userName, email, fullName, password) => {
    try {
        // hash password
        const hashPassword = await bcrypt.hash(password, salt)
        // create a new member
        const newMember = await Member.create({
            userName,
            email,
            password: hashPassword,
            fullName,
            role: 'member',
            createdAt: new Date().toISOString()
        })
        return newMember
    } catch(err) {
        throw new Error(err)
    }
}

const registerMemberAdminService = async (userName, email, fullName, password) => {
    try {
        // hash password
        const hashPassword = await bcrypt.hash(password, salt)
        // create a new member
        const newMember = await Member.create({
            userName,
            email,
            password: hashPassword,
            fullName,
            role: 'admin',
            createdAt: new Date().toISOString()
        })
        return newMember
    } catch(err) {
        throw new Error(err)
    }
}
// login a get jwt token
const loginMemberService = async (email, password) => {
    try {
        const member = await Member.findOne({ email })
        if (!member) {
            return {
                success: false,
                message: 'Email or password is incorrect'
            }
        }
        // compare password
        const isMatchPassword = await bcrypt.compare(password, member.password)
        if (!isMatchPassword) {
            return {
                success: false,
                message: 'Email or password is incorrect'
            }
        } else {
            const payload = {
                id: member._id,
                userName: member.userName,
                email: member.email,
                fullName: member.fullName,
                role: member.role,
                createdAt: member.createdAt
            }
            const accessToken = await jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN
                }
            )
            return {
                success: true,
                message: 'Login successfully',
                accessToken: accessToken,
                member: {
                    id: member._id,
                    userName: member.userName,
                    email: member.email,
                    fullName: member.fullName,
                    role: member.role,
                    createdAt: member.createdAt
                }
            }
        }
    } catch (err) {
        throw new Error(err)
    }
}

// get info member by jwt token
const getMemberByTokenService = async (token) => {
    try {
        if (!token) {
            throw new Error('Token not found')
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        const member = await Member.findById(decoded.id).select('-password')
        if (!member) {
            throw new Error('Member not found')
        }
        return {
            id: member._id,
            userName: member.userName,
            email: member.email,
            fullName: member.fullName,
            role: member.role,
            createdAt: member.createdAt,
            teams: member.teams
        }
    } catch (err) {
        if (err.name == 'TokenExpiredError') {
            throw new Error('Token expired')
        }
        if (err.name == 'JsonWebTokenError') {
            throw new Error('Token invalid')
        }
        throw new Error('Token not found or invalid')
    }
}

// update profile member 
const updateProfileMemberService = async (token, memberData) => {
    try {
        if (!token) {
            throw new Error('Token not found 1')
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        const member = await Member.findById(decoded.id).select('-password')
        if (!member) {
            throw new Error('Member not found')
        }
        
        // check if email is already exist
        const emailExist = await Member.findOne({ email: memberData.email })
        if (emailExist && !emailExist._id.equals(member._id)) { 
                throw new Error('Email already exists for another account');
            }  

        // update 
        member.userName = memberData.userName
        member.email = memberData.email
        member.fullName = memberData.fullName

        await member.save()
        return {
            id: member._id,
            userName: member.userName,
            email: member.email,
            fullName: member.fullName,
            role: member.role,
            createdAt: member.createdAt
        }
    } catch (err) {
        if (err.name == 'TokenExpiredError') {
            throw new Error('Token expired')
        }
        if (err.name == 'JsonWebTokenError') {
            throw new Error('Token invalid')
        }
        throw new Error('Token not found 2')
    }
}

// send email with token, npm mailer 
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

async function forgotPasswordService(email) {
    try{
        const member = await Member.findOne({ email })
        if (!member) {
            throw new Error('Member not found')
        }
        const payload = {
            email: member.email
        }
        const resetToken = await jwt.sign(
            payload, 
            process.env.JWT_SECRET,
            {
                expiresIn: 7 * 60 // 7 minutes
            }
        )
        member.passwordResetToken = resetToken
        member.passwordResetExpires = new Date(Date.now() + 7 * 60 * 1000) // 7 minutes
        await member.save()

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: member.email,
            subject: 'Password Reset Request',
            html: `<p>Your reset token is:<strong>${resetToken}</strong></p>`
        }
        await transporter.sendMail(mailOptions)
        return {
            success: true,
            message: 'Reset token sent to your email'
        }
    } catch (error) {
        throw new Error(error)
    }
}

async function resetPasswordService(token, newPassword, email) {
    try {
        const member = await Member.findOne({
            passwordResetToken: token,
            email: email,
        })
        if (!member) {
            throw new Error('Invalid token or email')
        }
        if (member.passwordResetExpires < new Date()) {
            throw new Error('Token expired')
        }
        member.password = await bcrypt.hash(newPassword, salt)
        member.passwordResetToken = undefined
        member.passwordResetExpires = undefined
        await member.save()
        return {
            success: true,
            message: 'Password reset successfully'
        }
    } catch (error) {
        throw new Error(error)
    }
}
export default {
    createMemberService,
    getAllMembersService,
    registerMemberService,
    registerMemberAdminService,
    loginMemberService,
    getMemberByTokenService,
    updateProfileMemberService,
    forgotPasswordService,
    resetPasswordService
}
