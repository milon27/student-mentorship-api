const Model = require('../Model');

class  DepartmentModel extends Model{
    getDepartmentByEmail = async (table, email, callback) => {
        let sql = `SELECT * from ${table} WHERE email = ?`;
        this.db.query(sql, email, callback);
    }

}

module.exports = DepartmentModel