const express = require("express");
const path = require("path");
const morgan = require("morgan");
const routes = require("./routes/index");
const rateLimit = require("express-rate-limit"); //set limit for user request
const helmet = require("helmet"); //secure your app by setting up various http headers
const mongosanitize = require("express-mongo-sanitize"); // sanitize data as middleware
const bodyParser = require("body-parser"); //handle body request
const xss = require("xss"); //sanitize from untrusted html
const cors = require("cors"); //a mechanism for integrating applications
const app = express();

const staticPath = path.join(__dirname, "../public");
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: true }));
app.use(mongosanitize());
//app.use(xss);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" })); //set limit for user
app.use(bodyParser.json()); //data will in json form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
if (process.env.NODE_ENV === "devlopment") {
  app.use(morgan("dev"));
}
const limiter = rateLimit({
  max: 3000,
  windowMs: 60 * 60 * 1000,
  message:
    "Too many requests from this IP,Please try again try again in an hour",
});
app.use("/tawk", limiter);
app.use(routes);
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
module.exports = app;
