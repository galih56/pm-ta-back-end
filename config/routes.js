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
  'POST /user': 'UserController.register',
  'GET /user': 'UserController.find',
  'GET /user/:id': 'UserController.findOne',
  'GET /user/:id/project': 'UserController.getProjects',
  'POST /user/:id/project': 'UserController.createProject',
  'PATCH /user/:id': 'UserController.update',
  'DELETE /user/:id': 'UserController.delete',

  //Project
  'POST /project': 'ProjectController.create',
  'GET /project': 'ProjectController.find',
  'GET /project/:id': 'ProjectController.findOne',
  'GET /project/:id/list': 'ProjectController.getListsBasedOnProject',
  'PATCH /project/:id': 'ProjectController.update',
  'DELETE /project/:id': 'ProjectController.delete',

  //List
  'POST /list': 'ListController.create',
  'GET /list': 'ListController.find',
  'GET /list/:id': 'ListController.findOne',
  'PATCH /list/:id': 'ListController.update',
  'DELETE /list/:id': 'ListController.delete',


  //List
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
  'POST /task/:id/checklist': 'TaskController.addChecklist',
  'PATCH /task/:taskId/checklist/:checklistId': 'TaskController.updateChecklist',
  'DELETE /task/:taskId/checklist/:checklistId': 'TaskController.removeChecklist',
  
  //TaskAttachment
  'POST /files': 'TaskAttachmentController.create',
  'GET /files': 'TaskAttachmentController.find',
  'GET /files/:id': 'TaskAttachmentController.findOne',
  'DELETE /files/:id': 'TaskAttachmentController.delete',

  //ProjectMembers
  'POST /member': 'ProjectMemberController.create',
  'GET /member': 'ProjectMemberController.find',
  'GET /member/:id': 'ProjectMemberController.findOne',
  'PATCH /member/:id': 'ProjectMemberController.update',
  'DELETE /member/:id': 'ProjectMemberController.delete',

  //EmployeeRoles
  'POST /emplyeerole': 'EmployeeRoleController.create',
  'GET /emplyeerole': 'EmployeeRoleController.find',
  'GET /emplyeerole/:id': 'EmployeeRoleController.findOne',
  'PATCH /emplyeerole/:id': 'EmployeeRoleController.update',
  'DELETE /emplyeerole/:id': 'EmployeeRoleController.delete',

};
