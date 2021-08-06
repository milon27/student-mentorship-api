require('dotenv').config();
const jwt = require('jsonwebtoken');
const moment = require('moment');
const Define = require('./Define');
const nodemailer = require('nodemailer');
const Response = require('../models/Response');

const Helper = {
    //@get a date after 1 day @return miliseconds
    getExpireDay: (day) => {
        day = day || 1
        return moment().add(parseInt(day), Define.DAYS).valueOf();
    },
    //@return token:String
    getJWTtoken: (email, expires) => {
        if (expires) {
            return jwt.sign({ email: email }, process.env.ACCESS_SECRET, { expiresIn: expires });
        } else {
            return jwt.sign({ email: email }, process.env.ACCESS_SECRET);
        }
    },
    //@return email:String || throw Error
    verifyJWTtoken: (token) => {
        try {
            if (!token) {
                throw new Error("Unauthorized Access")
            }
            const email = jwt.verify(token, process.env.ACCESS_SECRET)
            return email
        } catch (e) {
            throw new Error("Unauthorized Access")
        }
    },
    //validation of empty field
    validateField: (...arr) => {
        const n_arr = arr.filter(itm => {
            if (itm && itm !== null && itm !== undefined) {
                return true
            }
        })
        if (n_arr.length === arr.length) {
            return true;//valid all field
        } else {
            return false;//invalid all field
        }
    },//validateField

    //send email
    sendEmail: (email, message) => {
        const FROM = `${process.env.EMAIL_ID}`
        const PASS = `${process.env.EMAIL_PASS}`
        //https://myaccount.google.com/lesssecureapps
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: FROM,
                pass: PASS
            }
        });

        let mailOptions = {
            from: FROM,
            to: email,
            subject: 'Email verificaion from Student Mentorship',
            html: message
        };
        return new Promise((resolve, rej) => {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("send mail: ", error);
                    resolve(new Response(true, error.message, error))
                } else {
                    console.log("send mail: ", info);
                    resolve(new Response(false, "email sent.", info.response))
                }
            });
        })

    },

    //arr, key
    //console.log(groupBy(['one', 'two', 'three'], 'length'));
    groupBy: function (arr, key) {
        return arr.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    },

}
module.exports = Helper