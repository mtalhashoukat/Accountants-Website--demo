const mongoose = require("mongoose");
const dotenv = require('dotenv').config({path:'./config.env'});

// creating a mongoDb connection with the contact form in contact now section

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE, {

}).then(() => {
    console.log("Connection successful for consult db");
}).catch((err) => {
    console.log(err);
});

const consultreqschema = new mongoose.Schema({
    namecon: {
        type: String,
        required: true
    },

    companycon: {
        type: String,
        required: true,
    },

    emailcon: {
        type: String,
        required: true,
        unique:true

    },

    phonecon: {
        type: String,
        required: true,
    },

    addresscon: {
        type: String,
        required: true,

    },

    msgcon: {
        type: String,

    }


});


//   creating into a model

const reqs = mongoose.model('consultationrequests', consultreqschema);

module.exports=reqs;

// admin panel db connection 
// mongoose.connect('mongodb://localhost:27017/consultreqs', {

// }).then(() => {
//     console.log("Connection successful for admin db");
// }).catch((err) => {
//     console.log(err);
// });

// const adminschema = new mongoose.Schema({
//     emailaddress: {
//         type: String,
//         required: true,
//         unique : true
//     },

//     password: {
//         type: String,
//         required: true,
//     },
// });

// const adminmodel = mongoose.model('admin', adminschema);
// module.exports = adminmodel;
