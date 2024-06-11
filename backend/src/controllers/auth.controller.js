const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const faceapi = require('face-api.js');
const canvas = require('canvas');

const registerUser = async (req, res) => {
    const { name, email, password, descriptor } = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        descriptor
    });

    await newUser.save();
    res.send({ message: 'User registered successfully!' });
};

const loginUser = async (req, res) => {
    try {
        const { descriptor } = req.body;  // This is the descriptor provided during login attempt

        // Ensure the descriptor from the request is a Float32Array
        const loginDescriptor = new Float32Array(descriptor);

        const users = await User.find();  // Fetch all users from the database
        let matchFound = false;

        for (let user of users) {
            // Ensure user.descriptor and user.email are defined
            if (!user.descriptor || !user.email) {
                console.warn(`User with ID ${user._id} is missing descriptor or email.`);
                continue; // Skip this user
            }

            // Convert stored user descriptor to Float32Array
            const storedDescriptor = new Float32Array(user.descriptor);

            // Create a LabeledFaceDescriptors object with the user's email as the label
            const labeledFaceDescriptor = new faceapi.LabeledFaceDescriptors(user.email.toString(), [storedDescriptor]);

            // Create a FaceMatcher with the user's labeled face descriptor
            const faceMatcher = new faceapi.FaceMatcher([labeledFaceDescriptor]);

            // Find the best match
            const bestMatch = faceMatcher.findBestMatch(loginDescriptor);

            if (bestMatch.label !== 'unknown') {
                matchFound = true;
                const token = jwt.sign({ id: user._id }, '4f2ca5e5893b1ee71fbd2b85c62a3e72', { expiresIn: 86400 });
                res.send({ auth: true, token });
                return;
            }
        }

        if (!matchFound) {
            res.status(401).send({ auth: false, token: null });
        }
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};




module.exports = {
    registerUser,
    loginUser
};
