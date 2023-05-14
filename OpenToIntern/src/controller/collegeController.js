const collegeModel = require("../model/collegeModel");
const { isValidRequestBody, isValid, isValidName } = require("../utility/validator")

const createCollege = async (req, res) => {
    try {
        let queryParams = req.query;
        const data = req.body;
        
        if(isValidRequestBody(queryParams)) return res.status(400).send({ status: false, msg: "Here query is not a valid request!" })
        if (!isValidRequestBody(data)) return res.status(404).send({ status: false, msg: "Data not found" })

        let { name, fullName, logoLink } = data

        if (!isValid(name)) return res.status(400).send({ status: false, msg: "College name is required" })
        if(!isValidName(name)) return res.status(400).send({ status: false, msg: "College name only contain alphanumeric, special character[() . @] and wihout space" })
        const isUnique= await collegeModel.findOne({name:name})
        if(isUnique) return res.status(400).send({ status: false, msg: "College name already exist" })

        if (!isValid(fullName)) return res.status(400).send({ status: false, msg: "College full name is required" })
        
        if (!isValid(logoLink)) return res.status(400).send({ status: false, msg: "Logo link is required" })

        let collegeData = { name, fullName, logoLink }
        let college = await collegeModel.create(collegeData)

        return res.status(201).send({ status: true,msg:"College register sucessfully", data: college })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports = { createCollege };