const { RECIEVE_MESSAGE } = require("../../utils/SocketDefine")
const SupportModel = require("../../models/support/SupportModel");
const DB_Define = require("../../utils/DB_Define");
const onJoinTicket = (socket, ticket) => {
    //console.log("join " + JSON.stringify(ticket));
    if (ticket.id) {
        socket.join(ticket.id)
        // console.log("start on ticket,", ticket.id, "-socket-id:", socket.id);
    }
}

const onCreateMessage = (socket, messgae_obj) => {
    //console.log("msge->", messgae_obj);
    //store the message on database
    delete messgae_obj.id
    delete messgae_obj.created_at

    new SupportModel().addData(DB_Define.TICKET_CHAT_TABLE, messgae_obj, (err, results) => {
        if (err) {
            console.log("error: ", e);
        } else {
            messgae_obj.id = results.insertId;
            socket.to(parseInt(messgae_obj.ticket_id)).emit(RECIEVE_MESSAGE, messgae_obj)
        }
    })//end db op
}

module.exports = {
    onJoinTicket,
    onCreateMessage
}