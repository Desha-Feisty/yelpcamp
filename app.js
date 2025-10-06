if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL;
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
const sanitizeV5 = require("./utils/mongoSanitizeV5.js");
const helmet = require("helmet");
const MongoDBStore = require("connect-mongo")(session);

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(process.env.DB_URL, {
        tls: true,
        tlsInsecure: false,
        ssl: true,
        sslValidate: true,
    });
}

const app = express();
app.set("query parser", "extended");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(sanitizeV5({ replaceWith: "_" }));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("tiny"));
app.use(helmet({ contentSecurityPolicy: false }));

const store = new MongoDBStore({
    url: process.env.DB_URL,
    secret: "thisshouldbeabettersecret",
    touchAfter: 24 * 3600,
    ssl: true,
    sslValidate: true,
    mongoOptions: {
        tls: true,
        tlsInsecure: false,
    },
});
store.on("error", function (e) {
    console.log("Session store error", e);
});

const sessionConfig = {
    store,
    name: "session",
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
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const connectSrcUrls = [
    "https://api.maptiler.com/",
    "https://cdn.jsdelivr.net/",
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.maptiler.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/disfsizmf/",
                "https://images.unsplash.com/",
                "https://wallpapers.com/images/featured/camping-background-rgj5169zktuggn6e.jpg",
                "https://res.cloudinary.com/disfsizmf/image/upload/v1759607977/camp_ioofos.webp",
                "https://api.maptiler.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.get("/", (req, res) => {
    res.render("campgrounds/home");
});
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong!";
    res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
    console.log("server running on port 3000");
});
