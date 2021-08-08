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
 * @private (not used in any client app)
 * @post
 * @description 2. create-message insert ( message on ticket_chat table)
 * @body {ticket_id, message, img_url(Optional), sender_id}=req.body
 * @endpoint http://localhost:2727/support/create-message
 */
router.post('/create-message', SupportController.create_message)

/**
 * @private
 * @description 3.get one ticket/message/anything based on field(id)
 * @param {table} ticket
 * @param {field} {id}//ticket id
 * @param {value} (7)
 * @endpoint http://localhost:2727/support/get-one/:table/:field/:value/
 * @example for get single ticket =http://localhost:2727/support/get-one/ticket/id/7/
 */
router.get('/get-one/:table/:field/:value/', SupportController.getOneTicket)


/**
 * @private
 * @description 4.get all tickets/message/anything based on field (with pagination)
 * @param {table} ticket,ticket_chat
 * @param {field} {ticket_state,student_id} and {ticket_id}
 * @param {value} (pending,completed,processing,snoozed),(17303024),(3)
 * @param {page_no} 1,2,3,4
 * @endpoint http://localhost:2727/support/get/:table/:field/:value/:page_no
 * @example for a/o=http://localhost:2727/support/get/ticket/ticket_state/pending/1
 * @example for student=http://localhost:2727/support/get/ticket/student_id/17303024/1
 * @example for all chat list=http://localhost:2727/support/get/ticket_chat/ticket_id/3/1
 */
router.get('/get/:table/:field/:value/:page_no', SupportController.getByField_P)



/**
 * @private
 * @description 4.1 (with extra filter).get all tickets/message/anything based on field (with pagination)
 * @param {table} ticket,ticket_chat
 * @param {field,field2} {ticket_state,student_id} and {ticket_id}
 * @param {value,value2} (pending,completed,processing,snoozed),(17303024),(3)
 * @param {page_no} 1,2,3,4
 * @endpoint http://localhost:2727/support/get/:table/:field/:value/:page_no
 * @example for a/o=http://localhost:2727/support/get/ticket/ticket_state/pending/1
 * @example for student=http://localhost:2727/support/get/ticket/student_id/17303024/1
 * @example for all chat list=http://localhost:2727/support/get/ticket_chat/ticket_id/3/1
 */
router.get('/get/:table/:field/:value/:field2/:value2/:page_no', SupportController.getByField_P)


/**
 * @private
 * @description 5.get all tickets/message/anything based on field (no Pagination)
 * @param {table} ticket,ticket_chat
 * @param {field} {ticket_state,student_id} and {ticket_id}
 * @param {value} (pending,completed,processing,snoozed),(17303024),(3)
 * @endpoint http://localhost:2727/support/get/:table/:field/:value/
 * @example for a/o=http://localhost:2727/support/get/ticket/ticket_state/pending/
 * @example for student=http://localhost:2727/support/get/ticket/student_id/17303024/
 * @example for all chat list=http://localhost:2727/support/get/ticket_chat/ticket_id/3/
 */
router.get('/get/:table/:field/:value/', SupportController.getByField_NP)



/**
 * @private
 * @description 6.update ticket_state
 * @param {id} ticket_id
 * @body {ticket_state} (pending,completed,processing,snoozed)
 * @endpoint http://localhost:2727/support/update-ticket/:id
 * @example http://localhost:2727/support/update-ticket/3
 */
router.put('/update-ticket/:id', SupportController.updateTicket)


//search

/**
 * @description 7.seach ticket by student id or title
 * @param {text,id} search text and AO id
 * @body {}
 * @endpoint http://localhost:2727/support/search/:text/:id
 * @example http://localhost:2727/support/search/17303024/2
 */
router.get('/search/:text/:id', SupportController.searchTicket)
/**
 * @description 8.search text on a specific ticket chat
 * @param {text,ticket_id} search text,on a specific ticket chat
 * @body {}
 * @endpoint http://localhost:2727/support/search-message/:ticket_id/:text
 * @example http://localhost:2727/support/search-message/2/first
 */
router.get('/search-message/:ticket_id/:text', SupportController.searchTicketChat)

/**
 * @description get ticket summary (total ticket in each state)
 * @param {ao id,student id}
 * @param {type}=studnet summery or ao summnery
 * @endpoint http://localhost:2727/support/summary/:type/:id
 * @example http://localhost:2727/support/summary/student/17303023
 * @example http://localhost:2727/support/summary/ao/2
 * @example http://localhost:2727/support/summary/dept/2021-02-24(date)
 */
router.get('/summary/:type/:id', SupportController.getTicketSummary)



/**
 * used as report generation
 * @description get ticket assign summary (start date as param)
 * @endpoint http://localhost:2727/support/ticket-summery-report/:date
 */
router.get('/ticket-summery-report/:date', SupportController.getTicketSummeryList)

/**
 * used as report generation
 * @description get ticket assign summary (start date as param)
 * @endpoint http://localhost:2727/support/ticket-assign-summery/:date
 */
router.get('/ticket-assign-summery/:date', SupportController.getTicketAssignSummery)

module.exports = router