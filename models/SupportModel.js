const Model = require("./Model");

class SupportModel extends Model {
    //create ticket
    //ticket_callback(err,ticket_id)
    createTicket(ticket, ticket_chat, ticket_callback) {
        this.db.beginTransaction(errr => {
            if (errr) { ticket_callback(errr, null) }//end error
            //insert into first table

            this.db.query('INSERT INTO ticket SET ?', ticket, (err, results) => {
                if (err) {
                    return this.db.rollback(function () {
                        ticket_callback(err, null)
                    });
                }
                let id = results.insertId
                ticket_chat.ticket_id = id
                this.db.query('INSERT INTO ticket_chat SET ?', ticket_chat, (er, results) => {
                    if (er) {
                        return this.db.rollback(function () {
                            ticket_callback(er, null)
                        });
                    }
                    this.db.commit((error) => {
                        if (error) {
                            ticket_callback(error, null)
                        } else {
                            console.log("ticket id =", id);
                            ticket_callback(null, id)
                        }
                    });
                })//end in
            })//end out
        })
    }


    //2. craete ticket chat 
    //using core model functions
}

module.exports = SupportModel