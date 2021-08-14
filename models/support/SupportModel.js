const DB_Define = require("../../utils/DB_Define");
const Define = require("../../utils/Define");
const Model = require("../Model");
const moment = require('moment')

class SupportModel extends Model {

    //create ticket
    //@param ticket obj
    //@param ticket_chat obj
    //@param ticket_callback(err,{ticket_id,message_id})
    //get connection from pool then use that to do the transction
    createTicket(ticket, ticket_chat, ticket_callback) {
        this.db.getConnection((error, con) => {
            con.beginTransaction(errr => {
                if (errr) {
                    con.release()
                    ticket_callback(errr, null)
                }//end error
                //insert into first table
                con.query('INSERT INTO ?? SET ?', [DB_Define.TICKET_TABLE, ticket], (err, results) => {
                    if (err) {
                        return con.rollback(function () {
                            con.release()
                            ticket_callback(err, null)
                        });
                    }
                    let id = results.insertId
                    ticket_chat.ticket_id = id
                    con.query('INSERT INTO ?? SET ?', [DB_Define.TICKET_CHAT_TABLE, ticket_chat], (er, results) => {
                        if (er) {
                            return con.rollback(function () {
                                con.release()
                                ticket_callback(er, null)
                            });
                        }
                        con.commit((error) => {
                            if (error) {
                                con.release()
                                ticket_callback(error, null)
                            } else {
                                con.release()
                                const m_id = results.insertId
                                const t_id = id
                                //console.log("ticket id =", id);
                                //console.log("first message id =", m_id);
                                ticket_callback(null, { t_id, m_id })
                            }
                        });
                    })//end in
                })//end out
            })
        })
    }

    //2. craete ticket chat 
    //using core model addData functions

    //3. get ticket list for students & A/O
    // get all messages of a single ticket
    //using core model pagination funtions

    //4. update ticket
    // mark as unsolved or pending to processing,completed,snoozed,

    //5. search ticket by ticket id or title
    //@param {text} search by text
    searchTicket(text, id, callback) {
        //let sql = `SELECT * FROM ?? WHERE assigned_user_id=2 and ticket_title LIKE '%${text}%' OR student_id LIKE '%${text}%' OR reschedule_reason LIKE '%${text}%' OR ticket_dept LIKE '%${text}%' ORDER BY ${Define.CREATED_AT} DESC;`

        //show only those are assigned to you also all pending.
        let sql = `SELECT * FROM ?? WHERE (ticket_state="pending" and student_id like '%${text}%')  or (student_id like '%${text}%' and assigned_user_id=?)  ORDER BY ${Define.CREATED_AT} DESC;`
        this.db.query(sql, [DB_Define.TICKET_TABLE, id], callback)
    }

    //6. search ticket chat by text
    //@param {text} search by text
    searchTicketChat(text, t_id, callback) {
        let sql = `SELECT * FROM ?? WHERE ticket_id=? and message LIKE '%${text}%' ORDER BY ${Define.CREATED_AT} DESC;`
        this.db.query(sql, [DB_Define.TICKET_CHAT_TABLE, t_id], callback)
    }

    //7. get ticket summery
    //@param{}
    ticketSummary(type, id, callback) {//type= ao/studnet
        //let sql = `SELECT COUNT(id) as total,ticket_state FROM ticket where assigned_user_id= ? GROUP BY ticket_state  ;`

        //let sql = `SELECT COUNT(id) as total,ticket_state FROM ticket where ticket_state= "pending" GROUP BY ticket_state UNION SELECT COUNT(id) as total,ticket_state FROM ticket where ticket_state!= "pending" and assigned_user_id= ? GROUP BY ticket_state`

        let sql = ""
        if (type === "student") {
            sql = `SELECT COUNT(id) as total,ticket_state FROM ticket where student_id= ? GROUP BY ticket_state `
            this.db.query(sql, id, callback)
        }
        else if (type === "dept") {
            //here id= old date
            //get all total ticket number from today to last (date)
            sql = `SELECT COUNT(id) as total,ticket_state FROM ticket where created_at BETWEEN ? and now() GROUP BY ticket_state `
            this.db.query(sql, [id], callback)
        }
        else {
            //get total today's snoozed,pending,completed ticket number.
            sql = `SELECT COUNT(id) as total,ticket_state FROM ticket where ticket_state= "snoozed" and reschedule_date= now() GROUP BY ticket_state UNION SELECT COUNT(id) as total,ticket_state FROM ticket where ticket_state= "pending" GROUP BY ticket_state
            UNION SELECT COUNT(id) as total,ticket_state FROM ticket where ticket_state!= "pending" and ticket_state!= "snoozed" and assigned_user_id= ? GROUP BY ticket_state `
            this.db.query(sql, [id], callback)
        }
    }//end ticketSummary

    //8. kon AO r kace koyta ticket assign kora ace r koy ta non asssign ace.
    getTicketAssignSummery = (dateStart, callback) => {
        //upto toady..

        let sql = `
        SELECT COUNT(ticket.id) as total, ticket.ticket_state  as type,ticket.assigned_user_id,ao.name
        FROM ticket
        left join ao on ao.id=ticket.assigned_user_id WHERE ticket.created_at BETWEEN '${dateStart}' and now() and ticket.ticket_state="processing" GROUP BY ticket.assigned_user_id

        union

        SELECT COUNT(ticket.id) as total,ticket.ticket_state  as type,ticket.assigned_user_id,ao.name
        FROM ticket
        left join ao on ao.id=ticket.assigned_user_id WHERE ticket.created_at BETWEEN '${dateStart}' and now() and ticket.ticket_state="completed" GROUP BY ticket.assigned_user_id


        union

        SELECT COUNT(ticket.id) as total,ticket.ticket_state  as type,ticket.assigned_user_id,ao.name
        FROM ticket
        left join ao on ao.id=ticket.assigned_user_id WHERE ticket.created_at BETWEEN '${dateStart}' and now() and ticket.ticket_state="snoozed" GROUP BY ticket.assigned_user_id


        union

        SELECT COUNT(ticket.id) as total,ticket.ticket_state  as type,ticket.assigned_user_id,"Pending"
        FROM ticket
        left join ao on ao.id=ticket.assigned_user_id WHERE ticket.created_at BETWEEN '${dateStart}' and now() and ticket.ticket_state="pending" GROUP BY ticket.assigned_user_id

        `

        this.db.query(sql, callback)
    }

    getAllTicketByBetween = async (table, field, value1, value2, order_field, callback) => {
        let sql = `SELECT * from ?? WHERE ?? between ? and ?  ORDER BY ?? DESC`;
        this.db.query(sql, [table, field, value1, value2, order_field], callback);
    }

}

module.exports = SupportModel