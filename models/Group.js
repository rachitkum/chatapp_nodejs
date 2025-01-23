const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User ', 
        required: true 
    },
    text: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const GroupSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    members: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User '
    }],
    messages: [MessageSchema]
}, {
    timestamps: true 
});
module.exports = mongoose.model('Group', GroupSchema);