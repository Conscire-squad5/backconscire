const db = require('../config/database.js')

module.exports = function (app){
    const database=db();
    app.get('/monitoramento/retorna', (req, res)=>{
        
        var sql = "SELECT * FROM  monitoramento"
        database.query(sql, (error, results)=>{ 
            res.json(results) 
        })
    });
    
    app.post('/monitoramento/register', (req, res)=>{
        var {q1, q2, q3} = req.body;
        var sql = `INSERT INTO monitoramento (q1, q2, q3) values ('${q1}', '${q2}', '${q3}')`
        database.query(sql, (errors,results)=>{
            const newLocal = "Agradecemos pelo seu feedback!!";
            res.json({auth: false, validacao:errors, message: newLocal})
        })
    }); 
}


