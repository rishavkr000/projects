const express = require("express");
const router = express.Router();
const authorController = require("../controller/authorController");
const blogsController = require("../controller/blogsController")
const middleWare = require("../middleware/auth")

router.post("/createAuthor", authorController.createAuthor)
router.post("/loginUser", authorController.login)
router.post("/createBlog",middleWare.authCheck,blogsController.createBlogs)
router.get("/getBlogs", middleWare.authCheck, blogsController.getBlogs)
router.put("/updateBlog/:blogId", middleWare.authCheck, blogsController.updateBlog)
router.delete("/deleteBlog/:blogId", middleWare.authCheck, blogsController.deleteBlog)
router.delete("/delbyquery", middleWare.authCheck, blogsController.delBlogsByQuery)

module.exports = router;
