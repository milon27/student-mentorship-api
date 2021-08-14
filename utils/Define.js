require('dotenv').config()

const Define = {
    API_BASE_URL: "http://localhost:2727/",
    //user access token
    TOKEN: "token",
    SESSION_COOKIE_OPTION: {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "dev" ? true : false,//only for browser
        sameSite: process.env.NODE_ENV !== "dev" ? 'lax' : 'lax',//'lax' or 'none'
        //maxAge: 1 * 24 * 60 * 60 * 1000//1 day in milis
    },
    LOGOUT_COOKIE_OPTION: {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "dev" ? true : false,//only for browser
        sameSite: process.env.NODE_ENV !== "dev" ? 'lax' : 'lax',//'lax' or 'none'
        expires: new Date(0)
    },
    //pagination
    FORMAT_SQL_DATE: "YYYY-MM-DD ",
    CREATED_AT: "created_at",
    PAGINATE_PAGE_SIZE: 10,
    //time
    DAYS: "days",
    MONTHS: "months",
    MINUTES: "minutes",
    SECONDS: "seconds",
    ADMIN: "ADMIN",
    USER: "USER",
    //support define list
    NOT_SET: "NOT_SET",
    PENDING_TICKET: "pending",
    COMPLETED_TICKET: "completed",
    SNOOZED_TICKET: "snoozed",
    PROCESSING_TICKET: "processing",
    //type of skill
    TYPE_SKILL_ADVANCED: "advanced",
    TYPE_SKILL_INTERMIDIATE: "intermidiate",
    TYPE_SKILL_BEGINNER: "beginner",
}
module.exports = Define