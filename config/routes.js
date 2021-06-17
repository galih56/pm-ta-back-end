/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  //Users
  'POST /login': 'UserController.login',
  'POST /logout': 'UserController.logout',
  'POST /zoom-authentication':'UserController.zoomAuthentication',
  'GET /zoom-authentication':'UserController.zoomAuthentication',
  'POST /user': 'UserController.register',
  'GET /user': 'UserController.find',
  'GET /user/:id': 'UserController.findOne',
  'GET /user/:id/project': 'UserController.getProjects',
  'GET /user/:id/tasks': 'UserController.getTasks',
  'GET /user/:id/meeting': 'UserController.getMeetings',
  'POST /user/:id/project': 'UserController.createProject',
  'PATCH /user/:id': 'UserController.update',
  'DELETE /user/:id': 'UserController.delete',
  'POST /get-github-access-token': 'UserController.getGithubAccessToken',
  'GET /user/sendemail': 'UserController.sendVerificationMail',
  'GET /user/verifyemail': 'UserController.verifyEmail',

  //Project
  'POST /project': 'ProjectController.create',
  'GET /project': 'ProjectController.find',
  'GET /project/:id': 'ProjectController.findOne',
  'GET /project/:id/files': 'ProjectController.getFiles',
  'GET /project/:id/list': 'ProjectController.getLists',
  'PATCH /project/:id': 'ProjectController.update',
  'DELETE /project/:id': 'ProjectController.delete',
  'GET /project/:id/member': 'ProjectController.getMembers',
  'GET /project/:id/meeting': 'ProjectController.getMeetings',

  //List
  'POST /list': 'ListController.create',
  'GET /list': 'ListController.find',
  'GET /list/:id': 'ListController.findOne',
  'PATCH /list/:id': 'ListController.update',
  'DELETE /list/:id': 'ListController.delete',

  //tag
  'POST /tag': 'TagController.create',
  'GET /tag': 'TagController.find',
  'GET /tag/:id': 'TagController.findOne',
  'PATCH /tag/:id': 'TagController.update',
  'DELETE /tag/:id': 'TagController.delete',

  //Task
  'POST /task': 'TaskController.create',
  'GET /task': 'TaskController.find',
  'GET /task/:id': 'TaskController.findOne',
  'PATCH /task/:id': 'TaskController.update',
  'DELETE /task/:id': 'TaskController.delete',

  //TaskAttachments
  'POST /task-attachments': 'TaskAttachmentController.create',
  'GET /task-attachments': 'TaskAttachmentController.find',
  'GET /task-attachments/:id': 'TaskAttachmentController.findOne',
  'DELETE /task-attachments/:id': 'TaskAttachmentController.delete',

  //File
  'POST /files': 'FileController.create',
  'GET /files': 'FileController.find',
  'GET /files/:id': 'FileController.findOne',
  'GET /files/:id/download': 'FileController.download',
  'DELETE /files/:id': 'FileController.delete',

  //ProjectMembers
  'POST /member': 'ProjectMemberController.create',
  'GET /member': 'ProjectMemberController.find',
  'GET /member/:id': 'ProjectMemberController.findOne',
  'GET /member/:id/tasks': 'ProjectMemberController.getTasks',
  'PATCH /member/:id': 'ProjectMemberController.update',
  'DELETE /member/:id': 'ProjectMemberController.delete',

  //MemberRoles
  'POST /memberrole': 'MemberRoleController.create',
  'GET /memberrole': 'MemberRoleController.find',
  'GET /memberrole/:id': 'MemberRoleController.findOne',
  'PATCH /memberrole/:id': 'MemberRoleController.update',
  'DELETE /memberrole/:id': 'MemberRoleController.delete',

  //occupation
  'POST /occupation': 'OccupationController.create',
  'GET /occupation': 'OccupationController.find',
  'GET /occupation/tree': 'OccupationController.getTree',
  'PATCH /occupation/:id': 'OccupationController.update',
  'GET /occupation/:id': 'OccupationController.findOne',
  'DELETE /occupation/:id': 'OccupationController.delete',

  //Meeting
  'POST /meeting': 'MeetingController.create',
  'GET /meeting': 'MeetingController.find',
  'GET /meeting/:id': 'MeetingController.findOne',
  'PATCH /meeting/:id': 'MeetingController.update',
  'DELETE /meeting/:id': 'MeetingController.delete',
  'GET /meeting/respond-to-zoom': 'MeetingController.respondToZoom',

  //GithubRepository
  'POST /github-repository': 'GithubRepositoryController.create',
  'GET /github-repository': 'GithubRepositoryController.find',
  'GET /project/:id/github-repository': 'GithubRepositoryController.find',
  'GET /github-repository/:id': 'GithubRepositoryController.findOne',
  'PATCH /github-repository/:id': 'GithubRepositoryController.update',
  'DELETE /github-repository/:id': 'GithubRepositoryController.delete',

  
  //Team
  'POST /team': 'TeamController.create',
  'GET /team': 'TeamController.find',
  'GET /team/:id': 'TeamController.findOne',
  'PATCH /team/:id': 'TeamController.update',
  'DELETE /team/:id': 'TeamController.delete',
  
  'POST /team-member': 'TeamController.create',
  'DELETE /team-member/:id': 'TeamController.delete',

  
  //task member
  'POST /task-member': 'TaskMemberController.create',
  'GET /task-member': 'TaskMemberController.find',
  'GET /task-member/:id': 'TaskMemberController.findOne',
  'PATCH /task-member/:id': 'TaskMemberController.update',
  'DELETE /task-member/:id': 'TaskMemberController.delete',
};
