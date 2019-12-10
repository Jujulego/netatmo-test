import axios from 'axios';
import createError from 'http-errors';
import express from 'express';
import _ from 'lodash';

// Constants
const DEVICE_ID = '70:ee:50:02:5e:64';
const MODULE_ID = '02:00:00:02:38:da';

// Utils
function compute_stats(data) {
  let min = Infinity;
  let max = -Infinity;
  let moy = 0;
  let count = 0;

  data.forEach(val => {
    if (val < min) min = val;
    if (val > max) max = val;

    moy = (count * moy + val) / (count + 1);
    count++;
  });

  return { min, max, moy };
}

// Router
const router = express.Router();

router.get('/', async (req, res, next) => {
  const token = req.session.token;

  if (token === undefined) {
    res.render('not-logged', { title: 'Netatmo Challenge' })
  } else {
    const now = new Date().getTime() / 1000;
    const last7 = now - (7 * 24 * 3600);

    const result = await axios.get('https://api.netatmo.com/api/getmeasure', {
      params: {
        access_token: token.access_token,
        device_id: DEVICE_ID,
        module_id: MODULE_ID,
        scale: 'max',
        type: 'Temperature,Humidity',
        date_begin: last7,
        date_end: now,
        optimize: 'false',
        real_time: 'true'
      }
    });

    if (result.status !== 200) {
      console.log(result.data);
      next(createError(500, 'Api call failed !'))
    } else {
      res.render('index', {
        title: 'Netatmo Challenge',
        device: DEVICE_ID,
        module: MODULE_ID,
        temperature: compute_stats(_.map(result.data.body, val => val[0])),
        humidity: compute_stats(_.map(result.data.body, val => val[1]))
      });
    }
  }
});

export default router;