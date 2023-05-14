const urlModel = require("../models/urlModel")
const { isUrlValid, isValidRequestBody } = require('../utility/validation')
const { SET_ASYNC, GET_ASYNC } = require('../utility/redisConfig')
const shortid = require('shortid')


const createUrl = async (req, res) => {
    try {
        let body = req.body
        if (!isValidRequestBody(body)) {
            return res.status(400).send({status: false, message: "Please provide details in body"})
        }

        const { longUrl } = body;

        if (!isUrlValid(longUrl)) {
            return res.status(400).send({status: false, message: "Enter a valid url"})
        }

        const urlCode = shortid.generate().toLowerCase()
        const shortUrl = 'http://localhost:4000/' + urlCode

        let result = {
            urlCode: urlCode,
            longUrl: longUrl,
            shortUrl: shortUrl
        }

        const checkUrl_Code = await urlModel.findOne({ urlCode: urlCode, shortUrl: shortUrl })

        if (checkUrl_Code) {
            if (checkUrl_Code.urlCode == urlCode)
                return res.status(400).send({status: false, message: "urlCode already registered"})
            if (checkUrl_Code.shortUrl == shortUrl)
                return res.status(400).send({status: false, message: "shortUrl already registered"})
        }

        let url = await GET_ASYNC(`${longUrl}`)
        if (url) {
            return res.status(201).send({status: true, data: JSON.parse(url)})
        }

        let dbUrl = await urlModel.findOne({longUrl: longUrl}).select({ __v: 0, _id: 0, createdAt: 0, updatedAt: 0 })

        if(dbUrl) return res.status(201).send({ status: true, data: dbUrl })

        let data = await urlModel.create(result)
        if (data) {
            await SET_ASYNC(`${longUrl}`, JSON.stringify(result))
            return res.status(201).send({status: true, message: "created Successfully", data: result})
        }
    } 
    catch (error) {
        res.status(500).send({
            status: false,
            msg: error.message
        })
    }
}

const fetchUrl = async function (req, res) {
    try {
        let urlCode = req.params.urlCode
        let url = await GET_ASYNC(`${req.params.urlCode}`)
        if (!url) {
            let check = await urlModel.findOne({urlCode: urlCode});
            if (!check) return res.status(404).send({status: false, msg: `Url not found with this code ${urlCode}` })
            await SET_ASYNC(`${req.params.urlCode}`, check.longUrl)
            return res.redirect(301, check.longUrl)
        }else{
            return res.redirect(301, url)
        }
    }
    catch (error) {
        res.status(500).send({
            status: false,
            msg: error.message
        })
    }
};

module.exports.createUrl = createUrl
module.exports.fetchUrl = fetchUrl;
