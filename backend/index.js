const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dbConnect = require('./config/db.Connect');
const dotenv = require("dotenv");
const passport = require('passport'); 
const errorMiddleware = require('./middleware/ErrorMiddleware.js'); 


const userRoutes = require('./routes/UserRoutes.js');
const productRoutes = require('./routes/ProductRoutes.js');
const cartRoutes = require('./routes/CartRoutes.js');
const addressRoutes = require('./routes/AddressRoutes.js');
const wishlistRoutes = require('./routes/WishListRoutes.js');
const orderRoutes = require('./routes/OrderRoutes.js');
const paymentRoutes = require('./routes/PaymentRoutes.js');
const trackingRoutes = require('./routes/TrackingRoutes.js');


dbConnect()
const app = express();

dotenv.config();
app.use(express.json());

// Enable CORS for all origins and allow credentials
app.use(cors({ origin: true, credentials: true }));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
const port = process.env.PORT
app.use(errorMiddleware);

// Routes
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/track', trackingRoutes);

// app.use('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))