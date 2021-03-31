/**
 * @design by milon27
 */
const express = require('express')
const TodoController = require('../../controllers/todo/TodoController')
const auth_cookie = require('../middleware/authMiddleware')
const router = express.Router()

//make all the route private
router.use(auth_cookie)

/**
 * @post
 * @private 
 * @description 1. create todo
 * @body {user_id, title, dead_line}
 * @endpoint http://localhost:2727/todo/create
 * @example http://localhost:2727/todo/create
 */
router.post('/create', TodoController.createTodo)


/**
 * @put
 * @private 
 * @description 2. mark as done the todo
 * @param {id} todo id
 * @body {feedback} todo complete feedback
 * @endpoint http://localhost:2727/todo/:id
 * @example http://localhost:2727/todo/4
 */
router.put('/:id', TodoController.updateTodo)

/**
 * @delete
 * @private 
 * @description 3.delete todo
 * @param {id} todo id
 * @endpoint http://localhost:2727/todo/:id
 * @example http://localhost:2727/todo/4
 */
router.delete('/:id', TodoController.deleteTodo)

/**
 * @get
 * @private 
 * @description 4. get todo by user and [completed{is_done:1} or in-progress{is_done:0}]
 * @param {user_id,id_done}
 * @endpoint http://localhost:2727/todo/:user_id/:is_done
 * @example http://localhost:2727/todo/1/1 //completed
 * @example http://localhost:2727/todo/1/0 //in-progress
 */
router.get('/:user_id/:is_done', TodoController.getTodoByType)

/**
 * @get
 * @private 
 * @description 5. get todo by user upto next 7 days and [completed{is_done:1} or in-progress{is_done:0}]
 * @param {user_id}
 * @endpoint http://localhost:2727/todo/upto/:day/:user_id
 * @example http://localhost:2727/todo/upto/7/6 //next 7 day for user id 6
 */
router.get('/upto/:day/:user_id', TodoController.getAllUnDoneUptoNDays)

module.exports = router