const jwt = require('jsonwebtoken');

exports.generate =  user => {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
    }, process.env.JWT, {expiresIn: process.env.EXPIRE_TOKEN})
}

