const DB_Define = require("../../utils/DB_Define");
const Define = require("../../utils/Define");
const Model = require("../Model");

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
    searchTicket(text, callback) {
        let sql = `SELECT * FROM ?? WHERE ticket_title LIKE '%${text}%' OR student_id LIKE '%${text}%' OR reschedule_reason LIKE '%${text}%' OR ticket_dept LIKE '%${text}%' ORDER BY ${Define.CREATED_AT} DESC;`
        this.db.query(sql, [DB_Define.TICKET_TABLE], callback)
    }

    //6. search ticket chat by text
    //@param {text} search by text
    searchTicketChat(text, callback) {
        let sql = `SELECT * FROM ?? WHERE message LIKE '%${text}%' ORDER BY ${Define.CREATED_AT} DESC;`
        this.db.query(sql, [DB_Define.TICKET_CHAT_TABLE], callback)
    }
}

module.exports = SupportModel