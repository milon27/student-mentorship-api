const Model = require('../Model');

class  AoModel extends Model{
    getAoByEmail = async (table, email, callback) => {
        let sql = `SELECT * from ${table} WHERE email = ?`;
        this.db.query(sql, email, callback);
    }

}

module.exports = AoModel