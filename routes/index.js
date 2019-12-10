import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const token = req.session.token;

  if (token === undefined) {
    res.render('not-logged', { title: 'Netatmo Challenge' })
  } else {
    res.render('index', { title: 'Netatmo Challenge' });
  }
});

export default router;