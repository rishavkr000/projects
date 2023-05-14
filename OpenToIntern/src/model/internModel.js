const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId


const internSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        lowercase:true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    collegeId: {
        type: ObjectId,
        ref: "College"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("Intern", internSchema); //interns