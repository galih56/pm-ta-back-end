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
			let members = await ProjectMember.find();
			return res.send(members);
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	findOne: async (req, res) => {
		let params = req.allParams();
		try {
			if (params.id) {
				let members = await ProjectMember.find({ id: params.id }).populate('user').populate('role');
				if (members.length > 0) {
					var detailUser=members[0].user;
					delete detailUser.password;
					delete detailUser.token;
					var detailRole=members[0].role;
					var member={ id:members[0].id,user:detailUser, role:detailRole};
					return res.send(member);
				}
				return res.notFound();
			}
			return res.notFound();
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	getTasks : async function(req,res){
		try {
			let params = req.allParams();
			var query=`
				SELECT t.id,t.title,t.description, t.start,t.end,t.progress,t.complete,t.updated_at,t.created_at
				FROM public.project_members as pm
				INNER JOIN task_members as tm 
					ON  tm.project_members_id=pm.id
				INNER JOIN tasks as t
					ON tm.tasks_id=t.id
				WHERE pm.id=$1`;
			let tasks = await ProjectMember.getDatastore().sendNativeQuery(query, [params.id]);
			tasks = tasks.rows;
			return res.send(tasks);
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
			var insertedMemberIDs=insertedMembers.map(function(member){
				return member.id
			});
			insertedMembers=await ProjectMember.find({id: insertedMemberIDs }).populate('user').populate('role')
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
			if (params.role) attributes.role = params.role.id;
			attributes.updatedAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
			
			await ProjectMember.update({ id: params.id },attributes);
			let members = await ProjectMember.find({ id: params.id }).populate('user').populate('role');
			if (members.length > 0) {
				var detailUser=members[0].user;
				delete detailUser.password;
				delete detailUser.token;
				var detailRole=members[0].role;
				var member={ 
					id:members[0].id,
					user:detailUser, 
					role:detailRole
				};
				return res.send(member);
			}
			return res.notFound();
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