/**
 * TaskController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment = require('moment-timezone');
module.exports = {
	find: async (req, res) => {
		try {
			let tasks = await Task.find().populate('taskMembers');
			return res.send(tasks);
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	findOne: async (req, res) => {
		let params = req.allParams();
		let tasks = await Task.find({ id: params.id }).populate('creator')
			.populate('taskMembers').populate('comments')
			.populate('logs').populate('checklists').populate('attachments').populate('tags');

		if (tasks.length > 0) {
			var task = tasks[0];
			const tags = task.tags.map(async tagRelation => {
				return await Tag.findOne({ id: tagRelation.tag });
			});
			task.tags = await Promise.all(tags);

			const members = task.taskMembers.map(async memberRelation => {
				var member = await ProjectMember.findOne({ id: memberRelation.member }).populate('user').populate('role');
				member = { ...member.user, ...member.role };
				return member;
			});
			task.members = await Promise.all(members);
			
			const attachments=task.attachments.map(async (attachment)=>{
				var file=await File.findOne({id:attachment.file}).populate('user');
				file.files_id=attachment.file
				file.id=attachment.id;
				return file;
			});
			task.attachments = await Promise.all(attachments);
			return res.send(task);
		}
		return res.notFound();
	},
	create: async (req, res) => {
		try {
			let params = req.allParams();
			let attributes = {};
			if (params.title) attributes.title = params.title;
			if (params.description) attributes.description = params.description;
			if (params.start) attributes.start = params.start;
			if (params.end) attributes.end = params.end;
			if (params.label) attributes.label = params.label;
			if (params.listId) attributes.list = params.listId;
			if (params.list) attributes.list = params.list;
			if (params.progress) attributes.progress = params.progress;
			if (params.creator) attributes.creator = params.creator;
			if ('complete' in params) attributes.complete = params.complete;
			attributes.createdAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
			attributes.updatedAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

			let tags = params.tags;
			const insertedTask = await Task.create(attributes).fetch();
			await TaskMember.create({
				task:insertedTask.id,
				user:params.userId,
				member:params.projectMemberId
			}).fetch();

			if (tags) {
				for (var i = 0; i < tags.length; i++) {
					let paramsTag = tags[i];
					if (paramsTag.inputNewTag) {
						let newTag = {};
						newTag.title = paramsTag.inputNewTag;
						const insertedTag = await Tag.create(newTag).fetch();

						let newTagRelation = {};
						newTagRelation.task = insertedTask.id;
						newTagRelation.tag = insertedTag.id;
						await TasksHasTags.create(newTagRelation);
					} else {
						let newTagRelation = {};
						newTagRelation.task = insertedTask.id;
						newTagRelation.tag = paramsTag.id
						await TasksHasTags.create(newTagRelation);
					}
				}
			}
			return res.ok(insertedTask);
		}
		catch (err) {
			console.log(err);
			return res.serverError(err);
		}
	},
	update: async (req, res) => {
		try {
			let params = req.allParams();
			let attributes = {};
			if (params.title) attributes.title = params.title;
			if (params.description) attributes.description = params.description;
			if (params.start) attributes.start = params.start;
			if (params.end) attributes.end = params.end;
			if (params.label) attributes.label = params.label;
			if (params.list) attributes.list = params.listId;
			if (params.progress) attributes.progress = params.progress;
			if ('complete' in params) attributes.complete = params.complete;
			attributes.updatedAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

			var task = await Task.update({ id: params.id }).set(attributes).fetch();
			if (task) {
				let tasks = await Task.find({ id: params.id })
					.populate('taskMembers').populate('comments')
					.populate('logs').populate('checklists').populate('attachments').populate('tags');

				if (tasks.length > 0) {
					task = tasks[0];
					const newTags = task.tags.map(async tagRelation => {
						return await Tag.findOne({ id: tagRelation.tag });
					});
					task.tags = await Promise.all(newTags);
					return res.send(task);
				}
			};
			return res.send(result);
		} catch (err) {
			console.log('Catch Error : ', err);
			return res.serverError(err);
		}
	},
	delete: async (req, res) => {
		try {
			let params = req.allParams();
			const results = await Task.destroy({
				id: params.id
			});
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	},
	addChecklist: async (req, res) => {
		let params = req.allParams();
		let attributes = {};
		try {
			if (params.title) attributes.title = params.title;
			if (params.taskId) attributes.task = params.taskId;
			if (params.deadline) attributes.deadline = params.deadline;
			attributes.isChecked = false;
			const results = await Checklist.create(attributes).fetch();
			return res.send(results);
		} catch (error) {
			return res.serverError(error);
		}
	},
	removeChecklist: async (req, res) => {
		try {
			let params = req.allParams();
			let isExist = await Checklist.find().where({ id: params.checklistId, task: params.taskId });
			if (isExist.length > 0) {
				const result = await Checklist.destroy({
					id: params.id
				});
				return res.ok(result);
			} else {
				res.notFound()
			}
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	},
	updateChecklist: async (req, res) => {
		try {
			let params = req.allParams();
			let attributes = {};
			if (params.title) attributes.title = params.title;
			if (params.deadline) attributes.deadline = params.deadline;
			if (params.checklistId) attributes.id = params.checklistId;
			if ('isChecked' in params) attributes.isChecked = params.isChecked;

			let isExist = await Checklist.find().where({ id: params.checklistId, task: params.taskId });
			if (isExist.length > 0) {
				const results = await Checklist.update({ id: params.checklistId }).set(attributes);
				return res.send(results);
			} else {
				res.notFound()
			}
		} catch (err) {
			return res.serverError(err);
		}
	}
};

