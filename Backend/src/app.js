const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")

const connectDB = require("./config/db");


const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.get("/test", (req, res) => {
    console.log("🔥 TEST ROUTE HIT");
    res.json({
        message: "Backend is working!"
    });
});

/* Require all the routes here. */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

/* Using all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);


module.exports = app;