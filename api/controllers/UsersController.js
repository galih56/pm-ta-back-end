/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getUser: async (req, res) => {
        if (req.params.userId) {
            let users = await Users.find({ id: req.params.userId });
            if (users.length > 0) {
                return res.send(users[0]);
            }
        }
        return res.badRequest(`User ${req.params.userId} not found`);
    }

};

