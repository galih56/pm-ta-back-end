/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

	/***************************************************************************
	*                                                                          *
	* Default policy for all controllers and actions, unless overridden.       *
	* (`true` allows public access)                                            *
	*                                                                          *
	***************************************************************************/

	'*': true,

	UserController: {
		// '*': 'checkForUser',
		'createProject': 'isAuthenticated',
		'update': 'isAuthenticated',
		'delete': 'isAuthenticated',
	},
	ProjectController: {
		// 'find':'isAuthenticated',
		// 'findOne':'isAuthenticated',
		// 'create':'isAuthenticated',
		'update': 'isAuthenticated',
		'delete': 'isAuthenticated',
	},
	ProjectMemberController: {
		'create': 'isAuthenticated',
		'update': 'isAuthenticated',
		'delete': 'isAuthenticated',
	},
	TaskController: {
		// 'find':'isAuthenticated',
		// 'findOne':'isAuthenticated',
		'create': 'isAuthenticated',
		'update': 'isAuthenticated',
		'delete': 'isAuthenticated',
		'addChecklist': 'isAuthenticated',
		'removeChecklist': 'isAuthenticated',
		'updateChecklist': 'isAuthenticated',
	},
	TaskMemberController: {
		'create': 'isAuthenticated',
		'update': 'isAuthenticated',
		'delete': 'isAuthenticated',
	},
	OccupationController: {
		'create': 'isAuthenticated',
		'update': 'isAuthenticated',
		'delete': 'isAuthenticated',
	},
	CommentController: {
		'create': 'isAuthenticated',
		'update': 'isAuthenticated',
		'delete': 'isAuthenticated',
	},
	ListController: {
		'create': 'isAuthenticated',
		'update': 'isAuthenticated',
		'delete': 'isAuthenticated',
	},
	ActivityLogController: {
		'create': 'isAuthenticated',
		'update': 'isAuthenticated',
		'delete': 'isAuthenticated',
	},
};





