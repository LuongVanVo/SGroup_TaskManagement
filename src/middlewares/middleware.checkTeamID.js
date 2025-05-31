// check teamID middleware
import Team from '../model/model.teams.js'

export const checkTeamIDMiddleware = async(req, res, next) => {
    const { teamID } = req.body
    if (!teamID) {
        return res.status(400).json({ message: 'Team ID is required' })
    }
    try {
        const team = await Team.find({ teamID: teamID })
        // Nếu đã tồn tại team với teamID này
        if (team.length > 0) {
            return res.status(400).json({ message: 'Team ID already exists' })
        }
        next()
    } catch (error) {
        console.error('Error checking team ID:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}