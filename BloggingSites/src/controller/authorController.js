const authorModel = require('../model/authorModel')  //import authorModel
var validator = require('validator');              // import validator for email validation
const jwt = require('jsonwebtoken');              // import jsonwebtoken to generate token

//=========== Create Authors ====================//

//------------validation function-----------//
let isValid = (value) => {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true;
}

const createAuthor = async (req, res) => {
  try {
    let data = req.body;

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "BAD REQUEST, Please provide Author details " });
    }
    if (!isValid(data.fname)) {
      return res.status(400).send({ status: false, msg: "First Name is Required" });
    }
    if (!isValid(data.lname)) {
      return res.status(400).send({ status: false, msg: "Last Name is Required" });
    }
    if (!isValid(data.title)) {
      return res.status(400).send({ status: false, msg: "title is Required" });
    }
    if (!isValid(data.email)) {
      return res.status(400).send({ status: false, msg: "email is mandatory" });
    }
    if (!isValid(data.password)) {
      return res.status(400).send({ status: false, msg: "password is mandatory" });
    }
    if (!validator.isEmail(data.email)) {
      return res.status(400).send({ status: false, msg: "Enter a Valid Email" });
    }

    const usedEmail = await authorModel.findOne({ email: data.email })  //For checking duplicate email id

    if (usedEmail) {
      return res.status(400).send({ status: false, message: `${data.email} is already registered` })
    }

    let savedData = await authorModel.create(data)
    return res.status(201).send({ status: true, msg: savedData });
  }
  catch (error) {
    console.log("This is the error:", error.message);
    res.status(500).send({ status: false, msg: error.message });
  }
}


//================= Login ====================//


const login = async (req, res) => {
  try {
      let data = req.body;

      if (!Object.keys(data).length) {
        return res.status(400).send({ status: false, msg: "Invalid Request , Please Provide Login Details" })
      }

      if (!validator.isEmail(data.email)) {
        return res.status(400).send({ status: false, msg: "Enter a Valid Email" });
      }

      if (data.email && data.password) {
        let author = await authorModel.findOne({ email: data.email, password: data.password })

      if (!author) {
        return res.status(400).send({ status: false, msg: "Please enter a correct email or password. Note that the password field is case sensitive." });
      }

        let token = jwt.sign(
          {
            authorId: author._id.toString(),
            projectName: "Blogging Site Mini Project",
            batch: "uranium"
          },
          "group-15-blog-project"
        )
        res.header('x-api-key', token);
        res.status(200).send({ data: "Author login successful", token: { token } })
      }
      else {
        res.status(400).send({ status: false, msg: "must contain email and password" })
    }
  } 
  catch (error) {
      res.status(500).send({ status: false, error: error.message })
  }
}

module.exports.createAuthor = createAuthor
module.exports.login = login;
