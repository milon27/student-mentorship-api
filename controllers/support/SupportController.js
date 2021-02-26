const Response = require("../../models/Response")
const SupportModel = require("../../models/support/SupportModel")
const DB_Define = require("../../utils/DB_Define")
const Define = require("../../utils/Define")
const Helper = require("../../utils/Helper")

const SupportController = {
    /**
    * @body {student_id, ticket_title, ticket_dept, message, img_url(Optional)}=req.body
    * @param {}=req.params
    * @description insert ticket info in ticket+ticket_chat table
    * @response {error(boolean), message(String), response(object:any)}
    */
    create_ticket: (req, res) => {

        try {
            const sender = req.body.student_id//student is creating the ticket so he is sender
            const ticket_title = req.body.ticket_title
            const ticket_dept = req.body.ticket_dept
            const message = req.body.message//this is the first chat message
            const img_url = req.body.img_url//not required but if needed image or attatchment can be sent by student
            //const assigned_user_id = req.body.assigned_user_id// A/O id will set later

            //validation
            if (!Helper.validateField(sender, ticket_title, ticket_dept, message)) {
                throw new Error("Enter sender,ticket_title,ticket_dept,message")
            }

            const ticket = {
                student_id: sender,
                ticket_title,
                ticket_dept
            }
            const ticket_chat = {
                message: message,
                img_url: img_url || Define.NOT_SET,
                sender_id: sender//student id
            }

            new SupportModel().createTicket(ticket, ticket_chat, (err, result) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    res.send(response);
                } else {
                    const { t_id, m_id } = result
                    ticket.id = t_id
                    ticket_chat.id = m_id
                    let response = new Response(false, "A Pending Ticket Created Successfully", { ticket, ticket_chat });
                    res.send(response);
                }
            })

        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },//end create ticket

    /**
     * @body {ticket_id, message, img_url(Optional), sender_id}=req.body
     * @param {}=req.params
     * @description insert message on ticket_chat table (message)
     * @response {error(boolean), message(String), response(object:any)}
     */
    create_message: (req, res) => {
        try {
            const { ticket_id, message, img_url, sender_id } = req.body

            if (!Helper.validateField(ticket_id, message, sender_id)) {
                throw new Error("Enter ticket_id,message,sender_id")
            }
            const ticket_chat = {
                ticket_id,
                message,
                img_url: img_url || Define.NOT_SET,
                sender_id
            }
            new SupportModel().addData(DB_Define.TICKET_CHAT_TABLE, ticket_chat, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    res.send(response);
                } else {
                    ticket_chat.id = results.insertId;
                    let response = new Response(false, " Ticket Message Sent Successfully", ticket_chat);
                    res.send(response);
                }
            })//end db op
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },//create_message

    /**
     * @body {}=req.body
     * @param { table, field, value, page_no }=req.params
     * @description1 get all tickets based on ticket_state order by created_at descending
     * @description2 get all tickets based on student_id order by created_at descending
     * @description3 get all messages/chat based on ticket_id order by created_at descending
     * @response {error(boolean), message(String), response(Array:[])}
     */
    getByField_P: (req, res) => {
        try {
            const { table, field, value, page_no } = req.params

            new SupportModel().getPaginateList(page_no, table, field, value, Define.CREATED_AT, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    res.send(response);
                } else {
                    let response;
                    if (results.length > 0) {
                        response = new Response(false, `all ${field} from ${table} list`, results);
                    } else {
                        response = new Response(false, `all ${field} from ${table} list is empty`, []);
                    }
                    res.send(response);
                }
            })//end db op
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }

    },//getByField_P

    /**
     * @param {id}=req.params//ticket_id
     * @body { ticket_state, reschedule_reason, reschedule_date(e.g. 2021-3-20) }= req.body
     * @description1 update ticket_state (mark as unsolved or pending to processing,completed,snoozed)
     * @response {error(boolean), message(String), response({})}
     */
    updateTicket: (req, res) => {
        try {
            const { id } = req.params//ticket id
            const { ticket_state, reschedule_reason, reschedule_date } = req.body
            if (!Helper.validateField(ticket_state)) {
                throw new Error("set ticket_state")
            }

            const ticket = {
                id: id,
                ticket_state
            }

            if (ticket_state === Define.SNOOZED_TICKET) {
                if (!Helper.validateField(ticket_state, reschedule_reason, reschedule_date)) {
                    throw new Error("set ticket_state,reschedule_reason, reschedule_date")
                }
                ticket.reschedule_reason = reschedule_reason
                ticket.reschedule_date = reschedule_date
            }

            new SupportModel().updateData(DB_Define.TICKET_TABLE, ticket, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    res.send(response);
                } else {
                    let response = new Response(false, `ticket updated to ${ticket_state}`, ticket);
                    res.send(response);
                }
            })//end db op
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },

    /**
     * @param {text} =req.params//ticket_id or ticket_title
     * @body {}= req.body
     * @description search by ticket_id
     * @response {error(boolean), message(String), response([])}
     */
    searchTicket: (req, res) => {
        try {
            const text = req.params.text //ticket id or ticket title
            new SupportModel().searchTicket(text, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    res.send(response);
                } else {
                    let response;
                    if (results.length > 0) {
                        response = new Response(false, `search result for ${text} `, results);
                    } else {
                        response = new Response(false, `search result for ${text} is empty`, []);
                    }
                    res.send(response);
                }
            })//end db op
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },

    /**
     * @param {text} =req.params//chat message
     * @body {}= req.body
     * @description search by message text
     * @response {error(boolean), message(String), response([])}
     */
    searchTicketChat: (req, res) => {
        try {
            const text = req.params.text //ticket id or ticket title
            new SupportModel().searchTicketChat(text, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    res.send(response);
                } else {
                    let response;
                    if (results.length > 0) {
                        response = new Response(false, `search result for ${text} `, results);
                    } else {
                        response = new Response(false, `search result for ${text} is empty`, []);
                    }
                    res.send(response);
                }
            })//end db op
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },


}

module.exports = SupportController;