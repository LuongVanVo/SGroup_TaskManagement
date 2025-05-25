import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema({
    teamID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    members: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', required: true },
    tasks: { type: [mongoose.Schema.Types.ObjectId], ref: 'Task', required: true },
})

const Team = mongoose.model('teams', teamSchema)

export default Team
