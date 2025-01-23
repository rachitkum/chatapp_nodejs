// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     // groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
// });

// module.exports = mongoose.model('User ', UserSchema);



const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    groups: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Group' // Reference to the Group model
    }],
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Export the User model
module.exports = mongoose.model('User ', UserSchema);