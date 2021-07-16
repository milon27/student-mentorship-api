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

    //student start
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
    },//student end

    //department start
    createDepartmentTable: (req, res) => {
        new DbModel().create_department_table((err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response = new Response(false, " department table Created Successfully", results);
                res.status(200).send(response);
            }
        })
    },//department end


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
    //create notice table
    createNoticeTable: (req, res) => {
        new DbModel().create_notice_table((err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response = new Response(false, " Notice table Created Successfully", results);
                res.status(200).send(response);
            }
        })
    },//notice end
    //create skill tables
    createSkillTable: (req, res) => {
        new DbModel().create_skill_table((err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response = new Response(false, " skill table Created Successfully", results);
                res.status(200).send(response);
            }
        })
    },//skill end
    //create sub skill tables
    createSubSkillTable: (req, res) => {
        new DbModel().create_sub_skill_table((err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response = new Response(false, "sub skill table Created Successfully", results);
                res.status(200).send(response);
            }
        })
    },//sub skill end
    //create questions tables
    createQuestionsTable: (req, res) => {
        new DbModel().createQuestionsTable((err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response = new Response(false, "questions table Created Successfully", results);
                res.status(200).send(response);
            }
        })
    },//questions end
    //create student skil list
    createStudentSkillListTable: (req, res) => {
        new DbModel().createStudentSkillListTable((err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response = new Response(false, "StudentSkillList table Created Successfully", results);
                res.status(200).send(response);
            }
        })
    },//questions end

}
module.exports = DbController