import express from 'express'
import home from '../controllers/controllers.home.js'
import teams from '../controllers/controllers.teams.js'
import members from '../controllers/controller.members.js'
const routerAPI = express.Router()

routerAPI.get('/', home)
routerAPI.get('/teams', teams.getAllTeams)
routerAPI.post('/teams', teams.createTeam)

routerAPI.post('/newMember', members.createMember)
routerAPI.get('/getAllMember', members.getAllMember)

routerAPI.post('/addMemberToTeam', teams.addMemberToTeam)
routerAPI.get('/getMembersInTeam', teams.getMembersInTeam)
routerAPI.delete('/deleteMemberFromTeam', teams.deleteMemberFromTeam)
export default routerAPI
