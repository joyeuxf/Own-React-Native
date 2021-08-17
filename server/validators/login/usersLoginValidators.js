const { body } = require('express-validator');

exports.validateLoginUser = [
    body('email')
        .isEmail()
        .withMessage('L\'adresse email n\'est pas au bon format'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Le mot de passe doit être au moins de 8 carcatères')
]