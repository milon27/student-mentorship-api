/**
 * @design by milon27
 */
const express = require('express')
const router = express.Router()
const AoController = require('../../controllers/ao/AoController')


/**
 * @post
 * @public
 * @description  create a new ao 
 * @body {name:String, phone:String, email:String,  password:String, photo_url:String, add more if needed } 
 * @endpoint http://localhost:2727/ao/signup
 * @example http://localhost:2727/ao/signup
 */
router.post('/signup', AoController.signUp)

/**
 * @post
 * @public
 * @description 2. login ao
 * @param { email:String, password:String } = req.body
 * @endpoint http://localhost:2727/ao/login
 * @example http://localhost:2727/ao/login
 */
router.post('/login', AoController.login)

/**
 * @public
 * @description 3. logout ao
 * @endpoint http://localhost:2727/ao/logout
 * @example same
 */
router.get('/logout', AoController.logout)

/**
 * @public
 * @description 4. ck logged in or not
 * @endpoint http://localhost:2727/ao/is-loggedin
 * @example http://localhost:2727/ao/is-loggedin
 */
router.get('/is-loggedin', AoController.isLoggedIn)

module.exports = router