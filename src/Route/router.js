const express = require('express')
const router = express.Router()
const {createUser,userLogin}=require('../Controllers/userController')
const {createPost,getPost,updatePost,deletePost,getAllActiveAndInactive,getRetrievePosts}=require("../Controllers/postController")
const  { Authentication, Authorization }=require("../middlewares/auth")


router.post("/resistor",createUser)
router.post('/login', userLogin)


router.post("/createPost/:userId", Authentication, Authorization ,createPost)
router.get("/getPost/:userId/:postId", Authentication, Authorization ,getPost)
router.put("/updatePost/:userId/:postId", Authentication, Authorization ,updatePost)
router.delete("/deletePost/:userId/:postId", Authentication, Authorization ,deletePost)


router.get("/getAllActiveAndInactive",getAllActiveAndInactive)
router.get("/getRetrievePosts",getRetrievePosts)


//errorHandling for wrong address
router.all("/**", function (req, res) {         
    res.status(400).send({
        status: false,
        msg: "The api you request is not available"
    })
})
module.exports = router