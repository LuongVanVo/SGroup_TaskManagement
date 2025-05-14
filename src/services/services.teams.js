import Team from '../model/model.teams.js'
import Member from '../model/model.users.js'

// get all teams
const getAllTeamsService = async () => {
    try {
        const teams = await Team.find()
        return teams
    } catch (error) {
        throw new Error(error)
    }
}

// create a new team
const createTeamService = async (teamData) => {
    try {
        const newTeam = await Team.create(teamData)
        return newTeam
    } catch (error) {
        throw new Error(error)
    }
}

// add member to team
const addMemberToTeamService = async (teamID, memberID) => {
    try {
        const team = await Team.findById(teamID)
        const member = await Member.findById(memberID)
        if (!team) {
            throw new Error('Team not found')
        }
        if (!member) {
            throw new Error('Member not fount')
        }
        // check member exist in team
        if (team.members.includes(memberID)) {
            throw new Error('Member already in team')
        }
        // check team exist in member
        if (member.teams.includes(teamID)) {
            throw new Error('Team already in member\'s teams')
        }
        team.members.push(memberID)
        member.teams.push(teamID)
        await Promise.all([
            team.save(),
            member.save()
        ])
        return (team, member)
    } catch(error) {
        throw new Error(error)
    }
}
// get username, fullname and email members in teams
const getMembersInTeamService = async (teamID) => {
    const team = await Team.findById(teamID)
    if (!team) {
        throw new Error('Team not found')
    }
    const members = await Member.find({ _id: { $in: team.members } })
    if (members.length === 0) {
        throw new Error('No members found in team')
    }
   // get username, fullname and email members in teams
   const membersInfo = members.map(member => {
        return {
            username: member.userName,
            fullname: member.fullName,
            email: member.email
        }
   })
   return membersInfo
}

// delete member from team
const deleteMemberFromTeamService = async (teamID, memberID) => {
    try {
        const team  = await Team.findById(teamID)
        const member = await Member.findById(memberID)
        if (!team) {
            throw new Error('Team not found')
        }
        if (!member) {
            throw new Error('Member not found')
        }
        if (!team.members.includes(memberID)) {
            throw new Error('Member not in team')
        }
        if (!member.teams.includes(teamID)) {
            throw new Error('Team not in member\'s teams')
        }
        team.members = team.members.filter(id => id.toString() !== memberID)
        member.teams = member.teams.filter(id => id.toString() !== teamID)
        await Promise.all([
            team.save(),
            member.save()
        ])
        return (team, member)
    } catch(error) {
        throw new Error(error)
    }
}
export default {
    getAllTeamsService,
    createTeamService,
    addMemberToTeamService,
    getMembersInTeamService,
    deleteMemberFromTeamService
}