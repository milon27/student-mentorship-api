const DbModel = require("../models/DbModel")
const Response = require("../models/Response")


const DbController = {
    createDb: (req, res) => {
        new DbModel().createDatabase((err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response = new Response(false, " Database Created Successfully", results);
                res.status(200).send(response);
            }
        })
    },
    //support start
    createTicketTable: (req, res) => {
        new DbModel().create_ticket_table((err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response = new Response(false, " ticket table Created Successfully", results);
                res.status(200).send(response);
            }
        })
    },

    createTicketChatTable: (req, res) => {
        new DbModel().create_ticket_chat_table((err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response = new Response(false, " ticket_chat table Created Successfully", results);
                res.status(200).send(response);
            }
        })
    },//support end

    //user start
    createUserTable: (req, res) => {
        new DbModel().create_user_table((err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response = new Response(false, " users table Created Successfully", results);
                res.status(200).send(response);
            }
        })
    },//support end


}
module.exports = DbController