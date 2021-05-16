/**
 * @design by milon27
 */
const bcryptjs = require('bcryptjs')
const AoModel = require('../../models/ao/AoModel')
const Response = require('../../models/Response')
const DB_Define = require('../../utils/DB_Define')
const Define = require('../../utils/Define')
const Helper = require('../../utils/Helper')

const AoController = {
    /**
     * @body {name , phone, email,  password , photo_url} =req.body
     * @param {}=req.params
     * @description  insert ao information in ao table
     * do validatioin
     * ao already have an account or not(mySql Optional,Mongo required)
     * create password hash,save into database
     * generate a jwt access token,set into http cookie
     * return new ao object as response
     * @response {error(boolean), message(String), response(object:USER)}
     */
    signUp: async (req, res) => {
        try {
            const { name, phone, email, password, photo_url } = req.body
            //validatioin
            if (!Helper.validateField(name, phone, email, password, photo_url)) {
                throw new Error("Enter all the required field!");
            }

            if (password.length < 6) {
                throw new Error("pass length should be atleast 6 char.")
            }
            //get hash pass & save new user into db
            const hashpass = await bcryptjs.hash(password, await bcryptjs.genSalt(10))
            const ao = {
                name,
                phone,
                email,
                password,
                photo_url,
                password: hashpass
            }

            new AoModel().addData(DB_Define.AO_TABLE, ao, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    res.send(response);
                } else {
                    //get token 
                    const token = Helper.getJWTtoken(email)
                    //send token in http cookie
                    res.cookie(Define.TOKEN, token, Define.SESSION_COOKIE_OPTION)
                    delete ao.password
                    ao['id'] = results.insertId
                    ao['token'] = token

                    res.status(200).json(new Response(false, "ao created successfully", ao))
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
     * ao email exist at database  or not(mySql Optional,Mongo required)
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


            //check ao is available or not in db
            new AoModel().getAoByEmail(DB_Define.AO_TABLE, email, async (err, results) => {
                try {
                    if (err) {
                        throw err
                    } else {
                        if (results.length == 0) {
                            throw new Error("no ao found with this email")
                        }
                        const ao = results[0]
                        const ckPass = await bcryptjs.compare(password, ao.password)
                        if (!ckPass) {
                            throw new Error("Wrong email or password")
                        }

                        //get token 
                        const token = Helper.getJWTtoken(email)
                        //send token in http cookie
                        res.cookie(Define.TOKEN, token, Define.SESSION_COOKIE_OPTION)

                        delete ao.password
                        ao['token'] = token
                        res.status(200).json(new Response(false, "ao logged in successfully", ao))
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


    //start ao logout
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
        res.status(200).json(new Response(false, "ao logged out", {}))
    },//ao logout

    //ao isLoggedIn start
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
    },//ao isLoggedIn  

}

module.exports = AoController