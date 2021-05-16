/**
 * @design by milon27
 */
 const bcryptjs = require('bcryptjs')
 const FacultyModel = require('../../models/faculty/FacultyModel')
 const Response = require('../../models/Response')
 const DB_Define = require('../../utils/DB_Define')
 const Define = require('../../utils/Define')
 const Helper = require('../../utils/Helper')
 
 const FacultyController = {
     /**
      * @body {name , phone, email,  password , photo_url} =req.body
      * @param {}=req.params
      * @description  insert faculty information in faculty table
      * do validatioin
      * faculty already have an account or not(mySql Optional,Mongo required)
      * create password hash,save into database
      * generate a jwt access token,set into http cookie
      * return new faculty object as response
      * @response {error(boolean), message(String), response(object:USER)}
      */
     signUp: async (req, res) => {
         try {
             const { name, phone, email, password, photo_url , room_number} = req.body
             //validatioin
             if (!Helper.validateField(name, phone, email, password, photo_url , room_number)) {
                 throw new Error("Enter all the required field!");
             }
 
             if (password.length < 6) {
                 throw new Error("pass length should be atleast 6 char.")
             }
             //get hash pass & save new user into db
             const hashpass = await bcryptjs.hash(password, await bcryptjs.genSalt(10))
             const faculty = {
                 name,
                 phone,
                 email,
                 password,
                 photo_url,
                 room_number,
                 password: hashpass
             }
 
             new FacultyModel().addData(DB_Define.FACULTY_TABLE, faculty, (err, results) => {
                 if (err) {
                     let response = new Response(true, err.message, err);
                     res.send(response);
                 } else {
                     //get token and set into cookie
                     const expireAt = Helper.getExpireDay(Define.TOKEN_EXPIRE_DAY)
                     const token = Helper.getJWTtoken(email, expireAt)
                     //send token in http cookie
                     res.cookie(Define.TOKEN, token, {
                         httpOnly: true,
                         secure: Define.TOKEN_COOKIE_SECURE,//only for browser
                         sameSite: 'lax',
                         expires: new Date(expireAt)
                     })
 
 
 
                     delete faculty.password
                     faculty['id'] = results.insertId
                     faculty['token'] = token
 
                     res.status(200).json(new Response(false, "faculty created successfully", faculty))
                 }
             });//end db
 
         } catch (e) {
             let response = new Response(true, e.message, e);
             res.send(response);
         }
 
     },//end create user.
 
     login: async (req, res) => {
        try {
            const { email, password } = req.body
            //validatioin
            if (!Helper.validateField(email, password)) {
                throw new Error("Enter all the required field!")
            }


            //check faculty is available or not in db
            new FacultyModel().getFacultyByEmail(DB_Define.FACULTY_TABLE, email, async (err, results) => {
                try {
                    if (err) {
                        throw err
                    } else {
                        if (results.length == 0) {
                            throw new Error("no faculty found with this email")
                        }
                        const faculty = results[0]
                        const ckPass = await bcryptjs.compare(password, faculty.password)
                        if (!ckPass) {
                            throw new Error("Wrong email or password")
                        }

                        //get token and set into cookie

                        const expireAt = Helper.getExpireDay(Define.TOKEN_EXPIRE_DAY)
                        const token = Helper.getJWTtoken(email, expireAt)
                        //send token in http cookie
                        res.cookie(Define.TOKEN, token, {
                            httpOnly: true,
                            secure: Define.TOKEN_COOKIE_SECURE,//only for browser
                            sameSite: 'lax',
                            expires: new Date(expireAt)
                        })

                        delete faculty.password
                        faculty['token'] = token
                        res.status(200).json(new Response(false, "faculty logged in successfully", faculty))
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
 
 
     //start faculty logout
     /**
  * @body { } =req.body
  * @param {}=req.params
  * @description 
  * expire jwt access token
  * return logout as response
  * @response {error(boolean), message(String), response(object:USER)}
  */
 
 
     logout: (req, res) => {
         res.cookie(Define.TOKEN, "", {
             httpOnly: true,
             secure: Define.TOKEN_COOKIE_SECURE,
             sameSite: 'lax',
             expires: new Date(0)
         })
         res.status(200).json(new Response(false, "faculty logged out", {}))
     },//faculty logout
 
     //faculty isLoggedIn start
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
             res.cookie(Define.TOKEN, "", {
                 httpOnly: true,
                 secure: Define.TOKEN_COOKIE_SECURE,
                 sameSite: 'lax',
                 expires: new Date(0)
             })
             res.send(false)//not logged in
         }
     },//faculty is faculty isLoggedIn  
 
 }
 
 module.exports = FacultyController
 