const Model = require("../../models/Model")
const Response = require("../../models/Response")
const StudentModel = require("../../models/student/StudentModel")

const CareerController = {
    //get random row(10,15) for a specif id
    get_random_question: async (req, res) => {
        const { table, field, value, limit } = req.params
        try {
            new Model().getRandomWithFilter(table, field, value, limit, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    return res.send(response);
                }
                if (results && results.length > 0) {
                    let response = new Response(false, "List get Successfully", results);
                    res.status(200).send(response);
                } else {
                    let response = new Response(true, "List Not Found", []);
                    res.status(200).send(response);
                }
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },
    //generate report of list of skill for a student
    get_student_skill_report: async (req, res) => {
        const { student_id } = req.params
        try {
            new StudentModel().getStudentSkillReport(student_id, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    return res.send(response);
                }
                if (results && results.length > 0) {
                    let response = new Response(false, "List get Successfully", results);
                    res.status(200).send(response);
                } else {
                    let response = new Response(true, "List Not Found", []);
                    res.status(200).send(response);
                }
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },


}

module.exports = CareerController