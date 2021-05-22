const Response = require("../../models/Response")
const NoticeModel = require("../../models/notice/NoticeModel")
const DB_Define = require("../../utils/DB_Define")
const Helper = require("../../utils/Helper")
const Define = require("../../utils/Define")


const NoticeController = {
    /**
     * @POST
     * @description create notice
    * @param { publisher_id, title, description} req.body
     * @param {-} req.params 
     */
    createNotice: (req, res) => {
        const { publisher_id, title, description } = req.body
        try {
            //validate
            if (!Helper.validateField(publisher_id, title, description)) {
                throw new Error("insert publisher_id, title,description")
            }
            //make the object
            const notice = {
                publisher_id: parseInt(publisher_id), title, description
            }
            //inset into db
            new NoticeModel().addData(DB_Define.NOTICE_TABLE, notice, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    return res.send(response);
                }

                notice.id = results.insertId
                let response = new Response(false, "New Notice Created Succesfully", notice);
                res.send(response);
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },

    /**
     * @PUT
     * @description update notice
     * @param {title,description} req.body
     * @param {id} req.params
     */
    updateNotice: (req, res) => {
        const { id } = req.params
        const { title, description } = req.body
        //make the object
        const notice = {
            id: parseInt(id)
        }
        if (title) {
            notice.title = title
        }
        if (description) {
            notice.description = description
        }
        //console.log(notice);
        try {
            new NoticeModel().updateData(DB_Define.NOTICE_TABLE, notice, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    return res.send(response);
                }
                let response = new Response(false, "Notice Updated Succesfully", notice);
                res.send(response);
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },

    /**
     * @DELETE
     * @description delete notice
     * @param {} req.body
     * @param {id} req.params
     */
    deleteNotice: (req, res) => {
        const id = parseInt(req.params.id)
        try {
            new NoticeModel().deleteData(DB_Define.NOTICE_TABLE, id, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    return res.send(response);
                }
                let response = new Response(false, "Notice Deleted Succesfully", id);
                res.send(response);
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },

    /**
     * @GET
     * @description get all notice
     * @param {page_no} req.params
     */
    getAll: (req, res) => {
        let { page_no } = req.params
        let field = ""
        let value = -1
        let field2 = ""
        let value2 = -1
        new NoticeModel().getPaginateList(page_no, DB_Define.NOTICE_TABLE, field, value, field2, value2, Define.CREATED_AT, (err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response;
                if (results.length > 0) {
                    response = new Response(false, `all list`, results);
                } else {
                    response = new Response(false, `all list is empty`, []);
                }
                res.send(response);
            }
        })//end db op
    },
    /**
     * @GET
     * @description get recent(7) notice
     * @param {num} req.params
     */
    getRecent: (req, res) => {
        const num = parseInt(req.params.num)

        new NoticeModel().getRecent(DB_Define.NOTICE_TABLE, num, Define.CREATED_AT, (err, results) => {
            if (err) {
                let response = new Response(true, err.message, err);
                res.send(response);
            } else {
                let response;
                if (results.length > 0) {
                    response = new Response(false, `all list`, results);
                } else {
                    response = new Response(false, `all list is empty`, []);
                }
                res.send(response);
            }
        })//end db op
    }//end
}

module.exports = NoticeController