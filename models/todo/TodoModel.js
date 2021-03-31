const Model = require("../Model");

class TodoModel extends Model {
    //get all data from a table in filter by a field and order by field
    getAllByFilter = async (table, field, value, field2, value2, order_field, callback) => {
        let sql = `SELECT * from ?? WHERE ?? =? AND ?? =? ORDER BY ?? DESC`;
        this.db.query(sql, [table, field, value, field2, value2, order_field], callback);
    }
    //get All todo UnDone Upto N Days
    getAllUnDoneUptoNDays = async (table, user_id, date_field, value, order_field, callback) => {
        let sql = `SELECT * FROM ?? WHERE user_id=? and is_done=0 and ?? BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL ${value} DAY) ORDER BY ?? DESC`;
        this.db.query(sql, [table, user_id, date_field, order_field], callback);
    }



}


module.exports = TodoModel