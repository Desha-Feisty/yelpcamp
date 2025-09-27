if(process.env.NODE_ENV !== "production"){
  require("dotenv").config()
}
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const campgroundRoutes = require("./routes/campgroundRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const userRoutes = require("./routes/users.js");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelpcamp");
}

const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("tiny"));

const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res)=>{
//     res.status(404).send('NOT FOUND !')
// })

// app.use((err, req, res, next) => {
//     console.log("************************")
//     console.log("******** ERROR *********")
//     console.log("************************")
//     const{ status = 500 } = err
//     const { message = 'something ewent wrong' } = err
//     res.status(status).send(message)
//     // next(err)
// })

app.listen(3000, () => {
  console.log("server running on port 3000");
});
