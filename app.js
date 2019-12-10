import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import express from 'express';
import session from 'express-session';
import logger from 'morgan';
import path from 'path';

import index_router from './routes/index';
import oauth_router from './routes/oauth';

// App setup
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('g38l5lt7lgq1dm2li7g6jw2gmnr0p3e2mmapfxw9'));
app.use(session({
  secret: 'g38l5lt7lgq1dm2li7g6jw2gmnr0p3e2mmapfxw9',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index_router);
app.use('/oauth', oauth_router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Start server
app.listen(3000, () => {
  console.log('Server is listening on port 3000: http://localhost:3000/')
});

export default app;
