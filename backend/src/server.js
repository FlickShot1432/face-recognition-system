const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.routes');
const connectDB = require('./config/db.config');
const cors = require('cors')
const app = express();
const port = 3000;

(async () => {
    await connectDB();
})();

app.use(cors())
app.use(bodyParser.json());
app.use('/api', authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
