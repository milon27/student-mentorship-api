/**
 * @design by milon27
 */

const express = require('express');
const cors = require('cors')
require('dotenv').config();

const app = express();
//url encode + json encode
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//enable cros 
app.use(cors());


/**
 * @description use for all type of CRUD operation
 * @author milon27
 */
app.use('/data', require('./routers/dataRouter'));

/**
 * @description use for database create and database table create
 */
app.use('/db', require('./routers/dbRouter'))


/**
 * @description use for support chat system
 * @author milon27
 */
app.use('/support', require('./routers/supportRouter'))



const port = process.env.PORT || 2828;
app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
})