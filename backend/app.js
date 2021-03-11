var app = require('./App/config/server');

var rotaHome = require('./App/routes/Audit')(app);
var rotaHome = require('./App/routes/Comentario')(app);
var rotaHome = require('./App/routes/Login')(app);
var rotaHome = require('./App/routes/Monitoramento')(app);

app.listen(5000, function(){
    console.log("Servidor rodando na porta 5000!");
});

