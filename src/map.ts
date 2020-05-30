import { Express } from 'express';

export default (app: Express) => app.route('/map')
  .get(async (_req, res) => {
    res.render('leafletMap');
  });
