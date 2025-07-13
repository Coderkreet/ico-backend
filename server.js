const express = require("express");
const dotenv = require("dotenv");
const landingPageRoutes = require("./routes/landingPageRoutes");
const adminRoutes = require("./routes/adminRoutes");
const morgan = require("morgan");

// const userRoutes = require("./routes/userRoutes");
const app = express();
const { connectDB } = require("./config/database");
connectDB();
dotenv.config()
app.use(morgan('dev'));
const bodyParser = require('body-parser');
const cors = require('cors');

// Middleware
// app.use(cors());
app.use(cors({
    origin: true, // Allow requests from this domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true, // Include cookies in cross-origin requests
}));

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({ limit: '100mb',extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to Home' });
});

app.use('/api/landingpage', landingPageRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/users', userRoutes);


app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});


