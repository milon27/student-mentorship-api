const Response = require("../../models/Response")
const TodoModel = require("../../models/todo/TodoModel")
const DB_Define = require("../../utils/DB_Define")
const Define = require("../../utils/Define")
const Helper = require("../../utils/Helper")


const TodoController = {
    /**
     * @POST
     * @description create todo
     * @param {user_id,title, dead_line} req.body
     * @param {-} req.params 
     */
    createTodo: (req, res) => {
        const { user_id, title, dead_line } = req.body
        try {
            //validate
            if (!Helper.validateField(user_id, title, dead_line)) {
                throw new Error("insert title,deadline")
            }
            //make the object
            const todo = {
                title,
                user_id,
                is_done: 0,
                dead_line
            }
            //inset into db
            new TodoModel().addData(DB_Define.TODO_TABLE, todo, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    return res.send(response);
                }

                todo.id = results.insertId
                let response = new Response(false, "New Todo Created Succesfully", todo);
                res.send(response);
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },

    /**
     * @PUT
     * @description mark as complete/update
     * @param {feedback} req.body
     * @param {id} req.params
     */
    updateTodo: (req, res) => {
        const id = parseInt(req.params.id)
        const { feedback } = req.body
        //make the object
        const todo = {
            id,
            feedback,
            is_done: 1
        }
        try {
            new TodoModel().updateData(DB_Define.TODO_TABLE, todo, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    return res.send(response);
                }
                let response = new Response(false, "Todo Updated Succesfully", todo);
                res.send(response);
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },

    /**
     * @DELETE
     * @description delete todo
     * @param {} req.body
     * @param {id} req.params
     */
    deleteTodo: (req, res) => {
        const id = parseInt(req.params.id)

        try {
            new TodoModel().deleteData(DB_Define.TODO_TABLE, id, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    return res.send(response);
                }

                let response = new Response(false, "Todo Deleted Succesfully", id);
                res.send(response);
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },

    /**
     * @GET
     * @description get all todo for a user (2 types: in-progress and completed)
     * @param {} req.body
     * @param {user_id,is_done} req.params (is_done=0,1)
     */
    getTodoByType: (req, res) => {
        const { user_id, is_done } = req.params

        try {
            new TodoModel().getAllByFilter(DB_Define.TODO_TABLE, "user_id", user_id, "is_done", is_done, Define.CREATED_AT, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    return res.send(response);
                }

                if (results && results.length > 0) {
                    let response = new Response(false, " Todo list get Successfully", results);
                    res.status(200).send(response);
                } else {
                    let response = new Response(true, " Todo list NOT FOUND", []);
                    res.status(200).send(response);
                }
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },

    /**
     * @GET
     * @description get todo those deadline is within 7 days(show in dashboard)
     * @param {} req.body
     * @param {user_id,day} req.params (id_done=0,1)
     */
    getAllUnDoneUptoNDays: (req, res) => {
        const { user_id, day } = req.params

        try {
            new TodoModel().getAllUnDoneUptoNDays(DB_Define.TODO_TABLE, user_id, "dead_line", day, Define.CREATED_AT, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    return res.send(response);
                }

                if (results && results.length > 0) {
                    let response = new Response(false, " Todo list get Successfully", results);
                    res.status(200).send(response);
                } else {
                    let response = new Response(true, " Todo list NOT FOUND", []);
                    res.status(200).send(response);
                }
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    }
}

module.exports = TodoController