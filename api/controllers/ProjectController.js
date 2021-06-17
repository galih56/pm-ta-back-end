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
			var params =req.allParams();
			let projects = await Project.find().populate('members').populate('lists');
			let newProjects = [];
			if (projects.length > 0) {
				for (let i = 0; i < projects.length; i++) {
					const projectDetail = projects[i];
					var newLists = projectDetail.lists.map(async (list) => {
						// Async function always return promise
						// .map() has no concept of asynchronicity
						// https://stackoverflow.com/questions/47557128/why-does-async-array-map-return-promises-instead-of-values
						// https://stackoverflow.com/questions/39452083/using-promise-function-inside-javascript-array-map
						var tasks = await Task.find().populate('tags')
											.populate('creator')
											.populate('childrenTasks')
											.where({ list: list.id });
											
						tasks = tasks.map(async task => {
							task.cards=task.childrenTasks;
							delete task.childrenTasks;
							var newTags = task.tags.map(async tagRelation => await Tag.findOne({ id: tagRelation.tag }));
							task.tags = await Promise.all(newTags);
							return task;
						});
						tasks = await Promise.all(tasks);
						Object.assign(list, { cards: tasks });
						delete list.tasks;
						list.id = '' + list.id; //Change number to string, required for kanban view
						return list;
					});
					//handle promise from anonymous function within .map()
					newLists = await Promise.all(newLists);
					//change property name lists to columns for kanban/gantt rendering purpose
					Object.assign(projectDetail, { columns: newLists });
					delete projectDetail['lists'];

					let members = await ProjectMember.find({ project: projectDetail.id })
														.populate('role')
														.populate('user');
					members = members.map((member) => {
						delete member.user.password
						member =  { project_member_id: member.id, ...member.user, role:member.role };
						return member;
					});
					projectDetail.members = members;
					newProjects.push(projectDetail);
				}
			}
			projects = newProjects;
			return res.send(projects);
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	findOne: async (req, res) => {
		let params = req.allParams();
		try {
			let projects = await Project.find({ id: params.id }).populate('lists');
			if (projects.length > 0) {
				var projectDetail = projects[0];
				var query=` SELECT * FROM meetings WHERE projects_id=$1`;
				let meetings = await Meeting.getDatastore().sendNativeQuery(query, [params.id]);
				projectDetail.meetings=meetings.rows;
				if (projectDetail.lists.length > 0) {
					var newLists = projectDetail.lists.map(async (list) => {
						// Async function always return promise
						// .map() has no concept of asynchronicity
						// https://stackoverflow.com/questions/47557128/why-does-async-array-map-return-promises-instead-of-values
						// https://stackoverflow.com/questions/39452083/using-promise-function-inside-javascript-array-map
						var tasks = await Task.find().populate('tags')
											.populate('creator')
											.populate('childrenTasks')
											.where({ list: list.id });
											
						tasks = tasks.map(async task => {
							task.cards=task.childrenTasks;
							delete task.childrenTasks;
							var newTags = task.tags.map(async tagRelation => await Tag.findOne({ id: tagRelation.tag }));
							task.tags = await Promise.all(newTags);
							return task;
						});
						tasks = await Promise.all(tasks);
						Object.assign(list, { cards: tasks });
						delete list.tasks;
						list.id = '' + list.id; //Change number to string, required for kanban view
						return list;
					});
					//handle promise from anonymous function within .map()
					newLists = await Promise.all(newLists);
					//change property name lists to columns for kanban/gantt rendering purpose
					Object.assign(projectDetail, { columns: newLists });
					delete projectDetail['lists'];

					let members = await ProjectMember.find({ project: projectDetail.id })
														.populate('role')
														.populate('user');
					members = members.map((member) => {
						delete member.user.password
						member =  { project_member_id: member.id, ...member.user, role:member.role };
						return member;
					});
					projectDetail.members = members;
					return res.send(projectDetail);
				} else {
					Object.assign(projectDetail, { columns: [] });
					delete projectDetail['lists'];
					
					let members = await ProjectMember.find({ project: projectDetail.id })
														.populate('role')
														.populate('user');
					members = members.map((member) => {
						delete member.user.password
						member =  { project_member_id: member.id, ...member.user, role:member.role };
						return member;
					});
					projectDetail.members = members;
					return res.send(projectDetail);
				}
			}
			return res.notFound();
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	create: async (req, res) => {
		let params = req.allParams();
		var attributes={};
		if(params.title) attributes.title=params.title;
		if(params.description) attributes.description=params.description;
		if(params.start) attributes.start=params.start;
		if(params.end) attributes.end=params.end;
		if(params.project_owner) attributes.project_owner=params.project_owner;
		if(params.project_manager) attributes.project_manager=params.project_manager;
		attributes.createdAt=moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
		attributes.updatedAt=moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
		
		try {
			let project = await Project.create(attributes).fetch();
			var insertedMember=[];
			if(params.project_owner){
				var project_owner=params.project_owner;
				project_owner=project_owner.map(async user => {
					var projectMember=null;
					if(typeof user == 'object'){
						projectMember=await ProjectMember.create({project:project.id,user:user.id,role:1}).fetch()
					}else{
						projectMember=await ProjectMember.create({project:project.id,user:user,role:1}).fetch()
					}
					insertedMember.push(projectMember);
				});
				project.members=insertedMember;
			}
			if(params.project_manager){
				var project_manager=params.project_manager;
				var insertedMember=[];
				project_manager=project_manager.map(async user => {
					var projectMember=null;
					if(typeof user == 'object'){
						projectMember=await ProjectMember.create({project:project.id,user:user.id,role:2}).fetch()
					}else{
						projectMember=await ProjectMember.create({project:project.id,user:user,role:2}).fetch()
					}
					insertedMember.push(projectMember);
				});
				project.members=insertedMember;
			}
			return res.ok(project);
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
			if (params.description) attributes.description = params.description;
			if (params.actualStart) attributes.actualStart = params.actualStart;
			if (params.actualEnd) attributes.actualEnd = params.actualEnd;
			if (params.start) attributes.start = params.start;
			if (params.end) attributes.end = params.end;
			
			attributes.updatedAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
			const results = await Project.update({ id: params.id }, attributes).fetch();
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	},
	delete: async (req, res) => {
		let params = req.allParams();
		try {
			await ProjectMember.destroy({ project: params.id });
			await List.destroy({ project: params.id });
			await Meeting.destroy({ project: params.id });
			
			const results = await Project.destroy({
				id: params.id
			});
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	},
	getMembers: async (req, res) => {
		let params = req.allParams();
		if (params.id) {
			let members = await ProjectMember.find({ project: params.id }).populate('role').populate('user');
			members = members.map((member) => {
				member = { ...member.user, role: { ...member.role } };
				return member;
			});
			return res.send(members);
		}
		return res.notFound();
	},
	getLists: async (req, res) => {
		let params = req.allParams();
		if (params.id) {
			let lists = await List.find({ project: params.id });
			return res.send(lists[0]);
		}
		return res.notFound();
	},
	getMeetings : async function(req,res){
		try {
			let params = req.allParams();
			var query=`
				SELECT m.*
				FROM meetings AS m
				INNER JOIN users as u
					ON m.users_id=u.id
				INNER JOIN (
							SELECT meetings_id,count(*) AS count
							FROM meeting_members AS tm 
							GROUP BY meetings_id
				) AS counter 
					ON m.id=counter.meetings_id
				WHERE counter.count>=1 OR m.projects_id=$1`;
			let meeting = await Meeting.getDatastore().sendNativeQuery(query, [params.id]);
			meeting = meeting.rows;
			meeting=meeting.map(async function(item){
				var user=await User.findOne({id:item.users_id});
				var members=await MeetingMember.find({id:item.users_id});
				item.creator=user;
				item.members=members;
				return item;
			})
			meeting=await Promise.all(meeting)
			return res.send(meeting);
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	getFiles: async (req, res) => {
		try {
			let params = req.allParams();
			if (params.id) {
				var files = await TaskAttachment.getDatastore().sendNativeQuery(`
				SELECT f.id, f.name AS file_name, f.type, f.path, f.size, 
					t.id as tasks_id, f.users_id, f.updated_at, f.created_at, 
					t.title AS task_title,t.actual_start,t.actual_end, t.start,t.end,f.source, f.icon, 
					p.id as projects_id, p.title as project_title, u.name AS user_name,u.email,
					l.id AS lists_id, l.title as list_title
				FROM public.task_attachments AS ta
				INNER JOIN files as f ON f.id=ta.files_id
				INNER JOIN users as u ON u.id=f.users_id
				INNER JOIN tasks as t ON t.id=ta.tasks_id
				INNER JOIN lists as l ON l.id=t.lists_id
				INNER JOIN projects as p ON l.projects_id=p.id WHERE projects_id=$1`, [params.id]);
				return res.ok(files.rows);
			}
			return res.notFound();
		}
		catch (err) {
			return res.serverError(err);
		}
	},
};



