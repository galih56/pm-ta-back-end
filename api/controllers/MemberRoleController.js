/**
 * MemberRoleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 const moment = require('moment-timezone');
module.exports = {
	find: async (req,res)=>{
		try {
			let roles = await MemberRole.find();
	        return res.send(roles);
	    }
	    catch (err){
	      return res.serverError(err);
	    }
	},
    findOne: async (req, res) => {
    	let params=req.allParams();
    	try{
	        if (params.id) {
	            let roles = await MemberRole.find({ id: params.id });
	            if (roles > 0) {
	                return res.send(roles[0]);
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
	        let roles = await MemberRole.create({ 
			            	name: params.name, 
			            	color: params.color, 
			            	bgColor: params.bgColor,
			            }).fetch();
	      	return res.ok(roles);
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
			const results = await MemberRole.update({ id: params.id }, attributes).fetch();
			if(results){
				return res.json(results[0]);
			}
			return res.json(results);
		} catch (err) {
			return res.serverError(err);
		}
  	},
    delete: async (req, res)=>{
		try {
    		let params=req.allParams();
			const results = await MemberRole.destroy({
				id: params.id
			});
			return res.ok(results);
		} catch (err) {
			return res.serverError(err);
		}
	}
};

