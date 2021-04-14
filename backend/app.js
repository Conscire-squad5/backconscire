var app = require('./App/config/server');

var rotaHome = require('./App/routes/Audit')(app);
var rotaHome = require('./App/routes/Comentario')(app);
var rotaHome = require('./App/routes/Login')(app);
var rotaHome = require('./App/routes/Monitoramento')(app);


app.get("/", (req, res) =>{ //Raiz
    res.end("<html><h1> Hello world </h1> </html>")
})
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
