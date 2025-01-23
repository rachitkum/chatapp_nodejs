const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const connectDB = async () => {
    try {
        console.log('MongoDB URI:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;