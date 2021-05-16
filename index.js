/**
 * @design by milon27
 */
const express = require('express');
const cors = require('cors')
const cookieparser = require('cookie-parser');
const onConnected = require('./socket/main');
require('dotenv').config();
const app = express();

app.use(express.urlencoded({ extended: false }));//url encode parse
app.use(express.json());//json parse
app.use(cookieparser())// parse http cookie
app.use(cors({ origin: true, credentials: true }))//enable cros

/**
 * @enable cookie store in front end
 * axios.defaults.withCredentials=true
 */

/**
 * @routers
 */

app.get('/', (req, res) => {
    res.send("working...")
})


// sample code start here
// @description use for support chat system @author milon27
app.use('/auth', require('./routers/sample/authRouter'))
// @description use for all type of CRUD operation @author milon27
app.use('/data', require('./routers/sample/dataRouter'));
// sample code end here

// @description use for database create and database table create
app.use('/db', require('./routers/db/dbRouter'))

// @description use for support chat system @author milon27
app.use('/support', require('./routers/support/supportRouter'))

// @description use for  student  @author rijon1810
app.use('/student', require('./routers/student/studentRouter'));

// @description use for  ao  @author rijon1810
app.use('/ao', require('./routers/ao/aoRouter'));

// @description use for  department  @author rijon1810
app.use('/department', require('./routers/department/departmentRouter'));

// @description use for todo  @author milon27
app.use('/todo', require('./routers/todo/todoRouter'));

// @description use for  ao  @author rijon1810
app.use('/faculty', require('./routers/faculty/facultyRouter'));


/**
 * @init_server
 */
const port = process.env.PORT || 2828;
const server = app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
})


//create the socket-io
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', onConnected)