const { onJoinTicket, onCreateMessage } = require("./support/SupportSocket");
const SocketDefine = require("../utils/SocketDefine");

const onConnected = (socket) => {
    //start
    //console.log(`user-${socket.id} connected`);
    //student ao ticket support
    socket.on(SocketDefine.JOIN_TICKET, onJoinTicket.bind(this, socket))
    socket.on(SocketDefine.CREATE_MESSAGE, onCreateMessage.bind(this, socket))
    //end
    socket.on(SocketDefine.DISCONNECT, () => console.log(`user-${socket.id} disconnected`));
}

module.exports = onConnected