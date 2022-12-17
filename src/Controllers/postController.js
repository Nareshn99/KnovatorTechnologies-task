const postModel = require("../Models/postModel.js")
const { isValidBody, isValidGeoLocation, isValidName } = require("../validattion/validation.js")


const createPost = async (req, res) => {
    try {
        let { Title, Body, Status, GeoLocation } = req.body

        if (isValidBody(req.body))
            return res.status(400).send({ status: false, message: "Request body can't be empty" });

        if (!isValidName(Title))
            return res.status(400).send({ status: false, message: "Title Name must be present and only Alphabats " });

        if (!isValidName(Body))
            return res.status(400).send({ status: false, message: "Body must be present in validformat" });

        if (Status) {
            if (Status !== "Active" && Status !== "Inactive") {
                return res.status(400).send({ status: false, message: "Status must be Active/Inactive" });
            }
        }
        if (!isValidGeoLocation(GeoLocation))
            return res.status(400).send({ status: false, message: "Invalid GeoLocation" });

        // Check for uniqueness of Title and GeoLocation
        let post1 = await postModel.find({ $or: [{ Title }, { GeoLocation }] })
        for (let key of post1) {
            if (key.GeoLocation == GeoLocation.trim()) {
                return res.status(409).send({ status: false, message: "Given GeoLocation is already taken" })
            }
            if (key.Title == Title.trim()) {
                return res.status(409).send({ status: false, message: "Given Title is already taken" })
            }
        }
        req.body.Createdby = req.user.userName
        req.body.userId = req.user._id
        const data = await postModel.create(req.body);
        res.status(201).send({ status: true, message: "Success", data: data });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getPost = async (req, res) => {
    try {
        let postId = req.params.postId;
        const finalData = await postModel.findOne({ _id: postId, isDeleted: false })
        if (finalData.length == 0)
            return res.status(404).send({ status: false, message: 'post not found' });
        return res.status(200).send({ status: true, message: 'Success', data: finalData });
    } catch (err) {
        res.status(500).send({ status: false, err: err.message })
    }
}


const updatePost = async (req, res) => {
    try {
        let { Title, Body, GeoLocation, Status } = req.body
        let postId = req.params.postId

        if (isValidBody(req.body))
            return res.status(400).send({ status: false, message: "Request body can't be empty" });
        if (Title) {
            if (!isValidName(Title))
                return res.status(400).send({ status: false, message: "Title Name must be present and only Alphabats " });
            let post = await postModel.findOne({ Title })
            if (post) {
                return res.status(409).send({ status: false, message: "Given Title is already taken" })
            }
        }
        if (Body) {
            if (!isValidName(Body))
                return res.status(400).send({ status: false, message: "Body must be present in validformat" });
        }
        if (Status) {
            if (Status !== "Active" && Status !== "Inactive") {
                return res.status(400).send({ status: false, message: "Status must be Active/Inactive" });
            }
        }
        if (GeoLocation) {
            if (!isValidGeoLocation(GeoLocation))
                return res.status(400).send({ status: false, message: "Invalid GeoLocation" });
            let geo = await postModel.findOne({ GeoLocation })
            if (geo) {
                return res.status(409).send({ status: false, message: "Given GeoLocation is already taken" })
            }
        }
        let data = await postModel.findOneAndUpdate({ isDeleted: false, _id: postId }, { Title, Body, GeoLocation, Status }, { new: true });
        res.status(201).send({ status: true, message: "Success", data: data });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



const deletePost = async (req, res) => {
    try {
        let postId = req.params.postId
        let post = await postModel.findOneAndUpdate({ isDeleted: false, _id: postId }, { isDeleted: true }, { new: true });
        if (!post) {
            return res.status(404).send({ status: false, message: "post not found" });
        }
        return res.status(200).send({ status: true, message: "The post deleted successfully" });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}



const getRetrievePosts = async (req, res) => {
    try {
        const GeoLocation = req.body.GeoLocation
        if (!isValidGeoLocation(GeoLocation))
            return res.status(400).send({ status: false, message: "Invalid GeoLocation" });

        const finalData = await postModel.findOne({ GeoLocation ,isDeleted:false})

        if (finalData.length == 0)
            return res.status(404).send({ status: false, message: 'post not found' });

        return res.status(200).send({ status: true, message: 'Success', data: finalData });
    } catch (err) {
        res.status(500).send({ status: false, err: err.message })
    }
}


const getAllActiveAndInactive = async (req, res) => {
    try {
        const active = await postModel.find({ isDeleted: false, Status: "Active" })
        const inactive = await postModel.find({ isDeleted: false, Status: "Inactive" })
        return res.status(200).send({ status: true, message: 'Success', TotleActive: active.length, TotleInactive: inactive.length });
    } catch (err) {
        res.status(500).send({ status: false, err: err.message })
    }
}


module.exports = {
    createPost,
    getPost,
    updatePost,
    deletePost,
    getRetrievePosts,
    getAllActiveAndInactive
}