const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dbConnect = require('./config/db.Connect');
const dotenv = require("dotenv");
const userRoutes = require('./routes/UserRoutes.js');
const productRoutes = require('./routes/ProductRoutes.js');
const cartRoutes = require('./routes/CartRoutes.js');
// const wishlistRoutes = require('./routes/WishListRoutes.js');
const passport = require('passport'); 
const errorMiddleware = require('./middleware/ErrorMiddleware.js'); 

dbConnect()
const app = express();

app.use(cors());

dotenv.config();
app.use(express.json());

app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
const port = process.env.PORT
app.use(errorMiddleware);

// Routes
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
// app.use('api/wishlist', wishlistRoutes);

// app.use('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))