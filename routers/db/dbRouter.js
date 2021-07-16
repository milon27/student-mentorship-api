const express = require('express')
const DbController = require('../../controllers/db/DbController')
const router = express.Router()

router.get('/test', DbController.test)

/**
 * @description 1. create the database
 * @endpoint http://localhost:2727/db/create-db
 * @example http://localhost:2727/db/create-db
 */
router.get('/create-db', DbController.createDb)
/**
 * @description 2. create the ticket table
 * @endpoint http://localhost:2727/db/create-table/ticket
 * @example http://localhost:2727/db/create-table/ticket
 */
router.get('/create-table/ticket', DbController.createTicketTable)
/**
 * @description 3. create the ticket_chat table
 * @endpoint http://localhost:2727/db/create-table/ticket_chat
 * @example http://localhost:2727/db/create-table/ticket_chat
 */
router.get('/create-table/ticket_chat', DbController.createTicketChatTable)

/**
 * @description 4. create the ticket_chat table
 * @endpoint http://localhost:2727/db/create-table/users
 * @example http://localhost:2727/db/create-table/users
 */
router.get('/create-table/users', DbController.createUserTable)


/**
 * @description 5. create the student
 * @endpoint http://localhost:2727/db/create-table/students
 * @example http://localhost:2727/db/create-table/students
 */
router.get('/create-table/students', DbController.createStudentTable)


/**
 * @description 6. create the ao
 * @endpoint http://localhost:2727/db/create-table/ao
 * @example http://localhost:2727/db/create-table/ao
 */
router.get('/create-table/ao', DbController.createAoTable)


/**
 * @description 7. create the department
 * @endpoint http://localhost:2727/db/create-table/department
 * @example http://localhost:2727/db/create-table/department
 */
router.get('/create-table/department', DbController.createDepartmentTable)

/**
 * @description 8. create the faculty
 * @endpoint http://localhost:2727/db/create-table/faculty
 * @example http://localhost:2727/db/create-table/faculty
 */
router.get('/create-table/faculty', DbController.createFacultyTable)
/**
 * @description 9. create Todo table
 * @endpoint http://localhost:2727/db/create-table/todo
 * @example http://localhost:2727/db/create-table/todo
 */
router.get('/create-table/todo', DbController.createTodoTable)

/**
 * @description 10. create Notice table
 * @endpoint http://localhost:2727/db/create-table/notice
 * @example http://localhost:2727/db/create-table/notice
 */
router.get('/create-table/notice', DbController.createNoticeTable)

/**
 * @description 11. create skill table
 * @endpoint http://localhost:2727/db/create-table/skill
 * @example http://localhost:2727/db/create-table/skill
 */
router.get('/create-table/skill', DbController.createSkillTable)

/**
 * @description 11. create sub-skill table
 * @endpoint http://localhost:2727/db/create-table/sub-skill
 * @example http://localhost:2727/db/create-table/sub-skill
 */
router.get('/create-table/sub-skill', DbController.createSubSkillTable)

/**
 * @description 11. create question table
 * @endpoint http://localhost:2727/db/create-table/question
 * @example http://localhost:2727/db/create-table/question
 */
router.get('/create-table/question', DbController.createQuestionsTable)

/**
 * @description 12. create StudentSkillList table
 * @endpoint http://localhost:2727/db/create-table/student_skill_list
 * @example http://localhost:2727/db/create-table/student_skill_list
 */
router.get('/create-table/student_skill_list', DbController.createStudentSkillListTable)

module.exports = router