/**
 * TagController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment=require('moment-timezone');
module.exports = {
	find: async (req,res)=>{
		try {
			let tags = await Tag.find();
	        return res.send(tags);
	    }
	    catch (err){
	    	console.log(err);
	      	return res.serverError(err);
	    }
	},
    findOne: async (req, res) => {
    	let params=req.allParams();
    	try{
	        if (params.id) {
	            let tags = await Tag.find({ id: params.id });
	            if (tags.length > 0) {
	                return res.send(tags[0]);
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
    		let attributes={};
			if(params.name) attributes.name = params.name;
			if(params.color) attributes.color = params.color; 
			if(params.bgColor) attributes.bgColor = params.bgColor; 

	        let tag = await Tag.create(attributes);
	      	return res.ok(tag);
	    }
	    catch (err){
	    	return res.serverError(err);
	    }
    },
    update:async (req, res)=>{
		try {
			let params = req.allParams();
			let attributes = {};
			if(params.name) attributes.name = params.name;
			if(params.color) attributes.color = params.color; 
			if(params.bgColor) attributes.bgColor = params.bgColor; 

			const results = await Tag.update({id: params.id}, attributes);
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
  	},
	delete: async (req, res)=>{
		try {
			let params = req.allParams();
			const results = await Tag.destroy({
				id: params.id
			});
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	},
};

