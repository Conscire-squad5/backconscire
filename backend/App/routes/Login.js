const {check, validationResult } = require("express-validator");
const saltRounds = 10
const db = require('../config/database.js')

module.exports = function (app){
    const database=db();
    app.get("/", (req, res) =>{ //Raiz
        res.end("<html><h1> Hellooooooooooooo world </h1> </html>")
    })
    
    app.post('/register', [ 
        check('nome', 'Nome é obrigatório com pelo menos 3 caracteres').exists().isLength({min:3}),
        check('email', 'Email é obrigatório').isEmail().normalizeEmail(),
        check('senha', 'A senha precisa ter no mínimo 5 dígitos e no máximo 8!').exists().isLength({min:5,max:8}),
        check('confirme', 'A senha precisa ser igual a digitada anteriormente!').exists().isLength({min:5,max:8}),
    ], (req, res) =>{
        //res.header("Access-Control-Allow-Origin", "https://conscire-front.herokuapp.com"); 
        const nome = req.body.nome;
        const email = req.body.email;
        const senha= req.body.senha;
        const confirme= req.body.confirme;
        var errors = validationResult(req);
            if(!errors.isEmpty()){
                res.json({auth: false, validacao:errors, dados: [nome, email, senha]})
                console.log(errors);
                return;
            }
        if(senha==confirme){
            bcrypt.hash(senha, saltRounds, (error, hash)=>{
                if(error){
                    console.log(error)
                }
                const sql = (`SELECT * FROM login WHERE email = '${email}'`)
                database.query(sql, (error, results)=>{
                    if(error){
                        console.log(error)
                        res.send({error: error})
                    }if (results.length > 0){
                        bcrypt.compare(senha, results[0].SENHA, (errors, response)=>{
                            if(response){
                                const id = results[0].ID
                                const token = jwt.sign({id}, "jwtSecret", {
                                    expiresIn: 300,
                                })
                                req.session.user = results;
                                console.log(req.session.user[0].EMAIL)
    
                                res.json({auth: false, validacao:errors,  token: token, results: results})
                                
                            }else{
                                res.json({auth: false, validacao:errors, message: "Email já cadastrado!"})
                            }
                        })
                    }else{
                        const sql = `INSERT INTO login (nome, email, senha) VALUES('${nome}', '${email}', '${hash}')`;
                        database.query(sql, (error, results) =>{    
                            const newLocal = "Cadastro realizado com sucesso";
                            res.json({auth: false, validacao:errors, message: newLocal})
                        })
                    }
                })
            })
        }else{
            const newLocal = "As senhas estão diferentes";
            res.json({auth: false, validacao:errors, message: newLocal})
            console.log('As senhas estão diferentes')  
        }
    })
    
    
    
    
    
    app.post('/login', (req, res) =>{
        //res.header("Access-Control-Allow-Origin", "https://conscire-front.herokuapp.com");
      
        const email = req.body.email;
        const senha= req.body.senha;
    
        const sql = (`SELECT * FROM login WHERE email = '${email}'`)
        database.query(sql, (error, results)=>{
            if(error){
                console.log(error)
                res.send({error: error})
            }if (results.length > 0){
                bcrypt.compare(senha, results[0].senha, (error, response)=>{
                    console.log(results[0].senha)
                    if(response){
                        
                        const id = results[0].ID
                        const token = jwt.sign({id}, "jwtSecret", {
                            expiresIn: 300 * 300,
                        })
    
                        req.session.user = results;
                        EmailSession = req.session.user[0].email
                        console.log(req.session.user[0].nome)
    
                        res.json({auth: true, token: token, results: EmailSession})                         
                    }else{
                        console.log(senha)
                        res.json({auth: false, message: "Senha errada!"})
                    }
                })
            }else{
                res.json({auth: false, message: "Este usuário não existe"})
            }
        })
    })
    
    const verifyJWT = (req, res, next)=>{
        const token = req.headers['x-acess-token'];
    
        if(!token){
            res.send("Você não está logado")
        }else{
            jwt.verify(token, "jwtSecret", (err, decoded)=>{
                if(err){
                    res.json({auth: false, message: "Falha na autenticação"})
                }else{
                    req.userId = decoded.ID;
                    next();
                }
            })
        }
    }
    
    app.get('/isUserAuth', verifyJWT, (req, res)=>{
        res.send("Usuário autenticado com sucesso, boas vindas ao Projeto Conscire!")
    })
    
    app.get('/login', (req, res)=>{
        if(req.session.user){
            res.send({loggedIn: true, user: req.session.user})
        }else{
            res.send({loggedIn: false})
        }
    })
}
