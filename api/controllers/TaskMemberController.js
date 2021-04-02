/**
 * TaskMemberController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	find: async (req, res) => {
		try {
			let taskMember = await TaskMember.find();
			return res.send(taskMember);
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	findOne: async (req, res) => {
		let params = req.allParams();
		try {
			if (params.id) {
				let taskMember = await TaskMember.find({ id: params.id });
				if (taskMember.length > 0) {
					return res.send(taskMember[0]);
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
			let taskMember = await TaskMember.create({
				task: params.tasks_id,
				member: params.project_members_id,
				createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
				updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
			});
			return res.ok(taskMember);
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	update: async (req, res) => {
		try {
			let params = req.allParams();
			let attributes = {};
			if (params.tasks_id) attributes.task = params.tasks_id;
			if (params.project_members_id) attributes.member = params.project_members_id;
			attributes.updatedAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
			const results = await TaskMember.update({ id: params.id }, attributes);
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	},
	delete: async (req, res) => {
		try {
			let params = req.allParams();
			const results = await TaskMember.destroy({ id: params.id });
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	}
};

