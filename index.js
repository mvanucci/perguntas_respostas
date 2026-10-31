const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');

//Configurando o EJS.
app.set('view engine', 'ejs');

//Definição de arquivos estáticos
app.use(express.static('public'));

//Configuração do BodyParser no Express
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
        Pergunta.findAll({
                raw: true,
                order: [['id', 'DESC']]
        }).then(perguntas => {
                res.render('index', {
                        perguntas: perguntas
                });
        });

        
});

app.get('/perguntar', (req, res) => {
        res.render('perguntar');
});

app.post('/salvarpergunta', (req, res) => {
        let titulo = req.body.titulo;
        let descricao = req.body.descricao;

        Pergunta.create({
                titulo: titulo,
                descricao: descricao
        }).then(()=>{
                res.redirect('/');
        }).catch((err) => {
                console.log("Erro ao cadastrar uma pergunta... :(");
        });
});

app.get('/pergunta/:id', (req, res) => {
        let id = req.params.id;
        Pergunta.findOne({
                where: {id: id}
        }).then(pergunta => {
                if (pergunta != undefined) {
                        Resposta.findAll({
                                where: {perguntaId: pergunta.id},
                                order:[[ 'id','DESC' ]]
                        }).then(resp => {
                                res.render('pergunta', {
                                        pergunta: pergunta,
                                        respostas: resp
                                });
                        });
                        
                        
                } else {
                        res.redirect('/');
                }
        });
});

app.post('/responder', (req, res) => {
        let corpo = req.body.corpo;
        let perguntaId = req.body.pergunta;

        Resposta.create({
                corpo: corpo,
                perguntaId: perguntaId
        }).then(() => {
                res.redirect('/pergunta/'+perguntaId);
        }).catch(err => {
                console.log("Erro ao cadastrar uma resposta..; :(");
        })
});

// Prepare as tabelas antes de aceitar requisições.
async function start() {
    try {
        await connection.authenticate();
        await connection.sync({ force: false });
        app.listen(8080, () => { console.log('App rodando na porta 8080 com SQLite'); });
    } catch (err) {
        console.error('Erro ao inicializar o banco SQLite:', err);
        await connection.close();
        process.exitCode = 1;
    }
}

start();
