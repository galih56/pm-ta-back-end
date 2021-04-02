/**
 * ProjectMemberController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
*/
const moment = require('moment-timezone');
module.exports = {
	find: async (req, res) => {
		try {
			let roles = await ProjectMember.find();
			return res.send(roles);
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	findOne: async (req, res) => {
		let params = req.allParams();
		try {
			if (params.id) {
				let roles = await ProjectMember.find({ id: params.id });
				if (roles > 0) {
					return res.send(roles[0]);
				}
				return res.notFound();
			}
			return res.notFound();
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	create: async (req, res) => {
		try {
			let params = req.allParams();
			let insertedMembers = [];
			if (params.members) {
				var newMembers = params.members;
				for (let i = 0; i < newMembers.length; i++) {
					var newMember = newMembers[i];
					newMember = await ProjectMember.create({
						user: newMember.id,
						project: params.projectId,
						role: params.roleId,
						createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
						updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
					}).fetch();
					insertedMembers.push(newMember);
				}
			}
			return res.ok(insertedMembers);
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	update: async (req, res) => {
		try {
			let params = req.allParams();
			let attributes = {};

			if (params.user_id) attributes.user = params.user_id;
			if (params.projects_id) attributes.project = params.projects_id;
			if (params.roles_id) attributes.role = params.roles_id;

			const results = await ProjectMember.update({ id: params.id }, attributes, { updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') });
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	},
	delete: async (req, res) => {
		try {
			let params = req.allParams();
			const results = await ProjectMember.destroy({
				id: params.id
			});
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	}
};