app.use((req, res, next) => {
  res.locals.session = req.session; // ทำให้ session ใช้ได้ในทุก ejs
  next();
});