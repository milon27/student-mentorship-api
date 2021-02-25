/**
 * @design by milon27
 */
const express = require('express')
const SupportController = require('../controllers/SupportController')
const router = express.Router()

//make this router private here
//router.use()

/**
 * @description 1. create-ticket insert (ticket title on ticket talbe + 1st message on ticket_chat table)
 * @body {student_id,ticket_title,assigned_user_id,first_message}=req.body
 * @endpoint http://localhost:2727/support/create-ticket
 */
router.post('/create-ticket', SupportController.create_ticket)

/**
 * @description 2. create-message insert ( message on ticket_chat table)
 * @body {ticket_id,sender_id,message}=req.body
 * @endpoint http://localhost:2727/support/create-message
 */
router.post('/create-message', SupportController.create_message)

/**
 * @description 3.get all tickets based on ticket_state
 * @param ticket_state (unsolved,solved,processing,snooze)
 * @endpoint http://localhost:2727/support/tickts/:ticket_state
 * @example http://localhost:2727/support/tickts/unsolved
 */
router.get('/tickts/:ticket_state', SupportController.getTickets)


module.exports = router