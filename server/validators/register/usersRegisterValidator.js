const { body } = require('express-validator');

exports.validateRegisterUser = [
    body('firstName')
        .isLength({ min: 3 })
        .withMessage('Le prénom complet est requis'),
    
    body('lastName')
        .isLength({ min: 3 })
        .withMessage('Le nom complet est requis'),

    body('email')
        .isEmail()
        .withMessage('L\'adresse email n\'est pas au bon format'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Le mot de passe doit être au moins de 8 caractères'),

    body('phoneNumber')
        .isLength({ min: 10, max: 10 })
        .isMobilePhone()
        .withMessage('Le numéro de téléphone n\'est pas au bon format, doit comporter 10 caractères ')
]