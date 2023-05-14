const UserModel = require("../modules/UserModel");

//imorting validation function from validation.js
const { isValidRequestBody, isEmpty, isValidPhone, isValidEmail, isValidPassword } = require("../utility/validation")
const jwt = require('jsonwebtoken');


const registerUser = async (req, res) => {
    try {
        const data = req.body;

        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, message: "User credentials are required" })

        let { title, name, phone, email, password, address } = data

        //Validations
        if (isEmpty(title)) return res.status(400).send({ status: false, message: "Title is required" })
        if (['Mr', 'Mrs', 'Miss'].indexOf(title) == -1) return res.status(400).send({ status: false, message: "Title must be Mr, Mrs, Miss" })

        if (isEmpty(name)) return res.status(400).send({ status: false, message: "User name is required" })
        if (!name.match(/^[#.a-zA-Z\s,-]+$/)) return res.status(400).send({ status: false, message: "User name is Invalid !" })

        if (isEmpty(phone)) return res.status(400).send({ status: false, message: "Phone Number is required" })
        if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: `${phone} is not a valid phone number` })

        if (isEmpty(email)) return res.status(400).send({ status: false, message: "Email is required" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: `${email} is not a valid email` })

        if (isEmpty(password)) return res.status(400).send({ status: false, message: "Password is required" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: ` Password ${password} length must be between 8 and 15 and must contain mix of unique character @#$%&* and a-z, A-Z` })

        //DB calls to check valid phone and email
        const isUniquePhone = await UserModel.findOne({ phone: phone }).catch(e => null)
        if (isUniquePhone) return res.status(400).send({ status: false, message: `Phone number : ${phone} already registered` })
        const isUniqueEmail = await UserModel.findOne({ email: email }).catch(e => null)
        if (isUniqueEmail) return res.status(400).send({ status: false, message: `Email : ${email} already registered` })

        //User creation
        let userData = { title, name, phone, email, password, address }
        let user = await UserModel.create(userData)



        return res.status(201).send({ status: true, message: "User created sucessfully", data: user })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const loginUser = async function (req, res) {
    try {
        const loginData = req.body;

        if (!isValidRequestBody(loginData)) return res.status(400).send({ status: false, message: "Login Credentials cannot be empty" })

        const { email, password } = loginData

        if (isEmpty(email)) return res.status(400).send({ status: false, message: "Email is required" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: `${email} is not a valid email` })

        if (isEmpty(password)) return res.status(400).send({ status: false, message: "Password is required" })

        //DB call for checking user is valid user
        const user = await UserModel.findOne({ email: email, password: password })
        if (!user) {
            return res.status(401).send({ status: false, message: "Email or Password is not correct" })
        }

        let token = jwt.sign(
            {
                userId: user._id.toString(),
                batch: "Uranium",
                organisation: "FunctionUp",
                exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour 1200s | 2500 (60*10) | (60 * min)
            },
            "functionUp-Uranium"
        )
        //sending token in header response
        res.setHeader("x-api-key", token)
        const data = {
            user: user._id,
            token : token
        }
        res.status(200).send({ status: true, data: data })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
module.exports = {
    registerUser,
    loginUser
};