const Vonage = require('@vonage/server-sdk');
const { request } = require('express');
const constants = require('../constants/constants');

const vonage = new Vonage({
    apiKey: process.env.API_KEY_VONAGE,
    apiSecret: process.env.API_SECRET_VONAGE
});

exports.sendSMS = async (req, res) => {
    const { phoneNumber } = req.body;
    vonage.verify.request({
        number: phoneNumber,
        brand: "NEWDE",
        workflow_id: 6,
        next_event_wait: 60,
        pin_expiry: 60
    }, (err, result) => {
        if (err) {
            res.status(500).send(err.error_text);
        } else {
            if (result.status != '0') {
                res.status(500).send({
                    success: false,
                    message: constants.FAIL_SEND_SMS
                });
            }
            else {
                const requestId = result.request_id;
                res.status(200).send({
                    success: true,
                    requestId: requestId
                });
            }
        }
    });
}

exports.verifySMS = async (requestId, code) => {
    
    return new Promise(function (resolve, reject) {
        if (!requestId || !code) {
            reject({
                success: false,
                message: constants.INVALID_CODE_SMS
            });
        }

        vonage.verify.check({
            request_id: requestId,
            code: code
        }, (err, result) => {
            if (err) {
                reject({
                    success: false,
                    message: constants.IMPOSSIBILITY_TO_VERIFY_CODE
                });

            } else {
                if (result.error_text) {
                    reject({
                        success: false,
                        message: constants.INVALID_CODE_OR_EXPIRED
                    });
                } else {
                    resolve(result);
                }
            }
        });
    });
}

exports.cancelRequestSMS = async (req, res) => {
    const { requestId } = req.body;

    vonage.verify.control({
        request_id: requestId,
        cmd: 'cancel'
    }, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send({
                success: false,                
            })
        } else {
            
            if (result.status == '0' || result.status == '6') {
                res.status(200).send({
                    success: true,
                });
            }
                  
            else if (result.status == '19') {
                res.status(500).send({
                    success: false,
                    message: constants.RESEND_EMAIL_INFERIOR_30_s
                });
            }
            else {
                res.status(500).send({
                    success: false,
                    message: constants.FAIL_CANCELED_CODE
                });
            }
        }
    });
}