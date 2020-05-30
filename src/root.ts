import { Express } from 'express';
import { Points } from './models.js';

export default (app: Express) => app.route('/')
  .get(async (_req, res) => {
    try {
      const pointsFromDb = await Points.find().exec();
      res.render('index', { points: pointsFromDb });
    } catch (err) {
      console.log(err);
      res.render('index', { points: [] });
    }
  })
  .post((req, res) => {
    const { text } = req.body;
    console.log(text);
    res.send(text);
  })
