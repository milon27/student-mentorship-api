const DB_Define = require("../../utils/DB_Define");
const Define = require("../../utils/Define");
const Model = require("./../Model");

class DbModel extends Model {
    //create db
    createDatabase(callback) {
        const title = process.env.DB
        let sql = `CREATE DATABASE IF NOT EXISTS ${title};`;
        this.db.query(sql, callback);
    }

    test(callback) {
        this.db.query(`show status where variable_name = 'Threads_connected';`, callback)
    }

    //create TICKET_TABLE
    create_ticket_table(callback) {
        const pending = Define.PENDING_TICKET
        const table_name = DB_Define.TICKET_TABLE
        let sql = `CREATE TABLE ${table_name}(
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            student_id varchar(200),
            ticket_title varchar(200),
            ticket_dept varchar(200),
            assigned_user_id varchar(200) DEFAULT "${Define.NOT_SET}",
            ticket_state varchar(100) DEFAULT "${pending}",
            reschedule_reason varchar(200) DEFAULT "${Define.NOT_SET}",
            reschedule_date TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (student_id,assigned_user_id)
        );`;
        this.db.query(sql, callback);
    }

    //create ticket_chat
    create_ticket_chat_table(callback) {
        const table_name = DB_Define.TICKET_CHAT_TABLE
        let sql = `CREATE TABLE ${table_name}(
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            ticket_id varchar(200),
            message varchar(200),
            img_url varchar(200) DEFAULT "${Define.NOT_SET}",
            sender_id varchar(200),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (ticket_id)
        );`;

        this.db.query(sql, callback);
    }

    //create sample user table 
    create_user_table(callback) {
        const table_name = "users"
        let sql = `CREATE TABLE ${table_name}(
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            email varchar(200) UNIQUE,
            name varchar(200),
            pass varchar(200),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        this.db.query(sql, callback);
    }

    //create students table 
    create_student_table(callback) {
        const table_name = DB_Define.STUDENT_TABLE
        let sql = `CREATE TABLE ${table_name}(
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            student_id varchar(200) UNIQUE,
            email varchar(200) UNIQUE,
            present_address varchar(200),
            name varchar(200),
            parents_phone varchar(200),
            password varchar(200),
            phone varchar(200),
            photo_url varchar(200),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        this.db.query(sql, callback);
    }

    //create ao table 
    create_ao_table(callback) {
        const table_name = DB_Define.AO_TABLE
        let sql = `CREATE TABLE ${table_name}(
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            email varchar(200) UNIQUE,
            name varchar(200),
            password varchar(200),
            phone varchar(200),
            photo_url varchar(200),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        this.db.query(sql, callback);
    }

    //create department table 
    create_department_table(callback) {
        const table_name = DB_Define.DEPARTMENT_TABLE
        let sql = `CREATE TABLE ${table_name}(
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            email varchar(200) UNIQUE,
            password varchar(200),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        this.db.query(sql, callback);
    }

    //create todo table
    create_todo_table(callback) {
        const table_name = DB_Define.TODO_TABLE
        let sql = `CREATE TABLE ${table_name}(
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            title varchar(200),
            is_done TINYINT,
            feedback varchar(200) DEFAULT "",
            dead_line TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (user_id)
        );`;

        this.db.query(sql, callback);
    }

}

module.exports = DbModel