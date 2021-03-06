/**
 * TaskController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment = require('moment-timezone');
const fs = require('fs');

module.exports = {
	find: async (req, res) => {
		try {
			var files = await File.getDatastore().sendNativeQuery(`
			SELECT f.id as files_id, f.name, 
					f.type, f.size, f.icon, 
					f.path, f.tasks_id, f.users_id,
					ta.*, u.*
				FROM files as f
			INNER JOIN task_attachments as ta
				ON f.id=ta.files_id
			INNER JOIN task as t
				ON t.id=ta.tasks_id
			INNER JOIN users as u
				ON f.users_id=u.id
			`, []);

			return res.send(files.rows);
		}
		catch (err) {
			return res.serverError(err);
		}
	},
	findOne: async (req, res) => {
		let params = req.allParams();
		try {
			if (params.id) {
				var files = await File.getDatastore().sendNativeQuery(`
					SELECT f.id as files_id, f.name, 
							f.type, f.size, f.icon, 
							f.path, f.tasks_id, f.users_id,
							ta.*, u.*
						FROM files as f
					INNER JOIN task_attachments as ta
						ON f.id=ta.files_id
					INNER JOIN task as t
						ON t.id=ta.tasks_id
					INNER JOIN users as u
						ON f.users_id=u.id
					WHERE pm.users_id =  $1 
					`, [params.id]);
					
				if (files.rows.length > 0) {
					var file = files.rows[0];
					return res.send(file);
				}
				return res.notFound();
			}
			return res.notFound();
		}
		catch (err) {
			console.log(err)
			return res.serverError(err);
		}
	},
	create: async (req, res) => {
		let params = req.allParams();
		let errors = false;
		if (!params.userId || !params.taskId || !params.source) {
			errors = true;
			var str_errors = '';
			if (!params.userId) str_errors += ' userId';
			if (!params.taskId) str_errors += ' taskId';
			if (!params.source) str_errors += ' source';
			return res.serverError('Missing parameters : ' + str_errors);
		}
		if (!errors) {
			if (params.source == 'upload') {
				var dbRecords = [];
				if(params.files){
					for (let i = 0; i < params.files.length; i++) {
						var file = params.files[i];

						file = await File.create({
							name: file.name, size: file.size,
							type: file.type, path: file.path, user: params.userId,
							base64:file.base64,
							source: 'upload',
							createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
							updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
						}).fetch();

						const task_attachment=await TaskAttachment.create({
							file:file.id,
							task:params.taskId
						}).fetch();
						
						dbRecords.push({
							id:task_attachment.id,
							...file
						});
					}
					return res.ok(dbRecords);
				}
			}
			
			if (params.source == 'pick') {
				var dbRecords = [];
				const task_attachment=await TaskAttachment.create({
					file:params.fileId, task:params.taskId
				}).fetch();
				
				const file = await File.findOne({id:params.fileId});

				dbRecords.push({
					id:task_attachment.id, ...file
				});
				return res.ok(dbRecords);
			}
			
			if (params.source == 'google-drive') {
				let dbRecords = [];
				if (params.files.length === 0) return res.badRequest('No file was choosen');
				var files = params.files;
				for (let i = 0; i < files.length; i++) {
					var file = files[i];
					
					file = await File.create({
						name: file.name, size: file.sizeBytes,
						type: file.mimeType, path: file.url,
						user: params.userId, icon: file.iconUrl,  
						source: 'google-drive',
						createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
						updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
					}).fetch();

					const task_attachment=await TaskAttachment.create({
						file:file.id, task:params.taskId
					}).fetch();
					
					dbRecords.push({
						id:task_attachment.id, ...file
					});
				}
				return res.ok(dbRecords);
			}
		}
	},
	delete: async (req, res) => {
		try {
			let params = req.allParams();
			await TaskAttachment.destroy({ id: params.id });
		} catch (error) {
			return res.serverError(error);
		}
	},
};


/*
				await req.file('files').upload({
					maxBytes: 100000000,
					dirname: `../../assets/tasks/${params.taskId}/`
				}, async (err, uploadedFiles) => {
					var dbRecords = [];
					if (err) return res.serverError(err);

					if (uploadedFiles.length === 0) return res.badRequest('No file was uploaded');

					for (var i = 0; i < uploadedFiles.length; i++) {
						var currentPath = uploadedFiles[i].fd.split('\\');
						const uploadedFileName = currentPath[currentPath.length - 1];
						const type = uploadedFiles[i].type;
						const size = uploadedFiles[i].size;
						const path = `tasks/${params.taskId}/` + uploadedFileName;

						const file = await File.create({
							name: uploadedFiles[i].filename, size: size,
							type: type, path: path, user: params.userId,
							source: 'upload',
							createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
							updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
						}).fetch();

						const task_attachment=await TaskAttachment.create({
							file:file.id,
							task:params.taskId
						}).fetch();
						
						dbRecords.push({
							id:task_attachment.id,
							...file
						});
					}
					return res.ok(dbRecords);
				});
					*/
			