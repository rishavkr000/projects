let isValidRequestBody = function (body) {
    if (Object.keys(body).length === 0) return false;
    return true;
}

let isUrlValid = function (longUrl) {
    let urlRegex = (/^(ftp|http|https):\/\/[^ "]+$/)
    return urlRegex.test(longUrl)
}

module.exports = { isValidRequestBody, isUrlValid }