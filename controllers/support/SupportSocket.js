const { RECIEVE_MESSAGE } = require("../../utils/SocketDefine")
const axios = require('axios');
const Define = require("../../utils/Define");
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
    axios.defaults.baseURL = Define.API_BASE_URL
    axios.post('support/create-message', messgae_obj).then(res => {
        //get and emit recieve message event
        //send that to all room member

        if (!res.data.error) {
            socket.to(parseInt(messgae_obj.ticket_id)).emit(RECIEVE_MESSAGE, res.data.response)
        }
    }).catch(e => {
        console.log(e);
    })

}

module.exports = {
    onJoinTicket,
    onCreateMessage
}