const Model = require('../Model');

class  FacultyModel extends Model{
    getFacultyByEmail = async (table, email, callback) => {
        let sql = `SELECT * from ${table} WHERE email = ?`;
        this.db.query(sql, email, callback);
    }

}

module.exports = FacultyModel