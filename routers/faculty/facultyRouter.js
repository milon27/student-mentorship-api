/**
 * @design by milon27
 */
 const express = require('express')
 const router = express.Router()
 const facultyController = require('../../controllers/faculty/FacultyController')
 
 
 /**
  * @post
  * @public
  * @description  create a new faculty 
  * @body {name:String, phone:String, email:String,  password:String, photo_url:String, add more if needed } 
  * @endpoint http://localhost:2727/faculty/signup
  * @example http://localhost:2727/faculty/signup
  */
 router.post('/signup', facultyController.signUp)
 
 /**
  * @post
  * @public
  * @description 2. login faculty
  * @param { email:String, password:String } = req.body
  * @endpoint http://localhost:2727/faculty/login
  * @example http://localhost:2727/faculty/login
  */
 router.post('/login', facultyController.login)
 
 /**
  * @public
  * @description 3. logout faculty
  * @endpoint http://localhost:2727/faculty/logout
  * @example same
  */
 router.get('/logout', facultyController.logout)
 
 /**
  * @public
  * @description 4. ck logged in or not
  * @endpoint http://localhost:2727/faculty/is-loggedin
  * @example http://localhost:2727/facultyis-loggedin
  */
 router.get('/is-loggedin', facultyController.isLoggedIn)
 
 module.exports = router