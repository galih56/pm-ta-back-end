/**
 * TaskController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment=require('moment-timezone');
module.exports = {
	find: async (req,res)=>{
		try {
			let tasks = await Task.find();
	        return res.send(tasks);
	    }
	    catch (err){
	      return res.serverError(err);
	    }
	},
    findOne: async (req, res) => {
    	let params=req.allParams();
		try {
	        if (params.id) {
	            let tasks = await Task.find({ id: params.id })
	            						.populate('taskMembers').populate('comments')
	            						.populate('logs').populate('checklists').populate('attachments').populate('tags');
	            tasks=tasks.map(async task=>{
	            			const newTags=task.tags.map(async tagRelation=>{
					            				return await Tag.findOne({id: tagRelation.tag});
					            			});
	            			task.tags=await Promise.all(newTags);
	            			return task;
	            		})
	            tasks=await Promise.all(tasks);
	            if (tasks.length > 0) {
	            	var task=tasks[0];
	                return res.send(task);
	            }
    			return res.notFound();
	        }
    		return res.notFound();
        }
	    catch (err){
	    	console.log(err)
	      	return res.serverError(err);
	    }
    },
    create: async (req, res) => {
		try {
    		let params=req.allParams();
    		console.log('Parmas : ',params);
    		let attributes={};
			if(params.title) attributes.title = params.title;
			if(params.description) attributes.description = params.description; 
			if(params.start) attributes.start = params.start; 
			if(params.end) attributes.end = params.end; 
			if(params.label) attributes.label = params.label; 
			if(params.listId) attributes.list = params.listId; 
			if(params.list) attributes.list = params.list; 
			if(params.progress) attributes.progress = params.progress; 
			if(params.complete) attributes.complete = params.complete;else attributes.complete=false;
			attributes.createdAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'); 
			attributes.updatedAt =  moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'); 

			let tags=params.tags;			
			const insertedTask=await Task.create(attributes).fetch();
			if(tags){
				for (var i = 0; i < tags.length; i++) {
					let paramsTag=tags[i];
					if(paramsTag.inputNewTag){
						let newTag={};
						newTag.title=paramsTag.inputNewTag;
						const insertedTag=await Tag.create(newTag).fetch();

						let newTagRelation={};
						newTagRelation.task=insertedTask.id;
						newTagRelation.tag=insertedTag.id;
						await TasksHasTags.create(newTagRelation);
					}else{
						let newTagRelation={};
						newTagRelation.task=insertedTask.id;
						newTagRelation.tag=paramsTag.id
						await TasksHasTags.create(newTagRelation);
					}
				}
			}
			return res.ok(insertedTask);
	    }
	    catch (err){
	    	console.log(err);
	    	return res.serverError(err);
	    }
    },
    update:async (req, res)=>{
		try {
			let params = req.allParams();
			let attributes = {};
			if(params.title) attributes.title = params.title;
			if(params.description) attributes.description = params.description; 
			if(params.start) attributes.start = params.start; 
			if(params.end) attributes.end = params.end; 
			if(params.label) attributes.label = params.label; 
			if(params.complete!==undefined) attributes.complete = params.complete; 
			if(params.list) attributes.list = params.listId; 
			if(params.progress) attributes.progress = params.progress; 
			attributes.updatedAt=moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

			const result=await Task.update({id: params.id}).set(attributes).fetch();
			return res.send(result);
		} catch (err) {
			console.log('Catch Error : ',err);
			return res.serverError(err);
		}
  	},
	delete: async (req, res)=>{
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
	addChecklist: async (req,res)=>{
		let params = req.allParams();
		let attributes = {};
		try{
			attributes.title = params.title;
			attributes.isChecked=false;
			attributes.task=params.taskId;
			const results = await Checklist.create(attributes)
											.exec(async function(err, checklist){
												if(err) {
													return res.send(err);
												}
												Object.assign(checklist,{taskId:checklist,task})
												delete checklist['task'];
												return res.ok(checklist);
									        });
			console.log(results);
			return res.ok(results);
		}catch(error){
			console.log(error);
			return res.serverError(error);
		}
	},
	removeChecklist: async (req,res)=>{
		try {
			let params = req.allParams();
			let isExist = await Checklist.find().where({ id: params.checklistId,task:params.taskId });
			console.log('Exist : ',isExist);
			if(isExist.length>0){
				const result = await Checklist.destroy({
					id: params.id
				});
				return res.ok(result);
			}else{
				res.notFound()
			}
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	},
	updateChecklist:async (req,res)=>{
		try {
			let params = req.allParams();
			let isExist = await Checklist.find().where({ id: params.checklistId,task:params.taskId });
			if(isExist.length>0){
				const results = await Checklist.update({id: params.checklistId}, {isChecked:params.isChecked});
				return res.send(results);
			}else{
				res.notFound()
			}
		} catch (err) {
			return res.serverError(err);
		}
	}
};

