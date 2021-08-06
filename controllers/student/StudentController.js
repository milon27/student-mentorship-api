/**
 * @design by milon27
 */
const bcryptjs = require('bcryptjs')

const StudentModel = require('../../models/student/StudentModel')
const Response = require('../../models/Response')
const DB_Define = require('../../utils/DB_Define')
const Define = require('../../utils/Define')
const Helper = require('../../utils/Helper')

const StudentController = {
    /**
     * @body { student_id, name , present_address, email, phone, parents_phone ,   password, photo_url} =req.body
     * @param {}=req.params
     * @description  insert student information in student table
     * do validatioin
     * student already have an account or not(mySql Optional,Mongo required)
     * create password hash,save into database
     * generate a jwt access token,set into http cookie
     * return new student object as response
     * @response {error(boolean), message(String), response(object:USER)}
     */
    signUp: async (req, res) => {
        try {
            const { student_id, name, present_address, email, phone, parents_phone, password, photo_url } = req.body
            //validatioin
            if (!Helper.validateField(student_id, name, present_address, email, phone, parents_phone, password, photo_url)) {
                throw new Error("Enter all the required field!");
            }

            if (password.length < 6) {
                throw new Error("pass length should be atleast 6 char.")
            }
            //get hash pass & save new user into db
            const hashpass = await bcryptjs.hash(password, await bcryptjs.genSalt(10))
            const student = {
                student_id,
                present_address,
                name,
                email,
                phone,
                parents_phone,
                photo_url,
                password: hashpass
            }

            new StudentModel().addData(DB_Define.STUDENT_TABLE, student, (err, results) => {
                if (err) {
                    let response = new Response(true, err.message, err);
                    res.send(response);
                } else {
                    //get token 
                    const token = Helper.getJWTtoken(email)
                    //send token in http cookie
                    res.cookie(Define.TOKEN, token, Define.SESSION_COOKIE_OPTION)

                    delete student.pass
                    student['id'] = results.insertId
                    student['token'] = token

                    res.status(200).json(new Response(false, "student created successfully", student))
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
     * student email exist at database  or not(mySql Optional,Mongo required)
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


            //check user is available or not in db
            new StudentModel().getStudentByEmail(DB_Define.STUDENT_TABLE, email, async (err, results) => {
                try {
                    if (err) {
                        throw err
                    } else {
                        if (results.length == 0) {
                            throw new Error("no student found with this email")
                        }
                        const student = results[0]
                        const ckPass = await bcryptjs.compare(password, student.password)
                        if (!ckPass) {
                            throw new Error("Wrong email or password")
                        }

                        //get token 
                        const token = Helper.getJWTtoken(email)
                        //send token in http cookie
                        res.cookie(Define.TOKEN, token, Define.SESSION_COOKIE_OPTION)

                        delete student.password
                        student['token'] = token
                        res.status(200).json(new Response(false, "Student logged in successfully", student))
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


    //start student logout
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
        res.status(200).json(new Response(false, "Student logged out", {}))
    },//student logout

    //student isLoggedIn start
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
            res.cookie("token", "", Define.LOGOUT_COOKIE_OPTION)
            res.send(false)//not logged in
        }
    },//student isLoggedIn  

    //account email verify
    getVerifyLink: async (req, res) => {
        try {
            const { id, email } = req.params
            //send email
            const response = await Helper.sendEmail(email, `Click on the link to verify your email.URL: <a href='http://localhost:2727/student/verify/${id}'>Click To Verify.</a>`)
            console.log(response);
            res.send(response)
        } catch (e) {
            res.send(new Response(true, e.message, e))
        }
    },
    //emailVerify
    emailVerify: (req, res) => {
        try {
            const { id } = req.params
            //update student info(verified.)
            const stu = {
                id: id,
                is_verified: true
            }

            new StudentModel().updateData(DB_Define.STUDENT_TABLE, stu, (err, results) => {
                if (err) {
                    console.log(err);
                    res.send("<h1>Your Account is Verification Failed.</h1>")
                } else {
                    //console.log(results);
                    res.send("<h1>Your Account is Verified.</h1>")
                }
            })//end db op

        } catch (e) {
            console.log(e);
            res.send("<h1>Your Account is Verification Failed.</h1>")
        }
    },

}

module.exports = StudentController