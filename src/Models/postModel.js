const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
        unique:true,
        trim: true
    },
    Body: {
        type: String,
        required: true,
        trim: true
    },
    Createdby: {
        type: String,
        required: true,
        trim: true
    },
    Status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    GeoLocation: {
        type: String,
        required: true,
        unique:true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


module.exports = mongoose.model('Post', postSchema);