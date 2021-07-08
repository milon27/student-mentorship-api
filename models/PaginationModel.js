const Define = require("../utils/Define");
const Model = require("./Model");
const Response = require("./Response");
/**
 * promise based pagination model class
 */
class PaginationModel extends Model {
    //start
    p_paginate(table, page_num, order_field) {
        order_field = order_field || Define.CREATED_AT

        const page_size = Define.PAGINATE_PAGE_SIZE;
        let skip = (page_num - 1) * page_size;
        this.p_init_sql = `SELECT * from ${table} `
        this.p_where_clause = ""
        this.p_end_sql = `ORDER BY ?? DESC LIMIT ? OFFSET ?`

        //let sql = `SELECT * from ${table} ${this.p_where_clause} ORDER BY ?? DESC LIMIT ? OFFSET ?`;
        this.p_options = [order_field, page_size, skip]
        return this
    }
    p_where(condition, value) {
        if (this.p_where_clause.length < 3) {
            this.p_where_clause += `WHERE ${condition}=${value} `
        } else {
            this.p_where_clause += `AND ${condition}=${value} `
        }
        return this
    }
    p_get() {
        return new Promise((resolve, reject) => {
            let sql = this.p_init_sql + this.p_where_clause + this.p_end_sql + ""

            this.db.query(sql, this.p_options, (err, results) => {
                if (err) {
                    return resolve(new Response(true, err.message, err))
                }
                if (results.length > 0) {
                    return resolve(new Response(false, "Paginate Data Successfully", results))
                } else {
                    return resolve(new Response(true, "No Data Found", []))
                }
            });
        })//end promise
    }

    //start with the pagination & default controller.

    //new Model().paginate(table, page_num).where("", "").where("", "").get()
}

module.exports = PaginationModel