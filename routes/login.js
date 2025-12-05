const express = require('express');
const router = express.Router();

const authRouter = require('./auth');

router.use(express.urlencoded({ extended: true }));

router.get('/login', function (req, res) {
  if (req.session && req.session.loggedin) {
    console.log(req.session.username)
    return res.redirect('/');
  }
  res.render('login.ejs', { error: false, signupError: false });
});

router.get('/signup', function (req, res) {
  if (req.session && req.session.loggedin) {
    return res.redirect('/');
  }
  res.render('login.ejs', { error: false, signupError: false });
});

router.post('/login', async function (req, res, next) {
  const identifier = req.body.identifier || req.body.email || req.body.username;
  const password = req.body.password;
  if (!identifier || !password) return res.status(400).send('Bad request!');

  try {
    const user = await authRouter.authUtils.authenticate(identifier, password);
    if (!user) {
      return res.render('login.ejs', { error: true, signupError: false });
    }
    req.session.loggedin = true;
    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.username = user.username;
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

router.post('/sign', async function (req, res, next) {
  const { email, username, password, confirm_password } = req.body || {};
  if (!email || !username || !password) return res.status(400).send('Bad request!');
  if (password !== confirm_password) return res.render('login.ejs', { error: false, signupError: true });

  try {
    await authRouter.authUtils.createUser({ email, username, password });
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('login.ejs', { error: false, signupError: true });
  }
});

router.get('/logout', function (req, res) {
  if (req.session) req.session.destroy(() => {});
  res.redirect('/login');
});

module.exports = router;
