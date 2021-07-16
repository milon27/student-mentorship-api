const Model = require("../models/Model")
const PaginationModel = require("../models/PaginationModel")
const Response = require("../models/Response")
const Define = require("../utils/Define")

const Controller = {
    //add(post)
    common_add: (req, res) => {
        const { table } = req.params
        const obj = req.body
        try {
            //inset into db
            new Model().addData(table, obj, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    return res.send(response);
                }
                obj.id = results.insertId
                let response = new Response(false, "New Object Created Succesfully", obj);
                res.send(response);
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },
    //update(put)
    common_update: (req, res) => {
        const { table, field, value } = req.params//mostly(id,4)
        const obj = req.body

        try {
            new Model().updateByField(table, obj, field, value, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    return res.send(response);
                }
                obj[field] = value
                let response = new Response(false, "Object Updated Succesfully", obj);
                res.send(response);
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }

    },
    //delete
    common_delete: (req, res) => {
        const { table, field, value } = req.params//mostly(id,4)

        try {
            new Model().deleteByField(table, field, value, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    return res.send(response);
                }
                let a = { [field]: value }
                let response = new Response(false, "Object deleted Succesfully", a);
                res.send(response);
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },

    //get
    common_get: async (req, res) => {
        const { table, field, value } = req.params
        try {
            new Model().getOne(table, field, value, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    return res.send(response);
                }
                if (results && results.length > 0) {
                    let response = new Response(false, "Object get Successfully", results[0]);
                    res.status(200).send(response);
                } else {
                    let response = new Response(true, "Object Not Found", {});
                    res.status(200).send(response);
                }
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },
    //get all by field
    common_get_all_by_field: async (req, res) => {
        const { table, field, value } = req.params
        try {
            new Model().getAllByField(table, field, value, Define.CREATED_AT, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    return res.send(response);
                }
                if (results && results.length > 0) {
                    let response = new Response(false, "List get Successfully", results);
                    res.status(200).send(response);
                } else {
                    let response = new Response(true, "List Not Found", []);
                    res.status(200).send(response);
                }
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },
    //get-all(get)
    common_get_all: async (req, res) => {
        const { table } = req.params
        try {
            new Model().getAll(table, Define.CREATED_AT, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    return res.send(response);
                }
                if (results && results.length > 0) {
                    let response = new Response(false, "List get Successfully", results);
                    res.status(200).send(response);
                } else {
                    let response = new Response(true, "List Not Found", []);
                    res.status(200).send(response);
                }
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },
    //get random row(10,15)
    common_get_random: async (req, res) => {
        const { table, limit } = req.params
        try {
            new Model().getRandom(table, limit, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    return res.send(response);
                }
                if (results && results.length > 0) {
                    let response = new Response(false, "List get Successfully", results);
                    res.status(200).send(response);
                } else {
                    let response = new Response(true, "List Not Found", []);
                    res.status(200).send(response);
                }
            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },
    //get-paginate-all
    common_get_all_paginate: async (req, res) => {
        const { table, page } = req.params
        const { c_field, c_value } = req.body
        try {//if we have condition
            if (c_field) {
                console.log(c_field, c_value);
                const obj_res = await new PaginationModel().p_paginate(table, page).p_where(c_field, c_value).p_get()
                res.send(obj_res)
            } else {////if we dont have condition
                const obj_res = await new PaginationModel().p_paginate(table, page).p_get()
                res.send(obj_res)
            }
        } catch (e) {
            res.send(new Response(true, e.message, e))
        }
    },
}

module.exports = Controller