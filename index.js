const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const app = express();

const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const postRoutes = require("./routes/postRoutes"); 
const homeRoutes = require("./routes/homeRoutes")


// Middleware พื้นฐาน
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("trust proxy", 1);

// Session
app.use(session({
  secret: "secret_roommate",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 600000 }
}));
app.use(flash());

// Global variables สำหรับ ejs
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.validationErrors = req.flash("validationErrors");
  next();
});

// Routes
app.use("/", authRoutes);
app.use("/", accountRoutes);
app.use("/", postRoutes);
app.use("/", homeRoutes);

// app.use("/room", roomRoutes);

// Pages (view only)
app.get("/", (req, res) => res.render("index"));
// app.get("/home", (req, res) => res.render("home"));



app.listen(3000, () => console.log("Server running on port 3000"));




