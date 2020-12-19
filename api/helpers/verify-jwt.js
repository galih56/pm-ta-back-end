var jwt = require('jsonwebtoken');
module.exports = {
  //From tutorial
  //https://dev.to/thelebdev/what-i-learned-on-my-own-sailsjs-implementing-middleware-authentication-i16
  friendlyName: 'Verify JWT',
  description: 'Verify a JWT token.',

  inputs: {
    req: {
      type: 'ref',
      friendlyName: 'Request',
      description: 'A reference to the request object (req).',
      required: true
    },
    res: {
      type: 'ref',
      friendlyName: 'Response',
      description: 'A reference to the response object (res).',
      required: false
    }
  },
  exits: {
    invalid: {
      description: 'Invalid token or no authentication present.',
    }
  },
  fn: function (inputs, exits) {
    var req = inputs.req
    var res = inputs.res
    if (req.header('Authorization')) {
      // if one exists, attempt to get the header data
      var token = req.header('Authorization').split('Bearer ')[1];
      const SECRET='galih56zoopreme56';
      // if there's nothing after "Bearer", no go
      if (!token) return exits.invalid()
      // if there is something, attempt to parse it as a JWT token
      return jwt.verify(token, SECRET, async function (err, payload) {
        if (err || !payload.id) return exits.invalid();
        var user = await User.findOne(payload.id);
        // console.log(user,payload)
        if (!user) return exits.invalid();
        return exits.success(payload)
      });
    }
    return exits.invalid()
  }
};

