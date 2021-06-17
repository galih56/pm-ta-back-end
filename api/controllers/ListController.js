/**
 * ListController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment = require('moment-timezone');
module.exports = {
	find: async (req, res) => {
		try {
			let lists = await List.find().populate('project');
			return res.send(lists);
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	findOne: async (req, res) => {
		let params = req.allParams();
		try {
			if (params.id) {
				let lists = await List.find({ id: params.id });
				if (lists.length > 0) {
					return res.send(lists[0]);
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
			const data = {
				title: params.title,
				start: params.start,
				end: params.end,
				project: Number(params.projects_id),
				createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
				updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
			}
			let list = await List.create(data);
			return res.ok(list);
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	update: async (req, res) => {
		try {
			let params = req.allParams();
			let attributes = {};
			if (params.title) attributes.title = params.title;
			if (params.start) attributes.start = params.start;
			if (params.end) attributes.end = params.end;
			attributes.updatedAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
			const results = await List.update({ id: params.id }, attributes);
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	},
	delete: async (req, res) => {
		try {
			let params = req.allParams();
			await List.destroy({ id: params.id });
			await Task.destroy({ list: params.id });
			return res.ok();
		} catch (err) {
			return res.serverError(err);
		}
	},
};

