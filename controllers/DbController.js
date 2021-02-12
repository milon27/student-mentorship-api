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
    createSupportChatSummeryTable: (req, res) => {
        new DbModel().create_support_chat_summary_table((err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response = new Response(false, " support_chat_summary table Created Successfully", results);
                res.status(200).send(response);
            }
        })
    },

    createSupportChatTable: (req, res) => {
        new DbModel().create_support_chat_table((err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response = new Response(false, " support_chat table Created Successfully", results);
                res.status(200).send(response);
            }
        })
    },//support end


}
module.exports = DbController