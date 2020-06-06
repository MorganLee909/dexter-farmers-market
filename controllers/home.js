const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcryptjs");

let News;

MongoClient.connect(
    process.env.PERSONAL_SITE, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err, client)=>{
        let db = client.db("DexterFarmersMarket");
        Post = db.collection("posts");
        Admin = db.collection("admin");
    }
);

module.exports = {
    landingPage: function(req, res){
        Post.aggregate([
            {$sort: {createdAt: -1}},
            {$limit: 10}
        ]).toArray()
            .then((response)=>{
                for(let i = 0; i < response.length; i++){
                    response[i].content = response[i].content.split("\r\n");
                }
                console.log(response);
                return res.render("./landingPage/landing.ejs", {news: response});
            })
            .catch((err)=>{
                console.log(err);
                return res.render("./landingPage/landing.ejs");
            });
    },

    loginPage: function(req, res){
        return res.render("./loginPage/login.ejs");
    },

    login: function(req, res){
        Admin.findOne({email: req.body.email})
            .then((user)=>{
                if(user){
                    bcrypt.compare(req.body.password, user.password, (err, result)=>{
                        if(result){
                            req.session.user = user._id;
                            return res.redirect("/post/new");
                        }
                        return res.redirect("/");
                    })
                }else{
                    return res.redirect("/");
                }
            })
            .catch((err)=>{});
    },

    newPost: function(req, res){
        if(!req.session.user){
            return res.redirect("/");
        }

        return res.render("./newPostPage/newPost.ejs");
    },

    createPost: function(req, res){
        if(!req.session.user){
            return res.redirect("/");
        }

        let newPost = {
            title: req.body.title,
            content: req.body.content,
            creator: req.session.user,
            createdAt: new Date()
        }

        Post.insertOne(newPost)
            .then((response)=>{
                return res.redirect("/");
            })
            .catch((err)=>{
                return res.redierct("/");
            })
    }
}