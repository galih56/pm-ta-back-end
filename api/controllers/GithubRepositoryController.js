/**
 * ProjectsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const moment = require('moment-timezone');

module.exports = {
	find: async (req, res) => {
		try {
			let params = req.allParams();
			var attributes={};
			if(params.id) attributes.project=params.id;
			let repos = await GithubRepository.find(attributes).populate('project');
			return res.send(repos);
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	findOne: async (req, res) => {
		let params = req.allParams();
		try {
			let repos = await GithubRepository.find({ id: params.id }).populate('lists');
			if (repos.length > 0) {
					return res.send(repos[0]);
			}
			return res.notFound();
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	create: async (req, res) => {
		let params = req.allParams();
		try {
			let repo = await GithubRepository.create({
				owner_name: params.owner_name,
				repository_name: params.repository_name,
				project: params.project,
			}).fetch();
			return res.ok(repo);
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	update: async (req, res) => {
		try {
			let params = req.allParams();
			let attributes = {};

			if (params.repository_name) attributes.repository_name = params.repository_name;
			if (params.owner_name) attributes.owner_name = params.owner_name;
			if (params.project) attributes.project = params.project;

			const results = await GithubRepository.update({ id: params.id }, attributes);
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	},
	delete: async (req, res) => {
		let params = req.allParams();
		try {
			await GithubRepository.destroy({ id: params.id });
			return res.ok();
		} catch (err) {
			return res.serverError(err);
		}
	},
};



