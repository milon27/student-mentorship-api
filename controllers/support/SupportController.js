const Response = require("../../models/Response")
const SupportModel = require("../../models/support/SupportModel")
const DB_Define = require("../../utils/DB_Define")
const Define = require("../../utils/Define")
const Helper = require("../../utils/Helper")
const moment = require('moment')

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
                ticket_dept,
                ticket_state: Define.PENDING_TICKET
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
                    ticket.created_at = new Date()

                    ticket_chat.id = m_id
                    // let response = new Response(false, "A Pending Ticket Created Successfully", { ticket, ticket_chat }
                    let response = new Response(false, "A Pending Ticket Created Successfully", ticket);
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
            let { table, field, value, page_no, field2, value2 } = req.params

            //console.log("ck=", "--", field2, "=", value2);

            if (!field2) {
                field2 = ""
            }
            if (!value2) {
                value2 = -1
            }

            new SupportModel().getPaginateList(page_no, table, field, value, field2, value2, Define.CREATED_AT, (err, results) => {
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
            const { ticket_state, reschedule_reason, reschedule_date, assigned_user_id } = req.body
            const ticket = {
                id: id
            }
            let message = ``
            //only for assign A/O id
            if (assigned_user_id) {
                ticket.assigned_user_id = assigned_user_id
                ticket.ticket_state = Define.PROCESSING_TICKET
                message = `ticket id ${id} assigned to A/O user id ${assigned_user_id}`
            } else {
                //only for state update
                if (!Helper.validateField(ticket_state)) {
                    throw new Error("set ticket_state")
                }
                ticket.ticket_state = ticket_state

                if (ticket_state === Define.SNOOZED_TICKET) {
                    if (!Helper.validateField(ticket_state, reschedule_reason, reschedule_date)) {
                        throw new Error("set ticket_state,reschedule_reason, reschedule_date")
                    }
                    ticket.reschedule_reason = reschedule_reason
                    ticket.reschedule_date = reschedule_date
                } else {
                    ticket.reschedule_reason = reschedule_reason || "NOT_SET"
                    ticket.reschedule_date = reschedule_date || "2021-1-12"
                }
                message = `ticket updated to ${ticket_state}`
            }//end else


            new SupportModel().updateData(DB_Define.TICKET_TABLE, ticket, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    res.send(response);
                } else {
                    let response = new Response(false, message, ticket);
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
            const id = req.params.id //user id 
            new SupportModel().searchTicket(text, id, (err, results) => {
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
     * @param {text,ticket_id} =req.params//chat message
     * @body {}= req.body
     * @description search by message text
     * @response {error(boolean), message(String), response([])}
     */
    searchTicketChat: (req, res) => {
        try {
            const t_id = req.params.ticket_id //search on a specific ticket chat
            const text = req.params.text //ticket id or ticket title
            new SupportModel().searchTicketChat(text, t_id, (err, results) => {
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


    //get one ticket
    getOneTicket: (req, res) => {
        try {
            const { table, field, value } = req.params
            new SupportModel().getOne(table, field, value, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    res.send(response);
                } else {
                    let response;
                    //console.log("results=", results);
                    if (results.length > 0) {
                        response = new Response(false, `one ${field} from ${table}`, results[0]);
                    } else {
                        response = new Response(true, `one ${field} from ${table} is empty`, {});
                    }
                    res.send(response);
                }
            })//end db op

        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },

    //get all chats without pagination
    /**
         * @body {}=req.body
         * @param { table, field, value, page_no }=req.params
         * @description1 get all tickets based on ticket_state order by created_at descending
         * @description2 get all tickets based on student_id order by created_at descending
         * @description3 get all messages/chat based on ticket_id order by created_at descending
         * @response {error(boolean), message(String), response(Array:[])}
         */
    getByField_NP: (req, res) => {
        try {
            const { table, field, value } = req.params

            new SupportModel().getAllByField(table, field, value, Define.CREATED_AT, (err, results) => {
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


    //get ticket summary

    getTicketSummary: (req, res) => {

        try {

            const { id, type } = req.params

            new SupportModel().ticketSummary(type, id, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    res.send(response);
                } else {
                    if (results.length > 0) {
                        let summary = {
                            total_pending: 0,
                            total_processing: 0,
                            total_snoozed: 0,
                            total_completed: 0,
                        }

                        //console.log("results---", results);

                        results.forEach(i => {
                            if (i.ticket_state === Define.PENDING_TICKET) {
                                summary.total_pending = i.total
                            } if (i.ticket_state === Define.SNOOZED_TICKET) {
                                summary.total_snoozed = i.total
                            } if (i.ticket_state === Define.COMPLETED_TICKET) {
                                summary.total_completed = i.total
                            } if (i.ticket_state === Define.PROCESSING_TICKET) {
                                summary.total_processing = i.total
                            }
                        });
                        let response = new Response(false, "ticket summary", summary);
                        res.send(response);
                    } else {
                        let response = new Response(true, "not found", {});
                        res.send(response);
                    }
                }
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },


    getTicketSummeryList: (req, res) => {
        try {

            const { date } = req.params

            new SupportModel().ticketSummary("dept", date, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    res.send(response);
                } else {
                    if (results.length > 0) {

                        let summary = {
                            total_pending: {
                                num: 0,
                                tickets: []
                            },
                            total_processing: {
                                num: 0,
                                tickets: []
                            },
                            total_snoozed: {
                                num: 0,
                                tickets: []
                            },
                            total_completed: {
                                num: 0,
                                tickets: []
                            },
                        }

                        //console.log("results---", results);

                        results.forEach(i => {
                            if (i.ticket_state === Define.PENDING_TICKET) {
                                summary.total_pending.num += i.total
                            } if (i.ticket_state === Define.SNOOZED_TICKET) {
                                summary.total_snoozed.num += i.total
                            } if (i.ticket_state === Define.COMPLETED_TICKET) {
                                summary.total_completed.num += i.total
                            } if (i.ticket_state === Define.PROCESSING_TICKET) {
                                summary.total_processing.num += i.total
                            }
                        });
                        //get all tickets.
                        new SupportModel().getAllByBetweenToday(DB_Define.TICKET_TABLE, Define.CREATED_AT, date, Define.CREATED_AT, (err2, result2) => {
                            if (err2) {
                                let response2 = new Response(true, err2.message, err2);
                                res.send(response2);
                            } else {
                                //console.log(result2);
                                result2.forEach(itm => {

                                    if (itm.ticket_state === Define.PENDING_TICKET) {
                                        summary.total_pending.tickets = [...summary.total_pending.tickets, itm]
                                    } if (itm.ticket_state === Define.SNOOZED_TICKET) {
                                        summary.total_snoozed.tickets = [...summary.total_snoozed.tickets, itm]
                                    } if (itm.ticket_state === Define.COMPLETED_TICKET) {
                                        summary.total_completed.tickets = [...summary.total_completed.tickets, itm]
                                    } if (itm.ticket_state === Define.PROCESSING_TICKET) {
                                        summary.total_processing.tickets = [...summary.total_processing.tickets, itm]
                                    }



                                    // arr.forEach(ao_item => {
                                    //     if (ao_item.id === parseInt(itm.assigned_user_id)) {
                                    //         ao_item.tickets = [...ao_item.tickets, itm]
                                    //     }
                                    // })
                                })

                                let response = new Response(false, "ticket summary", summary);
                                res.send(response);
                            }
                        })// 

                        //end



                    } else {
                        let response = new Response(true, "not found", {});
                        res.send(response);
                    }
                }
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },


    getTicketAssignSummery: (req, res) => {
        try {
            const { date } = req.params

            new SupportModel().getTicketAssignSummery(date, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    res.send(response);
                } else {
                    if (results.length > 0) {
                        // let assignSummery = [
                        //     {
                        //         user_id: -1,
                        //         total_pending: 0,
                        //         total_processing: 0,
                        //         total_snoozed: 0,
                        //         total_completed: 0,
                        //         user_name: ""
                        //     }
                        // ]
                        //console.log("results---", results);
                        let groupObj = Helper.groupBy(results, "assigned_user_id")
                        const arr = Object.values(groupObj).map(itemArr => {
                            if (itemArr[0].assigned_user_id === Define.NOT_SET) {
                                return itemArr[0]
                            }
                            //not pending start here.
                            let name = itemArr[0].name
                            let id = parseInt(itemArr[0].assigned_user_id)
                            //get type of ticket
                            let total_processing = 0
                            let total_completed = 0

                            itemArr.forEach(item => {
                                switch (item.type) {
                                    case Define.PROCESSING_TICKET:
                                        total_processing += item.total
                                        break;
                                    case Define.COMPLETED_TICKET:
                                        total_completed += item.total
                                        break;
                                    case Define.SNOOZED_TICKET:
                                        total_processing += item.total
                                        break;
                                    default:
                                        break;
                                }
                            })

                            return { id, name, total_processing, total_completed, tickets: [] }
                        })

                        //get all ticket order by ao

                        new SupportModel().getAllByBetweenToday(DB_Define.TICKET_TABLE, Define.CREATED_AT, date, "assigned_user_id", (err2, result2) => {
                            if (err2) {
                                let response2 = new Response(true, err2.message, err2);
                                res.send(response2);
                            } else {
                                // console.log(result2);
                                result2.forEach(itm => {
                                    arr.forEach(ao_item => {
                                        if (ao_item.id === parseInt(itm.assigned_user_id)) {
                                            ao_item.tickets = [...ao_item.tickets, itm]
                                        }
                                    })
                                })

                                let response = new Response(false, "ticket Assign summary", arr);
                                res.send(response);
                            }
                        })//        
                    } else {
                        let response = new Response(true, "not found", []);
                        res.send(response);
                    }
                }
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },

}

module.exports = SupportController;