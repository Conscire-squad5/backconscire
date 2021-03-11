const {check, validationResult } = require("express-validator");
const db = require('../config/database.js')


module.exports = function (app){
    const database=db();
    app.get('/comentarios/retorna', (req, res)=>{
    
        const sql = "SELECT * FROM  comentarios;";
        database.query(sql, (error, results) =>{
            res.json(results)  
        })
    })
    
    app.get('/comentarios/envia', (req, res)=>{
        res.json( {auth: false, validacao:{errors:{},}, dados:{}});  
    })
    
    app.post('/comentarios/envia', [ 
        check('nome', 'Nome é obrigatório com pelo menos 3 caracteres').exists().isLength({min:3}),
        check('sobrenome', 'Sobrenome é obrigatório com pelo menos 3 caracteres').exists().isLength({min:3}),
        check('msg', 'A mensagem precisa ter pelo menos 3 caracteres').exists().isLength({min:3}),
    ], (req, res)=>{
        
        const {nome, sobrenome, msg} = req.body; //Desestruturação do corpo da requisiçao em dois elementos que iremos enviar ao bd
        var errors = validationResult(req);
        if(!errors.isEmpty()){
            res.json({auth: false, validacao:errors, dados: [nome, sobrenome, msg]})
            console.log(errors);
            return;
        }
        const sql = `INSERT INTO comentarios (nome, sobrenome, msg) values ('${nome}', '${sobrenome}', '${msg}')`;
        database.query(sql, (error, results) =>{
            const newLocal = "Agradecemos pela mensagem - valeu";
            res.json({auth: false, validacao:errors, message: newLocal})
    
        })
        
    })
}    