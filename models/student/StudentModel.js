const Model = require('../Model');

class StudentModel extends Model {
    getStudentByEmail = async (table, email, callback) => {
        let sql = `SELECT * from ${table} WHERE email = ?`;
        this.db.query(sql, email, callback);
    }

    getStudentSkillReport = (student_id, callback) => {
        let sql = `SELECT students.student_id,students.name,students.email,student_skill_list.skill_id,skill.title,student_skill_list.sub_skill_ids,COUNT(sub_skill.id) as total_sub_skill

from student_skill_list

inner join skill on skill.id=student_skill_list.skill_id
INNER JOIN students on students.student_id=student_skill_list.stu_id

inner JOIN sub_skill on sub_skill.skill_id=skill.id

WHERE student_skill_list.stu_id=?
GROUP by sub_skill.skill_id`;
        this.db.query(sql, student_id, callback);
    }

}

module.exports = StudentModel