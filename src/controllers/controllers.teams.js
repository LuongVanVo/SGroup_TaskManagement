import servicesTeams from '../services/services.teams.js'

// get all teams
const getAllTeams = async (req, res) => {
    try {
        const teams = await servicesTeams.getAllTeamsService();
        return res.status(200).json(teams)
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}

// create a new team
const createTeam = async (req, res) => {
    try {
        const teamData = {
            teamID: req.body.teamID,
            name: req.body.name,
        }
        const newTeam = await servicesTeams.createTeamService(teamData)
        return res.status(201).json(newTeam)
    } catch (error){
        return res.status(500).json({ message: error.message })
    }
}

// add members to team
const addMemberToTeam = async (req, res) => {
    try {
        const { teamID } = req.query
        const { memberID } = req.body
        const team = await servicesTeams.addMemberToTeamService(teamID, memberID)
        return res.status(200).json({
            message: "add member successfully.",
            team
        })
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}

// get members in team
const getMembersInTeam = async (req,res) => {
    try{
        const { teamID } = req.query
        const members = await servicesTeams.getMembersInTeamService(teamID)
        return res.status(200).json({
            message: `get members in team successfully, has ${members.length} members`,
            members
        })
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}

// delete member from team
const deleteMemberFromTeam = async (req, res) => {
    try {
        const { teamID } = req.query
        const { memberID } = req.body
        const team = await servicesTeams.deleteMemberFromTeamService(teamID, memberID)
        return res.status(200).json({
            message: "delete member from team successfully.",
            team
        })
    } catch(err) {
        return res.status(500).json({ message: err.message })
    }
}
export default {
    getAllTeams,
    createTeam,
    addMemberToTeam,
    getMembersInTeam,
    deleteMemberFromTeam
}
