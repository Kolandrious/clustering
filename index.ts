import dotenv from 'dotenv-extended';
dotenv.load();
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import { connectMongo } from './src/utils';
import root from './src/root';
import area from './src/area';
import mapView from './src/map';
import box from './src/box';

connectMongo().then((url: any) => {
  console.log('\x1b[32m', `${url} connected`, '\x1b[0m');
}).catch((err: any) => console.error('connection error:', err));

const app = express();
app.set('views', path.join(path.resolve(), 'views'));
app.set('view engine', 'ejs');
app.use(express.static('static'));
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
root(app);
area(app);
box(app);
mapView(app);

app.listen(PORT, () => {
  console.log('\x1b[32m', `server listening to ${PORT}`, '\x1b[0m');
});
