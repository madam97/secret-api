import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Config
dotenv.config({ path: `.env${process.env.NODE_ENV ? '.'+process.env.NODE_ENV : ''}` });

// App
const app = express();

// Init middleware
app.use(express.json());

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECTION ?? '', 
  () => console.log('Connected to database')
);

// Start server
app.listen(
  process.env.PORT, 
  () => console.log(`Server started on port ${process.env.PORT}`)
);