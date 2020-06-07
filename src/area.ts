import { Express } from 'express';
import { Points } from './models';

export default (app: Express) => app.route('/area')
  .get(async (req, res) => {
    try {
      // /area?northEast=53.8460456413833,2.5927734375000004&southWest=49.30363576187125,-3.3837890625000004
      const {
        lat = 50,
        lng = 50,
        radius = 3000,
      } = req.query;
      console.log(req.query, `lat: ${lat}, lng: ${lng}, radius: ${radius}`);
      const pointsFromDb = await Points.aggregate([{
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [+lng, +lat],
          },
          distanceField: 'distance',
          spherical: true,
          maxDistance: (+radius) * 1000,
        },
      }]);
      // const pointsFromDb = await Points.find().where('location').within({

      // });
      console.log(pointsFromDb);
      res.render('index', { points: pointsFromDb });
    } catch (err) {
      console.log(err);
      res.render('index', { points: [] });
    }
  });
