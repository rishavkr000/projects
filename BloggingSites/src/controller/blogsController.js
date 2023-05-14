const blogsModel = require("../model/blogsModel");
const authorModel = require("../model/authorModel");
const mongoose = require("mongoose");             // import mongoose to connect with mongoDB


//=========== Create Blogs ====================//

//------------validation function-----------//
let isValid = (value) => {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

let isValidObjectId = function (ObjectId) {
  return mongoose.isValidObjectId(ObjectId)
}

const createBlogs = async (req, res) => {
  try {
      let blogData = req.body;
      let authorIdfromToken = req.authorId;
      let id = blogData.authorId
      
      if (!isValidObjectId(id)) {
          return res.status(400).send({ status: false, msg: "authorId is not valid" });
      }

      if (blogData.authorId !== authorIdfromToken) {
        return res.status(403).send({ status: false, mag: "unauthorized access" })
      }

      if (Object.keys(blogData).length == 0) {
          return res.status(400).send({ status: false, msg: "BAD REQUEST, Please provide blog details ", });
      }      

      let author = await authorModel.findById(id);
      if (!author) {
          return res.status(404).send({status: false, msg: "Author Id not found"});
      }
      
      if (!isValid(blogData.title)) {
          return res.status(400).send({ status: false, msg: "title is required" });
      }
      if (!isValid(blogData.body)) {
          return res.status(400).send({ status: false, msg: "body is required" });
      }
      if (!isValid(blogData.authorId)) {
          return res.status(400).send({ status: false, msg: "authorId is required" });
      }
      if (!isValid(blogData.category)) {
          return res.status(400).send({ status: false, msg: "category is required" });
      }

      // blogData.tags = [...new Set(blogData.tags)]
      // blogData.subcategory = [...new Set(blogData.subcategory)]
            
      if(await blogsModel.exists(blogData)) 
          return res.status(400).send({status: false, msg: "Blog already exist"})

      let savedBlogData = await blogsModel.create(blogData);
        return res.status(201).send({ status: true, msg: savedBlogData });
  }
  catch (err) {
      return res.status(500).send({ status: false, msg: err.message });
  }
};

//=========== Get Blogs ====================//

let getBlogs = async function (req, res) {
  try {
      let data = req.query;
      let filter = {
          isDeleted: false,
          isPublished: true,
      };
      if (Object.keys(data).length > 0) {
          if (data.tags) {
              data.tags = { $in: data.tags.split(",") };
          }
          if (data.subcategory) {
              data.subcategory = { $in: data.subcategory.split(",") };
          }
          filter['$or'] = [
              { authorId: data.authorId },
              { category: data.category },
              { tags: data.tags },
              { subcategory: data.subcategory },
          ];
      }
      let blogsData = await blogsModel.find(filter).populate('authorId')
      
      if (blogsData.length == 0) {
          return res.status(404).send({ msg: "Blog Not Found" });
      }
      res.status(200).send({ msg: blogsData });
  } catch (err) {
      return res.status(500).send({ statuS: false, msg: err.message });
  }
};


//=========== Update Blogs ====================//

const updateBlog = async (req, res) => {
  try {
      let blogId = req.params.blogId;

      if (!isValidObjectId(req.params.blogId)) { 
          return res.status(400).send({ status: false, msg: "Invalid blogId" }) 
      }
        
      let data = await blogsModel.findOne({$and:[{ _id: blogId},{isPublished:false}]} );
      if (!data) {
          return res.status(400).send({ status: false, msg: "Data not found/ Already Updated" });
      }

      if (data.authorId.toString()!== req.authorId) {
          return res.status(403).send({ status: false, mag: "unauthorized access" })
      }

      let { title, body, tags, subcategory } = req.body;

      let newBlog = await blogsModel.findOneAndUpdate({ $and: [{ _id: data._id }, { isDeleted: false }] },
        {
          $addToSet: { tags: { $each: tags || [] }, subcategory: { $each: subcategory || [] } },
          title: title,
          body: body,
          isPublished: true,
          publishedAt: new Date().toLocaleString(),
        }, { new: true }).populate("authorId");

      return res.status(200).send({ msg: "Blog Updated Successfully", status: true, data: newBlog });
    }
    catch (err) {
      res.status(500).send({ error: err.message });
    }
};

//=========== Delete Blogs By Id ====================//

const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        let authorIdfromToken = req.authorId;

        if (!isValidObjectId(blogId)) { 
          return res.status(400).send({ status: false, msg: "blogId is incorrect" }) 
        }

        if (!isValidObjectId(authorIdfromToken)) {
          return res.status(400).send({ status: false, msg: "authorIdFromToken is incorrect" });
        }

        let data = await blogsModel.findOne({ _id: blogId });

        if (data.authorId.toString() !== authorIdfromToken) {
          return res.status(403).send({ status: false, mag: "unauthorized access" })
        }

        let blog = await blogsModel.find({ $and: [{ _id: blogId }, { isDeleted: false }] });

        if (!Object.keys(blog).length) {
          return res.status(404).send({ status: true, msg: "blogId not found/Already deleted" });
        }

        let deletedBlog = await blogsModel.updateMany(
          { _id: blogId },
          { $set: { isDeleted: true, deletedAt: new Date().toLocaleString() } },
          { new: true }
        );

        res.status(200).send({ msg: "Blog Deleted Succesfully", status: true, data: deletedBlog });
    }
    catch (err) {
      res.status(500).send({ status: false, msg: err.message });
    }
};

//=========== Delete Blogs By Query ====================//

const delBlogsByQuery = async function (req, res) {
    try {
        let authorIdfromToken = req.authorId;
        const data = req.query;

        if (!isValidObjectId(authorIdfromToken)) {
          return res.status(400).send({ status: false, msg: "authorIdFromToken is incorrect" });
        }

        if (!Object.keys(data).length) {
          return res.status(404).send({ status: false, msg: "Query Params empty" });
        }

        let blogs = await blogsModel.find({ $and: [data, { authorId: authorIdfromToken }, { isDeleted: false }] })

        if (!Object.keys(blogs).length) {
          return res.status(400).send({ status: false, msg: "Blogs not found/ Already Deleted" });
        }

        let deletedBlog = await blogsModel.updateMany(
          { $and: [data, { authorId: authorIdfromToken }, { isDeleted: false }] },
          { $set: { isDeleted: true, deletedAt: new Date().toLocaleString() } },
          { new: true }
        );
        res.status(200).send({ msg: "Blog Deleted Successfully", status: true, data: deletedBlog });
    }
    catch (err) {
      return res.status(500).send({ status: false, msg: err.message });
    }
};

module.exports.updateBlog = updateBlog;
module.exports.createBlogs = createBlogs;
module.exports.getBlogs = getBlogs;
module.exports.deleteBlog = deleteBlog;
module.exports.delBlogsByQuery = delBlogsByQuery;
