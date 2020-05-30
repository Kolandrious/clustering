import { Express } from 'express';
import { Points } from './models.js';

const getLengthBetween2Points = (a: number, b: number) => Math.abs(Math.max(a, b) === a ? a - b : b - a);

export default (app: Express) => app.route('/box')
  .get(async (req, res) => {
    try {
      // /box?northEastLat=number&northEastLng=number&southWestLat=number&southWestLng=number
      const {
        northEastLat = '54.227',
        northEastLng = '8.097',
        southWestLat = '49.760',
        southWestLng = '1.626',
      } = req.query;

      let coordinates = [
        [ +southWestLng, +northEastLat ],
        [ +northEastLng, +northEastLat ],
        [ +northEastLng, +southWestLat ],
        [ +southWestLng, +southWestLat ],
        [ +southWestLng, +northEastLat ],
      ];
      const lengthLeftToRight = getLengthBetween2Points(+southWestLng, +northEastLng);
      console.log("length " + lengthLeftToRight);
      if (lengthLeftToRight >= 180) {
        const partialLengthForNewPoint = lengthLeftToRight / 3;
        const mediatePointsLeftToRight = [
          [ +southWestLng + partialLengthForNewPoint, +northEastLat ],
          [ +southWestLng + 2 * partialLengthForNewPoint, +northEastLat ]
        ];
        const mediatePointsRightToLeft = [
          [ +northEastLng - partialLengthForNewPoint, +southWestLat ],
          [ +northEastLng - 2 * partialLengthForNewPoint, +southWestLat ],
        ];
        coordinates = [
          coordinates[0],
          ...mediatePointsLeftToRight,
          [ +northEastLng, +northEastLat ],
          [ +northEastLng, +southWestLat ],
          ...mediatePointsRightToLeft,
          [ +southWestLng, +southWestLat ],
          [ +southWestLng, +northEastLat ],
        ];
      }
      
      console.log(coordinates);

      const pointsFromDb = await Points.find({
        coordinates: {
          $geoWithin: {
            $geometry: {
              type: "Polygon",
              coordinates: [coordinates],
            },
          },
        },
      });

      console.log(pointsFromDb.length);
      res.send(pointsFromDb.map((point) => ({ id: point._id, lat: point.coordinates[1], long: point.coordinates[0] })));
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err.errmsg,
        codeName: err.codeName,
      });
    }
  });
