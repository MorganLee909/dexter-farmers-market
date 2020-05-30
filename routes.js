const home = require("./controllers/home.js");

module.exports = function(app){
    app.get("/", home.landingPage);
    app.get("/login", home.loginPage);
    app.get("/post/new", home.newPost);
    
    app.post("/login", home.login);
    app.post("/post/create", home.createPost);
}