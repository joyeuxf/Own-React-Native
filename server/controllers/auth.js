const User = require('../models/User');
const mail = require('../utils/email');
const twoFactors = require('../utils/2Fa');
const tokenAPI = require('../utils/generateToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const constants = require('../constants/constants');

const { validationResult } = require('express-validator');

exports.getSMS =
    async (req, res) => {
        return twoFactors.sendSMS(req, res);
    }

exports.verifySMS =
    async (req, res) => {
        const {
            email,
            firstName,
            lastName,
            password,
            phoneNumber,
            requestId,
        } = req.body.infosUser;

        const { code } = req.body;

        req.body = { email, firstName, lastName, password, phoneNumber };

        await twoFactors.verifySMS(requestId, code)
            .then(result => {
                register(req, res);
            })
            .catch(err => {

                res.status(400).send({
                    success: err.success,
                    message: err.message
                });
            });
    }

exports.cancelSMS = 
    async (req, res) => {        
        return twoFactors.cancelRequestSMS(req, res);
    }    


exports.checkUserExist = async (req, res) => {

    const { email, phoneNumber } = req.body;

    const userEmail = await User.findOne({ email });
    const userPhoneNumber = await User.findOne({ phoneNumber });
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    if (userEmail) {
        if (userEmail.email === email) {
            return res.status(400).json({
                success: false,
                message: constants.EMAIL_ALREADY_EXIST
            });
        }
    }

    else if (userPhoneNumber) {
        return res.status(400).json({
            success: false,
            message: "L'utilisateur avec ce numéro de téléphone existe déjà"
        });
    }

    return res.status(200).json({
        success: true
    })
}

const register =
    async (req, res) => {

        const { firstName, lastName, email, password, phoneNumber } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashPassword,
            phoneNumber,
            confirmed: false,
            isPaid: false,
            subscription: 0,
            firstConnection: true
        })

        try {
            const token = tokenAPI.generate(user);

            const responseEmail = await mail.sendMessage(email, token);

            if (responseEmail.success) {
                const saveUser = await user.save();
                res.send({
                    success: true,
                    data: {
                        id: saveUser._id,
                        firstName: saveUser.firstName,
                        lastName: saveUser.lastName,
                        email: saveUser.email,
                        phoneNumber: saveUser.phoneNumber
                    }
                });
            }

            else {
                res.status(400).send({
                    success: false,
                    message: "Erreur lors de l'envoi d'email"
                })
            }
        }

        catch (error) {
            res.status(400).send({
                success: false,
                error: "Something went wrong during send email or subscription"
            });
        }

    }

exports.login = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const user = await User.findOne({
        email: req.body.email
    });

    if (!user) {
        return res.status(404).send({
            success: false,
            message: 'User is not registered'
        })
    }

    if (!user.confirmed) {
        return res.status(401).send({
            success: false,
            message: 'Please confim your email'
        })
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(404).send({
            success: false,
            message: constants.WRONG_PASSWORD_OR_EMAIL
        })
    }

    var token = tokenAPI.generate(user);    
    res.header('auth-token', token).send({
        success: true,
        message: 'Logged in Successfully',
        firstConnection: user.firstConnection,
        token
    })
}

exports.activateAccount = async (req, res) => {
    const token = req.params.confirmationCode;

    if (token) {
        jwt.verify(token, process.env.JWT, (err, decodedToken) => {
            if (err) {
                return res.status(400).json({
                    error: "Incorrect or Expired Link"
                })
            }
            req.user = decodedToken;
        })

        const { _id, email, firstName, lastName } = req.user;
        const user = await User.findOne({ _id: _id, email: email, firstName: firstName, lastName: lastName });

        if (user) {
            try {
                user.confirmed = true;
                await user.save();
                return res.status(200).json({
                    success: true,
                    message: "email confirmed"
                });
            }

            catch (error) {                
                res.status(400).send({
                    success: false,
                    error: "Something during registration"
                });
            }
        }
    }
}