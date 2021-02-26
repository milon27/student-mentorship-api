/**
 * @design by milon27
 */
const express = require('express')
const router = express.Router()
const StudentController = require('../../controllers/student/StudentController')


/**
 * @post
 * @public
 * @description 1. create a new student 
 * @body {student_id:String,present_address : String , name:String, email:String, phone:String, parents_phone:String,  password:String, photo_url:String, add more if needed } 
 * @endpoint http://localhost:2727/student/signup
 * @example http://localhost:2727/student/signup
 */
router.post('/signup', StudentController.signUp)

/**
 * @post
 * @public
 * @description 2. login student
 * @param { email:String, password:String } = req.body
 * @endpoint http://localhost:2727/student/login
 * @example http://localhost:2727/student/login
 */
router.post('/login', StudentController.login)

/**
 * @public
 * @description 3. logout student
 * @endpoint http://localhost:2727/student/logout
 * @example same
 */
router.get('/logout', StudentController.logout)

/**
 * @public
 * @description 4. ck logged in or not
 * @endpoint http://localhost:2727/student/is-loggedin
 * @example http://localhost:2727/student/is-loggedin
 */
router.get('/is-loggedin', StudentController.isLoggedIn)

module.exports = router