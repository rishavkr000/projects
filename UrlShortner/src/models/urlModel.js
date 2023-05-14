const mongoose = require("mongoose");


// instantiate a mongoose schema 
const urlSchema = new mongoose.Schema({
    urlCode : {
        type : String,
        required : "urlCode is required",
        unique : true,
        lowercase : true,
        trim : true
    },
    longUrl : {
        type : String,
        required : "longUrl is required",
        trim : true,
    },
    shortUrl : {
        type : String,
        required : "shortUrl is required",
        unique : true,
        trim : true
    }
}, {
    timestamps: true
})

// create a model for schema and export it
module.exports = mongoose.model('Url', urlSchema)

