/**
 * @design by milon27
 */
const express = require('express');
const cors = require('cors')
const cookieparser = require('cookie-parser')
require('dotenv').config();
const app = express();

app.use(express.urlencoded({ extended: false }));//url encode parse
app.use(express.json());//json parse
app.use(cookieparser())// parse http cookie
app.use(cors({
    origin: "*",//["http://localhost:3000/"]
    credentials: true//enable storing cookie
}));//enable cros

/**
 * @enable cookie store in front end
 * axios.post('url',{},{withCredentials:true}) or
 * axios.defaults.withCredentials=true
 */

/**
 * @routers
 */

// @description use for database create and database table create
app.use('/db', require('./routers/dbRouter'))

// @description use for support chat system @author milon27
app.use('/auth', require('./routers/authRouter'))

// @description use for support chat system @author milon27
app.use('/support', require('./routers/support/supportRouter'))

// @description use for all type of CRUD operation @author milon27
app.use('/data', require('./routers/dataRouter'));

// @description use for  student  @author rijon1810
app.use('/student', require('./routers/student/studentRouter'));

// @description use for  ao  @author rijon1810
app.use('/ao', require('./routers/ao/aoRouter'));



/**
 * @init_server
 */
const port = process.env.PORT || 2828;
app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
})