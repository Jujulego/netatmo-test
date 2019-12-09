import createError from 'http-errors';
import express from 'express';

import { create as createOAuth2 } from 'simple-oauth2';

// OAuth2
const oauth2 = createOAuth2({
  client: {
    id: '5dee605c00c28cae3b527c76',
    secret: 'osQ4jt016T6zIXhz9aUTfySNv'
  },
  auth: {
    tokenHost: 'https://api.netatmo.com',
    tokenPath: '/oauth2/token',
    revokePath: '/oauth2/revoke',
    authorizePath: '/oauth2/authorize'
  }
});

// Setup router
const router = express.Router();

router.get('/step1', (req, res, next) => {
  const scope = 'read_station';
  const state = 'qsdfghjkl';

  const auth_uri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: 'http://localhost:3000/oauth/step2',
    scope, state
  });

  res.redirect(auth_uri);
});

router.get('/step2', async (req, res, next) => {
  const { code } = req.query;
  const options = {
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost:3000/oauth/step2',
    code
  };

  try {
    const token = await oauth2.authorizationCode.getToken(options);
    req.session.token = token;

    res.status(200).json(token);
  } catch (err) {
    console.error('Access token error', err);
    next(createError(500, 'Authentification failed !'));
  }
});

export default router;
