const express = require("express");
// const adminmodel = require("./db/conn");
const app = express();
const path = require('path');
const ejs = require("ejs");
const mongoose = require("mongoose");
require("./db/conn.js");
const request = require('./db/conn')
// const admin = require('./db/conn');
app.use(express.urlencoded({ extended: false }));
const dotenv = require('dotenv').config({ path: './config.env' });
const port = process.env.PORT;
const alert = require("alert");
const { count } = require("console");
const { db } = require("./db/conn");
const session = require('express-session');
// const partialsPath = path.join(__dirname, "./partials");

app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false
}));


app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, 'views'));


// admin panel db connection 
mongoose.connect(process.env.DATABASE, {

}).then(() => {
    console.log("Connection successful for admin db");
}).catch((err) => {
    console.log(err);
});

const adminschema = new mongoose.Schema({
    mail: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },
});

const adminmodel = mongoose.model('admin', adminschema);
// module.exports = adminmodel;

app.get("/", (req, res) => {
    res.render("index");
});

app.post('/', (req, res) => {
    try {
        let data = new request(req.body);
        data.save().then(() => {
            alert("The consultation request has been sent, Our operators will Let you know soon via email.")
            res.redirect("/")
        })

    } catch (error) {
        console.log(console.error());
        alert("An Error Occured,Please try again later!");
    }

});

app.get("/admin", (req, res) => {
    res.render("admin")
});

app.post("/admin", async (req, res) => {
    try {
        const email = req.body.email;
        const pass = req.body.password;

        const usermail = await adminmodel.findOne({ email: email });

        if (usermail.password == pass) {
            req.session.user = {
                id: 1,
                username: 'talha321'
            };

            res.render("panel.ejs")
            console.log("Admin session has been created!");

        } else {
            alert('Invalid credentials!') ? "" : reload();
            res.redirect("admin");

        }

    } catch (error) {
        console.log(error);
    }

});

app.get("/admin/panel/consultreqs", (req, res) => {
    // Check if the user is authenticated
    if (!req.session.user) {
        // If the user is not authenticated, redirect them to the login page
        res.redirect('/admin');
        alert("Prove your Identity to Use Admin Panel");
        return;
    } else {
        res.render("panel")
    }
});


// app.get("/admin/consultreqs",(req,res)=>{
//     // Check if the user is authenticated
//     if (!req.session.user) {
//        // If the user is not authenticated, redirect them to the login page
//        res.redirect('/admin');
//        alert("Prove your Identity to Use Admin Panel");
//        return;
//      } else {
//        res.render("reqs")
//      }
//    });



app.get('/logout', (req, res) => {
        req.session.destroy((err) => {
            res.redirect('/admin');  // redirect the user to the login page
            alert("Logged Out Successfully!")
        });     
});


app.get("/admin/consultreqs", async (req, res) => {

    if (!req.session.user) {
        res.redirect("/admin")
        alert("Prove your Identity to use Admin Panel");
        return;
    } else {
        request.find({}, function (err, reqs) {
            res.render('reqs', {
                reqsList: reqs
            });
        })
    }
});



app.listen(port, () => {
    console.log(`The node js server is running at port ${port}`);
});
