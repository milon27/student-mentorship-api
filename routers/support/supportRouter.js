/**
 * @design by milon27
 */
const express = require('express')
const SupportController = require('../../controllers/support/SupportController')
const router = express.Router()

//make this router private here
//router.use()

/**
 * @post
 * @private
 * @description 1. create-ticket insert (ticket title on ticket table + 1st message on ticket_chat table)
 * @body {student_id,ticket_title,assigned_user_id,first_message}=req.body
 * @endpoint http://localhost:2727/support/create-ticket
 */
router.post('/create-ticket', SupportController.create_ticket)

/**
 * @private
 * @description 2. create-message insert ( message on ticket_chat table)
 * @body {ticket_id, message, img_url(Optional), sender_id}=req.body
 * @endpoint http://localhost:2727/support/create-message
 */
router.post('/create-message', SupportController.create_message)

/**
 * @private
 * @description 3.get all tickets/message/anything based on field
 * @param {table} ticket,ticket_chat
 * @param {field} {ticket_state,student_id} and {ticket_id}
 * @param {value} (pending,completed,processing,snoozed),(17303024),(3)
 * @param {page_no} 1,2,3,4
 * @endpoint http://localhost:2727/support/get/:table/:field/:value/:page_no
 * @example for a/o=http://localhost:2727/support/get/ticket/ticket_state/unsolved/1
 * @example for student=http://localhost:2727/support/get/ticket/student_id/17303024/1
 * @example for all chat list=http://localhost:2727/support/get/ticket_chat/ticket_id/3/1
 */
router.get('/get/:table/:field/:value/:page_no', SupportController.getByField_P)


/**
 * @private
 * @description 5.update ticket_state
 * @param {id} ticket_id
 * @body {ticket_state} (pending,completed,processing,snoozed)
 * @endpoint http://localhost:2727/support/update-ticket/:id
 * @example http://localhost:2727/support/update-ticket/3
 */
router.put('/update-ticket/:id', SupportController.updateTicket)

/**
 * @description 6.seach ticket by id or title
 * @param {text} search text
 * @body {}
 * @endpoint http://localhost:2727/support/search/:text
 * @example http://localhost:2727/support/search/17303024
 */
router.get('/search/:text', SupportController.searchTicket)
/**
 * @description 6.seach ticket by id or title
 * @param {text} search text
 * @body {}
 * @endpoint http://localhost:2727/support/search-message/:text
 * @example http://localhost:2727/support/search-message/17303024
 */
router.get('/search-message/:text', SupportController.searchTicketChat)



module.exports = router