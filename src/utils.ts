import dotenv from 'dotenv-extended';
dotenv.load();
import mongoose from 'mongoose';

export const connectMongo = () => {
  if (process.env.DOCKER_ENV) console.log('\x1b[32m', `DOCKER_ENV: ${process.env.DOCKER_ENV}`, '\x1b[0m');

  // const url = process.env.DOCKER_ENV
  //   ? 'mongodb://mongo/'
  //   : 'mongodb://localhost:27017/';
  let url = 'mongodb://localhost:27017/';
  if (process.env.LOCAL !== '1' && process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD) url = (
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0-vsvxt.mongodb.net/?retryWrites=true&w=majority`
  );

  return mongoose.connect(
    url,
    { useNewUrlParser: true, reconnectInterval: 5000, dbName: 'clusters' },
  ).then(() => url);
};
