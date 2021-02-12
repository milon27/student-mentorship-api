const Define = require("../utils/Define");
const Model = require("./Model");

class DbModel extends Model {
    //create db
    createDatabase(callback) {
        const title = process.env.DB
        let sql = `CREATE DATABASE IF NOT EXISTS ${title};`;
        this.db.query(sql, callback);
    }

    //create support_chat_summary
    create_support_chat_summary_table(callback) {
        const unsolved = Define.UNSOLVED
        let sql = `CREATE TABLE support_chat_summary(
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            student_id varchar(200) UNIQUE,
            subject varchar(200),
            chat_state varchar(100) DEFAULT "${unsolved}",
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;
        this.db.query(sql, callback);
    }

    //create support_chat
    create_support_chat_table(callback) {

        let sql = `CREATE TABLE support_chat(
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            student_id varchar(200),
            message varchar(200),
            sender_id varchar(200),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        this.db.query(sql, callback);
    }
}

module.exports = DbModel