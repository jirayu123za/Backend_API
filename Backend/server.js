import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js';
import { notfound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();

connectDB();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/api/users', userRoutes);

app.use(notfound);
app.use(errorHandler);

app.get('/', (req, res) => res.send("Server is running"));
app.listen(port, () => console.log(`server listening on ${port}`));