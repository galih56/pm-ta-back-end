/**
 * MeetingMemberController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    find: async (req, res) => {
        try {
            let meetingMember = await MeetingMember.find();
            return res.send(meetingMember);
        }
        catch (err) {
            return res.serverError(err);
        }
    },
    findOne: async (req, res) => {
        let params = req.allParams();
        try {
            if (params.id) {
                let meetingMember = await MeetingMember.find({ id: params.id });
                if (meetingMember.length > 0) {
                    return res.send(meetingMember[0]);
                }
                return res.notFound();
            }
            return res.notFound();
        }
        catch (err) {
            return res.serverError(err);
        }
    },
    create: async (req, res) => {
        try {
            let params = req.allParams();
            let user = await MeetingMember.create({
                meeting: params.meetings_id,
                member: params.project_members_id,
                createdAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
            });
            return res.ok(user);
        }
        catch (err) {
            return res.serverError(err);
        }
    },
    update: async (req, res) => {
        try {
            let params = req.allParams();
            let attributes = {};
            if (params.meetings_id) attributes.meeting = params.meetings_id;
            if (params.project_members_id) attributes.member = params.project_members_id;
            attributes.updatedAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
            const results = await MeetingMember.update({ id: params.id }, attributes);
            return res.ok(results);
        } catch (err) {
            return res.serverError(err);
        }
    },
    delete: async (req, res) => {
        try {
            let params = req.allParams();
            const results = await MeetingMember.destroy({
                id: params.id
            });
            return res.ok(results);
        } catch (err) {
            return res.serverError(err);
        }
    }
};

