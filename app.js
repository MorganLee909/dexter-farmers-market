const express = require("express");
const compression = require("compression");
const session = require("cookie-session");

const app = express();

function requireHTTPS(req, res, next) {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
      return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

app.set("view engine", "ejs");

app.use(requireHTTPS);
app.use(compression())
app.use(express.static(__dirname + "/views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
  secret: "Dexter Peoples Recpulic of markets that contain farmers",
  cookie: {secure: false},
  saveUninitialized: true,
  resave: false
}));

require("./routes")(app);

app.listen(process.env.PORT, ()=>{
    console.log(`Listening on port ${process.env.PORT}`);
});