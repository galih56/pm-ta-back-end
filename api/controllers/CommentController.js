/**
 * CommentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment=require('moment-timezone');
module.exports = {
  	find: async (req,res)=>{
		try {
			let comments = await Comment.find();
	        return res.send(comments);
	    }
	    catch (err){
	      return res.serverError(err);
	    }
	},
    findOne: async (req, res) => {
    	let params=req.allParams();
    	try{
	        if (params.id) {
	            let comments = await Comment.find({ id: params.id });
	            if (comments.length > 0) {
	                return res.send(comments[0]);
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
	        let list = await Comment.create({ 
			            	title: params.title, 
			            	description: params.description, 
			            	tasks_id: params.tasks_id, 
			            	project_members_id: params.project_members_id, 
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
			if(params.project_members_id) attributes.project_members_id = params.project_members_id; 
			if(params.tasks_id) attributes.tasks_id = params.tasks_id; 

			const results = await Comment.update({id: params.id}, attributes, {updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')});
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
  	},
	delete: async (req, res)=>{
		try {
			let params = req.allParams();
			const results = await Comment.destroy({
				id: params.id
			});
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	}
};

