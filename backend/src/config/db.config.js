const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(
            'mongodb://127.0.0.1:27017/face-recognition',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        isConnected = true;
        console.log('Database connection success');
    } catch (error) {
        console.error(`Database connection failed, ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;