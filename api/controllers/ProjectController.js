/**
 * ProjectsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const moment=require('moment-timezone');

module.exports = {
	find: async (req,res)=>{
		try {
			let projects = await Project.find();
	        return res.send(projects);
	    }
	    catch (err){
	      return res.serverError(err);
	    }
	},
    findOne: async (req, res) => {
    	let params=req.allParams();
    	try{
	        if (params.id) {
	            let projects = await Project.find({ id: params.id }).populate('lists');
	            if (projects.length > 0) {
	            	var projectDetail=projects[0];
	            	if(projectDetail.lists.length>0){
	            		var newLists = projectDetail.lists.map(async (list) =>{ 
	        								// Async function always return promise
	        								// .map() has no concept of asynchronicity
	        								// https://stackoverflow.com/questions/47557128/why-does-async-array-map-return-promises-instead-of-values
	        								// https://stackoverflow.com/questions/39452083/using-promise-function-inside-javascript-array-map
					            			var tasks = await Task.find().populate('tags').where({ list: list.id });
					            			tasks=tasks.map(async task=>{
								            			var newTags=task.tags.map( async tagRelation => await Tag.findOne({id: tagRelation.tag}));
								            			task.tags=await Promise.all(newTags);
								            			return task;
								            		})
								            tasks=await Promise.all(tasks);
					            			Object.assign(list,{ cards : tasks });
					            			delete list.tasks;
					            			list.id=''+list.id; //Change number to string, required for kanban view
					            			return list;
	            		 				});
	            		//handle promise from anonymous function within .map()
	            		newLists =await Promise.all(newLists);
	        			//change property name lists to columns for kanban/gantt rendering purpose
	        			Object.assign(projectDetail,{columns:newLists});
	        			delete projectDetail['lists'];
	            		return res.send(projectDetail);
	            	}else{
		    			Object.assign(projectDetail,{columns:[]});
		    			delete projectDetail['lists'];
		                return res.send(projectDetail);
	            	}
	            }
    			return res.notFound();
	        }
    		return res.notFound();
        }
	    catch (err){
	      return res.serverError(err);
	    }
    },
    create: async (req, res) => {
    	let params=req.allParams();
		try {
	        let project = await Project.create({ 
			            	title: params.title, 
			            	description: params.description, 
			            	estimationDeadline: params.estimationDeadline, 
			            	createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
			            	updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
			            }).fetch();
	      	return res.ok(project);
	    }
	    catch (err){
	    	return res.serverError(err);
	    }
    },
    update:async (req, res)=>{
		try {
			let params = req.allParams();
			let attributes = {};
			
			if(params.title) attributes.title = params.title;
			if(params.description) attributes.description = params.description; 
			if(params.estimationDeadline) attributes.estimationDeadline = params.estimationDeadline; 
			attributes.updatedAt=moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
			const results = await Project.update({id: params.id}, attributes);
			return res.ok();
		} catch (err) {
			return res.serverError(err);
		}
  	},
	delete: async (req, res)=>{
    	let params=req.allParams();
		try {
			await ProjectMember.destroy({project:params.id});
			await List.destroy({project:params.id});
			const results = await Project.destroy({
				id: params.id
			});
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	},
	getListsBasedOnProject:async(req,res)=>{
		let params=req.allParams();
        if (params.projectId) {
            let lists = await List.find({ projects_id: params.projectId });
            return res.send(lists[0]);
        }
        return res.notFound();
	}
};



