const express = require("express");
const router = express.Router();
const { createCollege } = require("../controller/collegeController");
const { createIntern, getIntern } = require("../controller/internController")

router.post("/functionup/colleges", createCollege);

router.post("/functionup/interns", createIntern);

router.get("/functionup/collegeDetails", getIntern)


/*------------------------------if api is invalid OR wrong URL--------------------------------*/


router.all("/**", function (req, res) {
    res.status(400).send({ status: false, msg: "The api you request is not available" })
})

module.exports = router;
