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
export default {
    createMember,
    getAllMember,
    registerMember,
    registerMemberAdmin,
    loginMember,
    getMemberByToken,
    updateProfileInfo
}