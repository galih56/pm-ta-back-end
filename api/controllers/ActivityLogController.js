/**
 * ActivityLogController
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
    	try{
	        if (params.id) {
	            let tasks = await Task.find({ id: params.id });
	            if (tasks.length > 0) {
	                return res.send(tasks[0]);
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
		try {
    		let params=req.allParams();
	        let list = await Task.create({ 
			            	title: params.title, 
			            	description: params.description, 
			            	lists_id: params.lists_id, 
			            	due_on: params.due_on, 
			            	labels_id: params.labels_id, 
			            	checklists: params.checklists, 
			            	createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
			            	updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
			            });
	      	return res.ok(list);
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
			if(params.due_on) attributes.due_on = params.due_on; 
			if(params.labels_id) attributes.labels_id = params.labels_id; 
			if(params.checklists) attributes.checklists = params.checklists; 

			const results = await Task.update({id: params.id}, attributes, {updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')});
			return res.ok(results);
		} catch (err) {
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
	}
};

