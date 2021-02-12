const express = require('express')
const DbController = require('../controllers/DbController')
const router = express.Router()

/**
 * @description 1. create the database
 * @endpoint http://localhost:2727/db/create-db
 * @example http://localhost:2727/db/create-db
 */
router.get('/create-db', DbController.createDb)
/**
 * @description 1. create the support_chat_summary table
 * @endpoint http://localhost:2727/db/create-table/support_chat_summary
 * @example http://localhost:2727/db/create-table/support_chat_summary
 */
router.get('/create-table/support_chat_summary', DbController.createSupportChatSummeryTable)
/**
 * @description 1. create the support_chat table
 * @endpoint http://localhost:2727/db/create-table/support_chat
 * @example http://localhost:2727/db/create-table/support_chat
 */
router.get('/create-table/support_chat', DbController.createSupportChatTable)


module.exports = router