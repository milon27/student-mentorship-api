/**
 * @design by milon27
 */
const bcryptjs = require('bcryptjs')
const DepartmentModel = require('../../models/department/DepartmentModel')
const Response = require('../../models/Response')
const DB_Define = require('../../utils/DB_Define')
const Define = require('../../utils/Define')
const Helper = require('../../utils/Helper')

const DepartmentController = {
    /**
     * @body {name , phone, email,  password , photo_url} =req.body
     * @param {}=req.params
     * @description  insert department information in department table
     * do validatioin
     * department already have an account or not(mySql Optional,Mongo required)
     * create password hash,save into database
     * generate a jwt access token,set into http cookie
     * return new department object as response
     * @response {error(boolean), message(String), response(object:USER)}
     */
    signUp: async (req, res) => {
        try {
            const { email, name, phone, photo_url, password } = req.body
            //validatioin
            if (!Helper.validateField(email, password, name)) {
                throw new Error("Enter all the required field!email, name, phone, photo_url, password ");
            }

            if (password.length < 6) {
                throw new Error("pass length should be atleast 6 char.")
            }
            //get hash pass & save new user into db
            const hashpass = await bcryptjs.hash(password, await bcryptjs.genSalt(10))
            const department = {
                name,
                email,
                phone: phone || Define.NOT_SET,
                photo_url: photo_url || Define.NOT_SET,
                password,
                password: hashpass
            }

            new DepartmentModel().addData(DB_Define.DEPARTMENT_TABLE, department, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    res.send(response);
                } else {
                    //get token 
                    const token = Helper.getJWTtoken(email)
                    //send token in http cookie
                    res.cookie(Define.TOKEN, token, Define.SESSION_COOKIE_OPTION)
                    delete department.password
                    department['id'] = results.insertId
                    department['token'] = token

                    res.status(200).json(new Response(false, "department created successfully", department))
                }
            });//end db

        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }

    },//end create user.

    //start login
    /**
     * @body { email, password} =req.body
     * @param {}=req.params
     * @description compare email and password and give login
     * do validatioin
     * department email exist at database  or not(mySql Optional,Mongo required)
     * compare hash password and given password
     * generate a jwt access token,set into http cookie
     * return sucessfully log in as response
     * @response {error(boolean), message(String), response(object:USER)}
     */

    login: async (req, res) => {
        try {
            const { email, password } = req.body
            //validatioin
            if (!Helper.validateField(email, password)) {
                throw new Error("Enter all the required field!")
            }


            //check department is available or not in db
            new DepartmentModel().getDepartmentByEmail(DB_Define.DEPARTMENT_TABLE, email, async (err, results) => {
                try {
                    if (err) {
                        throw err
                    } else {
                        if (results.length == 0) {
                            throw new Error("no department found with this email")
                        }
                        const department = results[0]
                        const ckPass = await bcryptjs.compare(password, department.password)
                        if (!ckPass) {
                            throw new Error("Wrong email or password")
                        }

                        //get token 
                        const token = Helper.getJWTtoken(email)
                        //send token in http cookie
                        res.cookie(Define.TOKEN, token, Define.SESSION_COOKIE_OPTION)

                        delete department.password
                        department['token'] = token
                        res.status(200).json(new Response(false, "department logged in successfully", department))
                    }
                } catch (e) {
                    let response = new Response(true, e.message, e);
                    res.send(response);
                }
            })//end db
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },//end login


    //start department logout
    /**
 * @body { } =req.body
 * @param {}=req.params
 * @description 
 * expire jwt access token
 * return logout as response
 * @response {error(boolean), message(String), response(object:USER)}
 */


    logout: (req, res) => {
        res.cookie(Define.TOKEN, "", Define.LOGOUT_COOKIE_OPTION)
        res.status(200).json(new Response(false, "department logged out", {}))
    },//department logout

    //department isLoggedIn start
    /**
 * @body { } =req.body
 * @param {}=req.params
 * @description 
 * expire jwt access token
 * return logout as response
 * @response {error(boolean), message(String), response(object:USER)}
 */

    isLoggedIn: (req, res) => {
        try {
            const token = req.cookies.token
            if (!token) {
                throw new Error("Unauthorized Access")
            }
            //token validation
            Helper.verifyJWTtoken(token)

            res.send(true)// logged in
        } catch (e) {
            //remove the old/expire token
            res.cookie(Define.TOKEN, "", Define.LOGOUT_COOKIE_OPTION)
            res.send(false)//not logged in
        }
    },//department isLoggedIn  

}

module.exports = DepartmentController