/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var fetch = require("node-fetch");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const https = require('https');

module.exports = {
	find: async (req, res) => {
		try {
			let params = req.allParams();
			let users = null
			if ('keywords' in params) {
				users = await User.find().populate('asMember').where({
					or: [
						{ name: { contains: params.keywords } },
						{ email: { contains: params.keywords } }
					]
				});
			} else {
				users = await User.find().populate('asMember');
			}
			users = users.map(async function (user) {
				var occupation = await Occupation.find({ id: user.occupation });
				var project_ids = user.asMember.map(function (member) {
					return member.project;
				});
				var projects = await Project.find().where({ id: project_ids });

				if (occupation.length > 0) user.occupation = occupation[0];
				if (projects.length > 0) user.projects = projects;
				else user.projects = [];

				delete user.asMember;
				return user;
			});

			users = await Promise.all(users)
				.then(users)
				.catch((error) => {
					console.log('Promise.all() error : ', error);
				});
			return res.send(users);
		}
		catch (err) {
			console.log('UserController : ', err);
			return res.serverError(err);
		}
	},
	findOne: async (req, res) => {
		let params = req.allParams();
		try {
			if (params.id) {
				let users = await User.find({ id: params.id }).populate('occupation').populate('asMember');
				if (users.length > 0) return res.send(users[0]);
				return res.notFound();
			}
			return res.notFound();
		}
		catch (err) {
			return res.serverError(err);
		}
	},

	update: async (req, res) => {
		try {
			let params = req.allParams();
			let attributes = {};

			if (params.name) attributes.name = params.name;
			if (params.email) attributes.email = params.email;
			if (params.phone_number) attributes.phone_number = params.phone_number;
			if (params.token) attributes.token = params.token;
			if (params.occupation) attributes.occupation = params.occupation;
			if ('verified' in params) attributes.verified = params.verified;
			if (params.last_login) attributes.last_login = params.last_login;
			if (params.profile_picture_path) attributes.profile_picture_path = params.profile_picture_path;
			attributes.updatedAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
			await User.update({ id: params.id }).set(attributes);
			const results = await User.findOne().where({ id: params.id }).populate('occupation');
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	},
	delete: async (req, res) => {
		try {
			let params = req.allParams();
			await ProjectMember.destroy({ user: params.id })
			const results = await User.destroy({ id: params.id });
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	},
	register: function (req, res) {
		const params = req.allParams();
		const name = params.name;
		const password = params.password;
		const confirmation = params.confirmation;
		const email = params.email;
		const phoneNumber = params.phoneNumber;

		if (!password || !confirmation || password != confirmation) {
			return callback({ err: ["Password does not match confirmation"] });
		}
		var createdAt=moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
		var updatedAt=moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
		var last_login=moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
		
		let newUser = {
			name: name, password: password, email: email, profilePicturePath: '',
			phoneNumber: phoneNumber, verified: false, token: '', occupation: 1, last_login: last_login,
			createdAt:createdAt,updatedAt:updatedAt
		}

		User.find({ email: params.email }).exec(async function (err, users) {
			if (err) return res.negotiate(err);
			if (users.length) {
				res.status(409);
				return res.json('User already exists!');
			} else {
				await User.create(newUser).exec(function (err, user) {
					if (err) {
						var readableErr = '' + err;
						// return something the client will recognize and interpret
						// you can use http error codes, or your own conventions
						return res.serverError({
							success: false,
							message: readableErr
						});
					}
					return res.json({ success: true, ...user });
				});
			}
		});

	},
	login: async function (req, res) {
		const params = req.allParams();

		if (!params.email || !params.password) return res.badRequest({ err: "Email or password cannot be empty" });

		try {
			let user = await User.findOne({ email: params.email }).populate('asMember').populate('occupation')
			if (!user) return res.notFound({ err: 'Could not find email,' + params.email + ' sorry.' });
			bcrypt.compare(params.password, user.password, async function (err, result) {
				if (result) {
					let payload = user;
					const SECRET = 'galih56zoopreme56';
					delete user.password;
					var config = { expiresIn: 60 * 60 * 24 * 1000 };
					if (params.remember == true) config = {};

					await User.update({ id: user.id }, { last_login: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') }).fetch();
					jwt.sign(payload, SECRET, config, (err, token) => {
						const auth_data = { success: true, token: 'Bearer ' + token, user: user }
						req.session.user = user;
						return res.json(auth_data);
					});
				} else {
					return res.forbidden({ err: 'Email and password combination do not match' });
				}
			});
		} catch (err) {
			if (err) return res.serverError(err);
		}
	},
	logout: async function (req, res) {
		delete req.session.user;
		return res.ok();
	},
	getProjects: async function (req, res) {
		const params = req.allParams();
		const user_id = params.id;

		try {
			await ProjectMember.find().where({ 'user': user_id })
				.populate('project')
				.populate('role')
				.exec(async (error, result) => {
					if (error)  return res.serverError(error); 
					result = result.map(async (member) => {
						//get the tasks of a list
						let lists = await List.find().where({ project: member.project.id }).populate('tasks').sort('position ASC');

						lists = lists.map(list => {
							list.cards = list.tasks;
							delete list['tasks'];
							return list;
						})

						member.project.columns = lists;
						return member.project;
					});
					//handle promise from anonymous function within .map()
					var projects = await Promise.all(result)
						.then(result)
						.catch((error) => {
							console.log('Promise.all() error : ', error);
						});
					return res.send(projects);
				});
		}
		catch (error) {
			return res.serverError(error);
		}
	},
	createProject: async function (req, res) {
		let params = req.allParams();
		let users_id = params.users_id;
		
		var newProject = {
			title: params.title, description: params.description,
			estimationDeadline: params.estimationDeadline,
			createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
			updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
		}
		
		await Project.create(newProject)
			.fetch()
			.exec(async function (err, project) {
				if (err) return res.serverError(err);
				else {
					var newMember = {
						project: project.id,
						user: users_id,
						role: 2,
						createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
						updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
					}
					var newMember=await ProjectMember.create(newMember).fetch();
				}
				project.columns = [];
				return res.ok(project);
			});
	},
	getTasks: async function (req, res) {
		try {
			let params = req.allParams();
			var query=`
			SELECT t.id,t.title,t.complete,t.description,t.users_id,u.name as creator_name,u.email as creator_email
				,t.lists_id,l.title as lists_title,l.projects_id,p.title as projects_title
			FROM tasks AS t 
			INNER JOIN lists as l
				ON t.lists_id=l.id
			INNER JOIN projects as p
				ON p.id=l.projects_id
			INNER JOIN users as u
				ON t.users_id=u.id
			INNER JOIN (
							SELECT tasks_id,count(*) AS count
							FROM task_members AS tm 
							GROUP BY tasks_id
			) AS counter 
				ON t.id=counter.tasks_id
			WHERE counter.count>=1 OR t.users_id=$1`;
			let tasks = await Task.getDatastore().sendNativeQuery(query, [params.id]);
			tasks = tasks.rows;
			tasks=tasks.map(async function(item){
				var list=await List.findOne({id:item.lists_id});
				var project=await Project.findOne({id:item.projects_id});
				var user=await User.findOne({id:item.users_id});
				item.creator=user;
				item.project=project;
				item.list=list;
				return item;
			})
			tasks=await Promise.all(tasks)
			return res.send(tasks);
		}
		catch (err) {
			return res.serverError(err);
		}
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
				WHERE counter.count>=1 OR m.users_id=$1`;
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
	githubRedirect:async function (req,res){
		var params=req.allParams();
		return res.send(params);
	},
	sendVerificationMail: async function (req, res) {
		let newUser = {
			name: 'teshalo', password: 'password',
			email: 'teshalo@gmail.com', profilePicturePath: '',
			phoneNumber: '082230261945', verified: true,
			token: '', occupation: 1,
			last_login: '',
		}

		/*
		await jwt.sign(payload, SECRET, config, (err, token) => {
			const auth_data = {
				success: true,
				token: 'Bearer ' + token,
				user: user
			}
			req.session.user = user;
			User.update({ id: user.id }, { last_login: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') });
			return res.json(auth_data);
		});
		sails.hooks.email.send(
			"welcomeEmail",
			{
				Name: obj.name
			},
			{
				to: obj.email,
				subject: "Welcome Email"
			},
			function (err) { console.log(err || "Mail Sent!"); }
		);
		*/
	},

	verifyEmail: function (req, res) {
		let params = req.allParams();
		console.log('verify email', params);
	}
}