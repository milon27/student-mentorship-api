const Model = require('../Model');

class  StudentModel extends Model{
    getStudentByEmail = async (table, email, callback) => {
        let sql = `SELECT * from ${table} WHERE email = ?`;
        this.db.query(sql, email, callback);
    }

}

module.exports = StudentModel