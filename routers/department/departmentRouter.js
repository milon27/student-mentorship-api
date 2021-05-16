/**
 * @design by milon27
 */
 const express = require('express')
 const router = express.Router()
 const DepartmentController = require('../../controllers/department/DepartmentController')
 
 
 /**
  * @post
  * @public
  * @description  create a new department 
  * @body {name:String, phone:String, email:String,  password:String, photo_url:String, add more if needed } 
  * @endpoint http://localhost:2727/department/signup
  * @example http://localhost:2727/department/signup
  */
 router.post('/signup', DepartmentController.signUp)
 
 /**
  * @post
  * @public
  * @description 2. login department
  * @param { email:String, password:String } = req.body
  * @endpoint http://localhost:2727/department/login
  * @example http://localhost:2727/department/login
  */
 router.post('/login', DepartmentController.login)
 
 /**
  * @public
  * @description 3. logout department
  * @endpoint http://localhost:2727/department/logout
  * @example same
  */
 router.get('/logout', DepartmentController.logout)
 
 /**
  * @public
  * @description 4. ck logged in or not
  * @endpoint http://localhost:2727/department/is-loggedin
  * @example http://localhost:2727/department/is-loggedin
  */
 router.get('/is-loggedin', DepartmentController.isLoggedIn)
 
 module.exports = router