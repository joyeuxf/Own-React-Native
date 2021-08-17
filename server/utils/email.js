const express = require('express');
const sgMail = require('@sendgrid/mail');
const constants = require('../constants/constants');

var app = express();
app.use(express.json());
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const EMAIL_FROM = process.env.EMAIL_FROM

exports.sendMessage = async (email, token) => {
    const msg = {
        from: EMAIL_FROM,
        to: email,
        subject: 'Validez votre compte NEWDE dès maintenant',
        text: 'and easy to do anywhere, even with Node.js',
        html: `
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;margin-top: 50px;margin-left: auto;margin-right: auto;">
                <tr>
                    <td align="center" role="presentation" style="" valign="middle" style="border:none;border-radius:6px;cursor:auto;padding:11px 30px;">
                        <p style="font-size: 30px">${constants.ACCOUNT_CONFIRMATION_TILE}</p>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;margin-top: 50px;margin-left: auto;margin-right: auto;">
                <tr>
                    <td align="center" bgcolor="#19cca3" role="presentation" style="border:none;border-radius:6px;cursor:auto;padding:11px 30px;background:#19cca3;" valign="middle">
                        <a href="${process.env.CLIENT_URL}${process.env.PORT}${process.env.API_AUTHENTIFICATION}/email-activate/${token}" style="background:#19cca3;color:#ffffff;font-family:Helvetica, sans-serif;font-size:18px;font-weight:600;line-height:120%;Margin:0;text-decoration:none;text-transform:none;" target="_blank">
                            ${constants.BUTTON_ACCOUNT_CONFIRMATION_MSG}
                        </a>
                    </td>
                </tr>
            </table>
        `
    }

    try {
        const response = await sgMail.send(msg);
        return {
            success: true,
            statusCode: response[0].statusCode,
            headers: response[0].headers,
            message: "Email has been sent, kindly activate your account"
        }
    }

    catch (error) {
        if (error.response) {
            return {
                success: false,
                statusCode: error.response.body,
                message: "Something went wrong during email sending ..."
            }
        }
    }
}

