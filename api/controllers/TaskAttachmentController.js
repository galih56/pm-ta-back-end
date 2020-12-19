/**
 * TaskController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment=require('moment-timezone');
const fs = require('fs');

module.exports = {
	find: async (req,res)=>{
		try {
			let files = await TaskAttachment.find().populate('user').populate('task');
	        return res.send(files);
	    }
	    catch (err){
	      return res.serverError(err);
	    }
	},
    findOne: async (req, res) => {
    	let params=req.allParams();
		try {
	        if (params.id) {
	            let files = await TaskAttachment.find({ id: params.id }).populate('user').populate('task');
	            if (files.length > 0) {
	            	var task=files[0];
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
    	let params=req.allParams();
    	if(!params.userId) res.serverError('userId not found'); 
    	if(!params.taskId) res.serverError('taskId not found');

		var dbRecords=[];
		return await req.file('files').upload({
		    // don't allow the total upload size to exceed ~50MB
		    maxBytes: 100000000,
		    dirname: `../../assets/tasks/${params.taskId}/attachments/`
		  }, async (err, uploadedFiles)=>{
		    if (err)  return res.serverError(err); 

		    // If no files were uploaded, respond with an error.
		    if (uploadedFiles.length === 0) return res.badRequest('No file was uploaded'); 

		    try{
			    for (var i = 0; i < uploadedFiles.length; i++) {
			    	var currentPath=uploadedFiles[i].fd.split('\\');
			    	const uploadedFileName=currentPath[currentPath.length-1];
			    	const originalFilename=uploadedFiles[i].filename;
			    	const type=uploadedFiles[i].type;
			    	const size=uploadedFiles[i].size;
			    	const path=`tasks/${params.taskId}/attachments/`+uploadedFileName;
			    	
			    	//Save metadata into db
				    const attachment=await TaskAttachment.create({
				    	name:uploadedFiles[i].filename,
				    	size:size,
				    	type:type,
				    	path:path,
				    	user:params.userId,
				    	task:params.taskId,
				    	source:'upload',
				    	createdAt:moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
				    	updatedAt:moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
				    }).fetch();
				    dbRecords.push(attachment);
			    }
		    }catch(error){
		    	console.log(error)
		    	res.serverError(error);
		    }
		    return res.ok(dbRecords);
		  });
    },
	delete: async (req, res)=>{
		try {
			let params = req.allParams();
			let files = await TaskAttachment.find({ id: params.id });
            if (files.length > 0) {
            	var file=files[0];
            	console.log('Unlink : ',`${sails.config.appPath}/assets/${file.path}`);
            	const dir=`${sails.config.appPath}/assets/${file.path}`
				await fs.unlink(dir, (error) => {
					if (error) {
						console.log('Unlink Error : ',error);
						throw error
					}
				  	console.log('successfully deleted : '+`${sails.config.appPath}/assets/${file.path}`);
				});
            	await TaskAttachment.destroy({ id: params.id });
                return res.ok(params.id);
            }
		} catch (error) {
			return res.serverError(error);
		}
	},
};