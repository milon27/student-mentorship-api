const DbModel = require("../../models/db/DbModel")
const Response = require("../../models/Response")


const DbController = {
    test: (req, res) => {
        new DbModel().test((err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response = new Response(false, " result: ", results);
                res.status(200).send(response);
            }
        })
    },
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
    },//user end

    //student start
    createStudentTable: (req, res) => {
        new DbModel().create_student_table((err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response = new Response(false, " student table Created Successfully", results);
                res.status(200).send(response);
            }
        })
    },//student end

    //Ao start
    createAoTable: (req, res) => {
        new DbModel().create_ao_table((err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response = new Response(false, " ao table Created Successfully", results);
                res.status(200).send(response);
            }
        })
    },//Ao end

    //faculty start
    createFacultyTable: (req, res) => {
        new DbModel().create_faculty_table((err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response = new Response(false, " faculty table Created Successfully", results);
                res.status(200).send(response);
            }
        })
    },//faculty end

    //create todo table
    createTodoTable: (req, res) => {
        new DbModel().create_todo_table((err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response = new Response(false, " Todo table Created Successfully", results);
                res.status(200).send(response);
            }
        })
    },//todo end




}
module.exports = DbController