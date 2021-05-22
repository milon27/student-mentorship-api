/**
 * @design by milon27
 */
const express = require('express')
const NoticeController = require('../../controllers/notice/NoticeController')
const auth_cookie = require('../middleware/authMiddleware')
const router = express.Router()

//make all the route private
router.use(auth_cookie)

/**
 * @post
 * @private 
 * @description 1. create notice
 * @body {publisher_id, title,description}
 * @endpoint http://localhost:2727/notice/create
 * @example http://localhost:2727/notice/create
 */
router.post('/create', NoticeController.createNotice)


/**
 * @put
 * @private 
 * @description 2. update notice
 * @param {id} notice id
 * @body {title,description} todo complete feedback
 * @endpoint http://localhost:2727/notice/:id
 * @example http://localhost:2727/notice/4
 */
router.put('/:id', NoticeController.updateNotice)

/**
 * @delete
 * @private 
 * @description 3.delete notice
 * @param {id} notice id
 * @endpoint http://localhost:2727/notice/:id
 * @example http://localhost:2727/notice/4
 */
router.delete('/:id', NoticeController.deleteNotice)

/**
 * @get
 * @private 
 * @description 4. get-all notice by paginate
 * @param {page_no}
 * @endpoint http://localhost:2727/notice/get-all/:page_no
 * @example http://localhost:2727/notice/get-all/1
 */
router.get('/get-all/:page_no', NoticeController.getAll)

/**
 * @get
 * @private 
 * @description 5. get 7 recent notice
 * @endpoint http://localhost:2727/notice/get-recent/:num
 * @example http://localhost:2727/notice/get-recent/7
 */
router.get('/get-recent/:num', NoticeController.getRecent)

module.exports = router