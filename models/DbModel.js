const DB_Define = require("../utils/DB_Define");
const Define = require("../utils/Define");
const Model = require("./Model");

class DbModel extends Model {
    //create db
    createDatabase(callback) {
        const title = process.env.DB
        let sql = `CREATE DATABASE IF NOT EXISTS ${title};`;
        this.db.query(sql, callback);
    }

    //create TICKET_TABLE
    create_ticket_table(callback) {
        const unsolved = Define.UNSOLVED_TICKET
        const table_name = DB_Define.TICKET_TABLE
        let sql = `CREATE TABLE ${table_name}(
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            student_id varchar(200),
            ticket_title varchar(200),
            assigned_user_id varchar(200),
            ticket_state varchar(100) DEFAULT "${unsolved}",
            reschedule_date TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;
        this.db.query(sql, callback);
    }

    //create ticket_chat
    create_ticket_chat_table(callback) {
        const table_name = DB_Define.TICKET_CHAT_TABLE
        let sql = `CREATE TABLE ${table_name}(
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            ticket_id varchar(200),
            message varchar(200),
            sender_id varchar(200),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        this.db.query(sql, callback);
    }

    //create sample user table 
    create_user_table(callback) {
        const table_name = "users"
        let sql = `CREATE TABLE ${table_name}(
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            email varchar(200),
            name varchar(200),
            pass varchar(200),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        this.db.query(sql, callback);
    }
}

module.exports = DbModel