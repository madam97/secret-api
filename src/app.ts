import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import secretRoute from './routes/secret';

// Config
dotenv.config({ path: `.env${process.env.NODE_ENV ? '.'+process.env.NODE_ENV : ''}` });

// App
const app = express();

// Init middleware
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN ?? 'http://localhost');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  next();
});

// Routes
app.use('/secret', secretRoute);

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECTION ?? '', 
  () => console.log('Connected to database')
);

export default app;