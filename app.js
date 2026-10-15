const express = require('express');
const session = require('express-session');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // ganti true kalau sudah memakai https
    sameSite: true // untuk security dari CSRF attack
  }
}));

// Variabel yang bisa dibaca semua view
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.appName = 'Tukang Gercep'; // ganti di sini kalau mau TukangTemu
  next();
});

const router = require('./routes');
app.use(router);

app.listen(port, () => {
  console.log(`Tukang Gercep berjalan di http://localhost:${port}`);
});