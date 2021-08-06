/**
 * @design by milon27
 */
const express = require('express')
const Controller = require('../../controllers/Controller')
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
 * @get
 * @public
 * @description 3. logout student
 * @endpoint http://localhost:2727/student/logout
 * @example same
 */
router.get('/logout', StudentController.logout)

/**
 * @get
 * @public
 * @description 4. ck logged in or not
 * @endpoint http://localhost:2727/student/is-loggedin
 * @example http://localhost:2727/student/is-loggedin
 */
router.get('/is-loggedin', StudentController.isLoggedIn)

//table, field, value
//http://localhost:2727/student/get-one/:table/:field/:value
//http://localhost:2727/student/get-one/student/stu_id/17303023
router.get('/get-one/:table/:field/:value', Controller.common_get)


/**
 * @get
 * @public
 * @description 5. email verify
 * @endpoint http://localhost:2727/student/get-link/:id/:email
 * @endpoint http://localhost:2727/student/verify/:id
 */
router.get('/get-link/:id/:email', StudentController.getVerifyLink)
router.get('/verify/:id', StudentController.emailVerify)

module.exports = router