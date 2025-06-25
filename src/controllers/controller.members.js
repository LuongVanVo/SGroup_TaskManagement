import Member from '../model/model.users.js';
import servicesMembers from '../services/services.members.js'

// create a new member
const createMember = async (req, res) => {
    try {
        const memberData = {
            userName: req.body.userName,
            email: req.body.email,
            fullName: req.body.fullName,
        }
        const newMember = await servicesMembers.createMemberService(memberData);
        return res.status(200).json(newMember)
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}
// get all members
const getAllMember = async (req, res) => {
    try {
        const member = await servicesMembers.getAllMembersService()
        return res.status(200).json(member)
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}

// register a new member
const registerMember = async (req, res) => {
    try {
        const { userName, email, fullName, password } = req.body
        const newMember = await servicesMembers.registerMemberService(userName, email, fullName, password)
        return res.status(200).json({
            "success": true,
            "message": "Member registered successfully",
            "data": newMember
        })
    } catch(error) {
        return res.status(500).json({
            "success": false,
            "message": error.message
        })
    }
}

// register a new member by admin
const registerMemberAdmin = async (req, res) => {
    try {
        const { userName, email, fullName, password } = req.body
        const newMember = await servicesMembers.registerMemberAdminService(userName, email, fullName, password)
        return res.status(200).json({
            "success": true,
            "message": "Member registered successfully",
            "data": newMember
        })
    } catch(error) {
        return res.status(500).json({
            "success": false,
            "message": error.message
        })
    }
}
// login a get jwt token
const loginMember = async (req, res) => {
    try {
        const { email, password } = req.body
        const member = await servicesMembers.loginMemberService(email, password)
        return res.status(200).json({
            "success": true,
            "message": "Login successfully",
            "data": member
        })
    } catch (err) {
        return res.status(500).json({
            "success": false,
            "message": "Login failed",
        })
    }
}

// // get info member by jwt token
const getMemberByToken = async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) {
            return res.status(401).json({
                "success": false,
                "message": "Unauthorized: no token provided"
            })
        }
        const memberInfo = await servicesMembers.getMemberByTokenService(token)
        return res.status(200).json({
            "success": true,
            "message": "Get member info successfully",
            "data": memberInfo
        })
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message
        })
    }
}

// update profile member
const updateProfileInfo = async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) {
            return res.status(401).json({
                "success": false,
                "message": "Unauthorized: no token provided"
            })
        }
        const { userName, email, fullName } = req.body
        if (!userName && !email && !fullName) {
            return res.status(400).json({
                "success": false,
                "message": "At least one field (userName, email, fullName) must be provided"
            });
        }
        
        // Nếu có email mới, kiểm tra xem email đã được sử dụng bởi thành viên khác chưa
        if (email) {
            const existingMember = await Member.findOne({
                email: email
            });
            
            if (existingMember) {
                return res.status(400).json({
                    "success": false,
                    "message": "Email is already in use by another member"
                });
            }
        }
        
        const updateData = await servicesMembers.updateProfileMemberService(token, req.body)
        if (!updateData) {
            return res.status(400).json({
                "success": false,
                "message": "Update failed"
            })
        }
        return res.status(200).json({
            "success": true,
            "message": "Update successfully",
            "data": updateData
        })
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message
        })
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        const member = await servicesMembers.forgotPasswordService(email)
        if (!member) {
            return res.status(404).json({
                "success": false,
                "message": "Member not found"
            })
        }
        return res.status(200).json({
            "success": true,
            "message": "Password reset link sent to your email"
        })
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message
        })
    }
}

const resetPassword = async (req, res) => {
    // get the token from authorization header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({
            "success": false,
            "message": "Unauthorized: no token provided"
        }) 
    }
    const { newPassword, email } = req.body
    try {
        const result = await servicesMembers.resetPasswordService(token, newPassword, email)
        return res.status(200).json({
            "success": true,
            "message": result.message
        })
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message
        })
    }
}
export default {
    createMember,
    getAllMember,
    registerMember,
    registerMemberAdmin,
    loginMember,
    getMemberByToken,
    updateProfileInfo,
    forgotPassword,
    resetPassword
}