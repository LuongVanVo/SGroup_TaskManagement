import Member from '../model/model.users.js'

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
export default {
    createMemberService,
    getAllMembersService
}
