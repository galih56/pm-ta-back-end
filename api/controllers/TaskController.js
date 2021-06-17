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
			let tasks = await Task.find()
									.populate('creator')
									.populate('taskMembers')
									.populate('childrenTasks');
			tasks=tasks.map(function(task){
				task.cards=task.childrenTasks;
				delete task.childrenTasks;
				return task;
			})
			return res.send(tasks);
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	findOne: async (req, res) => {
		try{
			let params = req.allParams();
			let tasks = await Task.find({ id: params.id })
									.populate('creator')
									.populate('childrenTasks')
									.populate('taskMembers').populate('comments')
									.populate('logs')
									.populate('list')
									.populate('attachments').populate('tags');

			if (tasks.length > 0) {
				var task = tasks[0];
				
				task.cards=task.childrenTasks;
				delete task.childrenTasks;
				
				const tags = task.tags.map(async tagRelation => {
					return await Tag.findOne({ id: tagRelation.tag });
				});
				task.tags = await Promise.all(tags);
				
				const members = task.taskMembers.map(async memberRelation => {
					var member = await ProjectMember.findOne({ id: memberRelation.member })
														.populate('user').populate('role');
					if(task.creator.id==member.user.id) member.role.creator=true;else member.role.creator=false;
					member = { 
						project_member_id:member.id,
						task_member_id:memberRelation.id,
						...member.user, 
						role:member.role 
					};
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

		}catch(err){
			return res.serverError(err)
		}
	},
	create: async (req, res) => {
		try {
			let params = req.allParams();
			let attributes = {};

			if (params.title) attributes.title = params.title;
			if (params.description) attributes.description = params.description;
			if (params.start) attributes.start = params.start;
			if (params.end) attributes.end = params.end;
			if (params.actualStart) attributes.actualStart = params.actualStart;
			if (params.actualEnd) attributes.actualEnd = params.actualEnd;
			if (params.label) attributes.label = params.label;
			if (params.listId) attributes.list = params.listId;
			if (params.list) attributes.list = params.list;
			if ('isSubtask' in params) attributes.isSubtask = params.isSubtask;
			if (params.progress) attributes.progress = params.progress;
			if (params.creator) attributes.creator = params.creator;
			if (params.members) attributes.members = params.members;
			if (params.parentTask) attributes.parentTask = params.parentTask;
			
			if ('complete' in params) attributes.complete = params.complete;
			attributes.createdAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
			attributes.updatedAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
			
			attributes.startLabel='Belum dilaksanakan';
			attributes.endLabel='Belum selesai';
			if(attributes.complete==true || attributes.progress>=100) {
				attributes.startLabel='Mulai tepat waktu';
				attributes.endLabel='Selesai tepat waktu';
			}
			console.log(params);
			// var projectmembers=await ProjectMember.find({project:params.projectId,user:params.creator})
			// if(projectmembers.length){
			// 	var projectmember=projectmembers[0];
				let tags = params.tags;
				const insertedTask = await Task.create(attributes).fetch();
				// await TaskMember.create({
				// 	task:insertedTask.id,
				// 	user:params.userId,
				// 	member:projectmember.id
				// })
					
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
				
				if('members' in params){
					params.members.forEach(async member => {
						if(params.userId!=member.user.id){
							var newTaskMember =await TaskMember.create({
								task:insertedTask.id,
								user:member.user.id,
								member:member.id
							})
						}
					});
				}
				return res.ok(insertedTask);
			// }
			// return res.notFound();
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
			if (params.actualStart) attributes.actualStart = params.actualStart;
			if (params.actualEnd) attributes.actualEnd = params.actualEnd;
			if (params.listId) attributes.list = params.listId;
			if (params.list) attributes.list = params.list;
			if (params.progress) attributes.progress = params.progress;
			if (params.actualStart) attributes.actualStart = params.actualStart;
			if (params.actualEnd) attributes.actualEnd = params.actualEnd;
			if (params.parentTask) {
				attributes.parentTask = params.parentTask;
				if(typeof params.parentTask=='object') attributes.parentTask=params.parentTask.id; 
			}
			if ('complete' in params) attributes.complete = params.complete;
			attributes.updatedAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

			if(attributes.actualStart){
				var start = moment(attributes.start, "YYYY-MM-DD");
				var actualStart = moment(attributes.actualStart, "YYYY-MM-DD");
	
				var timeDiff=moment.duration(start.diff(actualStart)).asDays();
				var label='';
				if(timeDiff<0) label='Mulai terlambat';
				if(timeDiff>0) label='Mulai lebih cepat';
				if(timeDiff===0) label='Mulai tepat waktu';
				attributes.startLabel=label;
			}

			if(attributes.actualEnd){
				var end = moment(attributes.end, "YYYY-MM-DD");
				var actualEnd = moment(attributes.actualEnd, "YYYY-MM-DD");
	
				var timeDiff=moment.duration(end.diff(actualEnd)).asDays();
				var label='';
				if(timeDiff<0) label='Selesai terlambat';
				if(timeDiff>0) label='Selesai lebih cepat';
				if(timeDiff===0) label='Selesai tepat waktu';
				attributes.endLabel=label;
			}
			if(attributes.actualStart && !attributes.actualEnd){
				attributes.endLabel='Belum selesai';
			}
			var task = await Task.update({ id: params.id }).set(attributes).fetch();
			if (task) {
				let tasks = await Task.find({ id: params.id })
									.populate('creator')
									.populate('childrenTasks')
									.populate('taskMembers').populate('comments')
									.populate('logs')
									.populate('attachments').populate('tags');

				if (tasks.length > 0) {
					var task = tasks[0];
					
					task.cards=task.childrenTasks;
					delete task.childrenTasks;
					
					const tags = task.tags.map(async tagRelation => {
						return await Tag.findOne({ id: tagRelation.tag });
					});
					task.tags = await Promise.all(tags);
					
					const members = task.taskMembers.map(async memberRelation => {
						var member = await ProjectMember.findOne({ id: memberRelation.member })
															.populate('user').populate('role');
						if(task.creator.id==member.user.id) member.role.creator=true;else member.role.creator=false;
						member = { 
							project_member_id:member.id,
							task_member_id:memberRelation.id,
							...member.user, 
							role:member.role 
						};
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
};
