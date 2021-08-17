const express = require('express');
const router = express.Router();
const { 
    getSMS, 
    verifySMS, 
    checkUserExist, 
    cancelSMS, 
    login, 
    activateAccount } = require('../controllers/auth');
const { validateRegisterUser } = require('../validators/register/usersRegisterValidator');
const { validateLoginUser } = require('../validators/login/usersLoginValidators');

router.route('/login').post(validateLoginUser, login);
router.route('/getSMS').post(validateRegisterUser, getSMS);
router.route('/checkUserExist').post(checkUserExist);
router.route('/verifySMS').post(verifySMS);
router.route('/cancelSMS').post(cancelSMS);
router.get('/email-activate/:confirmationCode', activateAccount);

module.exports = router;