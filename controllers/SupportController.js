const Response = require("../models/Response")
const SupportModel = require("../models/SupportModel")
const DB_Define = require("../utils/DB_Define")
const Helper = require("../utils/Helper")

const SupportController = {
    /**
    * @description insert ticket info in ticket+ticket_chat table
    * @ticker_object {
     * id,
     * student_id(R), 
     * ticket_title(R),
     * assigned_user_id(R),
     * ticket_state, 
     * reschedule_date:(default),
     * created_at:(default)
     * message (R) //get first message
    * }
    * @response {error(boolean), message(String), response(object:any)}
    */
    create_ticket: (req, res) => {

        try {
            const sender = req.body.student_id//student is creating the ticket so he is sender
            const ticket_title = req.body.ticket_title
            const assigned_user_id = req.body.assigned_user_id//a/o id

            //validation
            if (!Helper.validateField(sender, ticket_title, assigned_user_id)) {
                throw new Error("Enter sender,ticket_title,assigned_user_id")
            }

            const message = req.body.message
            const ticket = {
                student_id: sender,
                ticket_title,
                assigned_user_id,
            }
            const ticket_chat = {
                message: message,
                sender_id: sender
            }

            new SupportModel().createTicket(ticket, ticket_chat, (err, id) => {
                if (err) {
                    let response = new Response(500, err.message, err);
                    res.send(response);
                } else {
                    ticket.id = id
                    let response = new Response(200, "Ticket Created Successfully", ticket);
                    res.send(response);
                }
            })

        } catch (e) {
            let response = new Response(500, e.message, e);
            res.send(response);
        }
    },//end create ticket

    /**
     * @description insert message on ticket_chat table (message)
     * @message_object {
     * id,
     * ticket_id,(R)-required
     * message,(R)-required
     * sender_id,(R)-required
     * created_at
     * }
     * @response {error(boolean), message(String), response(object:any)}
     */
    create_message: (req, res) => {
        try {
            const { ticket_id, message, sender_id } = req.body

            if (!Helper.validateField(ticket_id, message, sender_id)) {
                throw new Error("Enter ticket_id,message,sender_id")
            }
            const ticket_chat = {
                ticket_id,
                message,
                sender_id
            }
            new SupportModel().addData(DB_Define.TICKET_CHAT_TABLE, ticket_chat, (err, results) => {
                if (err) {
                    let response = new Response(500, err.message, err);
                    res.send(response);
                } else {

                    ticket_chat.id = results.insertId;
                    results.new_object = ticket_chat;

                    let response = new Response(200, " Inserted Successfully", results);
                    res.send(response);
                }
            })//end db op
        } catch (e) {
            let response = new Response(500, e.message, e);
            res.send(response);
        }
    },
    /**
     * @description get all tickets based on ticket_state
     * @response {error(boolean), message(String), response(Array:[])}
     */
    getTickets: (req, res) => {
        const state = req.params.ticket_state
        res.send(`all ${state} tickets are loaded...`)
    }


}

module.exports = SupportController;