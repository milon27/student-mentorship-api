const DB_Define = require("../../utils/DB_Define");
const Define = require("../../utils/Define");
const Model = require("../Model");
const moment = require('moment')

class SupportModel extends Model {

    //create ticket
    //@param ticket obj
    //@param ticket_chat obj
    //@param ticket_callback(err,{ticket_id,message_id})
    createTicket(ticket, ticket_chat, ticket_callback) {
        this.db.beginTransaction(errr => {
            if (errr) { ticket_callback(errr, null) }//end error
            //insert into first table

            this.db.query('INSERT INTO ?? SET ?', [DB_Define.TICKET_TABLE, ticket], (err, results) => {
                if (err) {
                    return this.db.rollback(function () {
                        ticket_callback(err, null)
                    });
                }
                let id = results.insertId
                ticket_chat.ticket_id = id
                this.db.query('INSERT INTO ?? SET ?', [DB_Define.TICKET_CHAT_TABLE, ticket_chat], (er, results) => {
                    if (er) {
                        return this.db.rollback(function () {
                            ticket_callback(er, null)
                        });
                    }
                    this.db.commit((error) => {
                        if (error) {
                            ticket_callback(error, null)
                        } else {
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

        let sql = `SELECT * FROM ?? WHERE ticket_state="pending" or assigned_user_id=? and student_id like '%${text}%' ORDER BY ${Define.CREATED_AT} DESC;`
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

        const date = new Date()
        let d = moment(date).format(Define.FORMAT_SQL_DATE)
        let sql = ""
        if (type === "student") {
            sql = `SELECT COUNT(id) as total,ticket_state FROM ticket where student_id= ? GROUP BY ticket_state `
            this.db.query(sql, id, callback)
        } else {
            sql = `SELECT COUNT(id) as total,ticket_state FROM ticket where ticket_state= "snoozed" and reschedule_date= ? GROUP BY ticket_state UNION SELECT COUNT(id) as total,ticket_state FROM ticket where ticket_state= "pending" GROUP BY ticket_state UNION SELECT COUNT(id) as total,ticket_state FROM ticket where ticket_state!= "pending" and ticket_state!= "snoozed" and assigned_user_id= ? GROUP BY ticket_state `
            this.db.query(sql, [d, id], callback)
        }




    }
}

module.exports = SupportModel