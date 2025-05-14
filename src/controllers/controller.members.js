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

export default {
    createMember,
    getAllMember
}