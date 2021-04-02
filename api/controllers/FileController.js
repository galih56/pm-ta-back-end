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
             let files = await File.find().populate('user');
             return res.send(files);
         }
         catch (err) {
             return res.serverError(err);
         }
     },
     findOne: async (req, res) => {
         let params = req.allParams();
         try {
            let file = await File.findOne({ id: params.id }).populate('user');
            if (file) {
                return res.send(file);
            }
            return res.notFound();
         }
         catch (err) {
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
             try {
                 let dbRecords = [];
                 if (params.source == 'upload') {
                     await req.file('files').upload({
                         // don't allow the total upload size to exceed ~100MB
                         maxBytes: 100000000,
                         dirname: `../../assets/images/tasks/${params.taskId}/attachments/`
                     }, async (err, uploadedFiles) => {
                         if (err) return res.serverError(err);
 
                         // If no files were uploaded, respond with an error.
                         if (uploadedFiles.length === 0) return res.badRequest('No file was uploaded');
 
                         for (var i = 0; i < uploadedFiles.length; i++) {
                             var currentPath = uploadedFiles[i].fd.split('\\');
                             const uploadedFileName = currentPath[currentPath.length - 1];
                             const originalFilename = uploadedFiles[i].filename;
                             const type = uploadedFiles[i].type;
                             const size = uploadedFiles[i].size;
                             const path = `images/tasks/${params.taskId}/attachments/` + uploadedFileName;
 
                             const attachment = await File.create({
                                 name: uploadedFiles[i].filename,
                                 size: size,
                                 type: type,
                                 path: path,
                                 user: params.userId,
                                 task: params.taskId,
                                 source: 'upload',
                                 createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
                                 updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
                             }).fetch();
                             dbRecords.push(attachment);
                         }
                         return res.ok(dbRecords);
                     });
                 }
 
                 if (params.source == 'google-drive') {
                     if (params.files.length === 0) return res.badRequest('No file was choosen');
                     var files = params.files;
                     for (let i = 0; i < files.length; i++) {
                         const file = files[i];
                         const attachment = await File.create({
                             name: file.name,
                             size: file.sizeBytes,
                             type: file.mimeType,
                             path: file.url,
                             user: params.userId,
                             task: params.taskId,
                             icon: file.iconUrl,
                             source: 'google-drive',
                             createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
                             updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
                         }).fetch();
                         dbRecords.push(attachment);
                     }
                     return res.ok(dbRecords);
                 }
             } catch (error) {
                 console.log(error)
                 return res.serverError(error);
             }
             return res.ok(dbRecords);
         }
     },
     delete: async (req, res) => {
         try {
             let params = req.allParams();
             let files = await File.find({ id: params.id });
             if (files.length > 0) {
                 var file = files[0];
                 if (file.source == 'google-drive') {
                     await File.destroy({ id: params.id });
                     return res.ok(params.id);
                 } else {
                     const dir = `${sails.config.appPath}/assets/${file.path}`;
                     await fs.stat(dir, async function (err, stat) {
                         if (err == null) {
                             await fs.unlink(dir, (error) => {
                                 if (error) throw error;
                             });
                             await File.destroy({ id: params.id });
                             return res.ok(params.id);
                         } else if (err.code === 'ENOENT') {
                             await File.destroy({ id: params.id });
                             return res.notFound("File not found");
                         } else {
                             return res.serverError(err.code);
                         }
                     });
                 }
             }
         } catch (error) {
             return res.serverError(error);
         }
    },
    download: async function (req,res){
        let params = req.allParams();
        let file = await File.findOne({ id: params.id });
        if(!file) {return res.notFound();}
        let filepath = require('path').resolve(sails.config.appPath+'//assets//'+file.path)
        console.log(filepath,fs.existsSync(filepath));
        if(file.source=='upload' && fs.existsSync(filepath))
        {
            res.setHeader('Content-disposition', 'attachment; filename=' + file.name);
            let filestream = fs.createReadStream(filepath);
            filestream.pipe(res);
        }else{
            return res.notFound("File does not exist");
        }
    }
 };