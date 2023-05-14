const ObjectId = require("mongoose").Types.ObjectId

let isValidRequestBody = function (body) {
    if (Object.keys(body).length === 0) return false;
    return true;
}

let isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false;
    if (typeof value === 'string' && value.trim().length === 0) return false;
    return true;
}

let isValidObjectId = function (objectId) {
    if (!ObjectId.isValid(objectId)) return false;
    return true;
}

let isValidEmail = function (email) {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)
}

const isValidMobile = function (number) {
    let phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
}

let isValidName =function(name){
    let nameRegex=/^[A-Za-z0-9_().@]{1,}$/;
    return nameRegex.test(name)
}

let isValidFullName=function(name){
let nameRegex=/^[A-Za-z\s]{1,}[A-Za-z\s]{0,}$/;
return nameRegex.test(name);
}

const isValidUrl = function (value) {
    let regexForUrl = 
        /(:?^((https|http|HTTP|HTTPS){1}:\/\/)(([w]{3})[\.]{1})?([a-zA-Z0-9]{1,}[\.])[\w]*((\/){1}([\w@?^=%&amp;~+#-_.]+))*)$/;
    return regexForUrl.test(value);
}


module.exports = {
    isValidRequestBody, 
    isValid, 
    isValidObjectId, 
    isValidEmail, 
    isValidMobile, 
    isValidUrl,
    isValidFullName, 
    isValidName 
}