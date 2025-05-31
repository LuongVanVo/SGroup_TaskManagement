import express from 'express'
import teams from '../controllers/controllers.teams.js'
import members from '../controllers/controller.members.js'
import tasks from '../controllers/controllers.tasks.js'
import subboards from '../controllers/controllers.subboards.js'
import comments from '../controllers/controllers.comments.js'
import { requireAdminRole } from '../middlewares/middleware.requireAdminRole.js'
import { checkEmailExist } from '../middlewares/middleware.checkEmailExist.js'
import { authTokenMiddleWare } from '../middlewares/middleware.auth.js'
import { checkDueTimeMiddleware } from '../middlewares/middleware.checkDueTime.js'
import { checkTeamIDMiddleware } from '../middlewares/middleware.checkTeamID.js'
import { checkRoleAdminMiddleware } from '../middlewares/middleware.checkRoleAdmin.js'
const routerAPI = express.Router()

routerAPI.get('/teams', teams.getAllTeams)
routerAPI.get('/teams/:teamID', teams.getTeamByID)
routerAPI.post('/teams', checkTeamIDMiddleware, teams.createTeam)

routerAPI.post('/newMember', members.createMember)
routerAPI.get('/getAllMember', members.getAllMember)

routerAPI.post('/addMemberToTeam', checkRoleAdminMiddleware, teams.addMemberToTeam)
routerAPI.get('/getMembersInTeam', teams.getMembersInTeam)
routerAPI.delete('/deleteMemberFromTeam', requireAdminRole, teams.deleteMemberFromTeam)

// member 
// register a new member
routerAPI.post('/registerMember',checkEmailExist, members.registerMember)
// register a new member by admin
routerAPI.post('/registerMemberAdmin', checkEmailExist, members.registerMemberAdmin)
// login a get jwt token
routerAPI.post('/loginMember', members.loginMember)
// // get info member by jwt token
routerAPI.get('/members/me', members.getMemberByToken)
// // update member
routerAPI.patch('/members/me', members.updateProfileInfo)

// tasks
routerAPI.post('/tasks', requireAdminRole, tasks.createTask)
routerAPI.get('/tasks', authTokenMiddleWare, tasks.getAllTasks)
routerAPI.get('/tasks/:taskId', authTokenMiddleWare, tasks.getTaskById)
routerAPI.patch('/tasks/:taskId', requireAdminRole, checkDueTimeMiddleware, tasks.updateTask)
routerAPI.delete('/tasks/:taskId', requireAdminRole, tasks.deleteTask)

// subboards
routerAPI.post('/subboards/:taskId', requireAdminRole, subboards.addSubBoardToTask)
routerAPI.patch('/subboards/:subBoardId', requireAdminRole, subboards.updateSubBoardOnTask)
routerAPI.delete('/subboards/:subBoardId', requireAdminRole, subboards.deleteSubBoardOnTask)
// upload image
routerAPI.post('/subboards/:subBoardId/upload-bg', authTokenMiddleWare, subboards.uploadSubBoardImage)

// comments
routerAPI.post('/tasks/:taskId/comments', authTokenMiddleWare, comments.addCommentToTask)
routerAPI.get('/tasks/:taskId/comments', authTokenMiddleWare, comments.getAllCommentsOfATask)
export default routerAPI
