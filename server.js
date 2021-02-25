/** 
 * Arquivo:server.js
 * Descrição: 
 * Author: Lorrayne Costa
 * Data de criação: 11/02/2021
*/

//Configurar o setup da aplicação   

//Chamadas dos pacotes:
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const produto = require('./app/models/produto');
var Produto = require('./app/models/produto')


mongoose.Promise = global.Promise;

//Maneira local: MongoDB:
mongoose.connect('mongodb://localhost:27017/mongo', {
    useNewUrlParser: true, useUnifiedTopology: true
});

//Configurando a variável app para usar o 'bodyparser()', que retorna os dados apartir de um json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // app,use(express.json())

//Definindo a porta que será executada a API
var port = process.env.port || 8000;

//Rotas da nossa API:
//===============================================
//Criando uma instância das rotas via express
var router = express.Router();

//Middleware para usar em todos os requests enviados para a nossa API- Mensagem Padrão:
router.use(function (req, res, next) {
    console.log("algo está acontecendo aqui...");
    next();
})

//Rota de exemplo: 
//req: require e res: response
//Rota de Teste para sabermos se tudo está realmente funcionando (acessar através: GET: http://localhost:8000/api): 
router.get('/', function (req, res) {
    res.json({ message: 'Deu certo, seja bem vindo a nossa loja XYZ' })
});

//rotas que terminarem com './produtos' (servir: GET ALL & POST)
router.route('/produtos')

    /**
     * 1) Método: Criar produto (acessar em: POST http://localhost:8000/api/produtos )
     */
    .post(function (req, res) {
        var produto = new Produto();
        //Aqui vamos setor os campos do produto (via request)
        produto.nome = req.body.nome;
        produto.preco = req.body.preco;
        produto.descricao = req.body.descricao;

        produto.save(function (error) {
            if (error)
                res.send('Erro ao tentar salvar o produto :(', + error);

            res.json({ message: 'Produto cadastrado com sucesso' });
        });
    })

    /**
     * 2) Método: Selecionar todos os produtos (acessar em: GET http://localhost:8000/api/produtos )
     */

    .get(function (req, res) {
        Produto.find(function (error, produtos) {
            if (error)
                res.send('Erro ao selecionar todos os produtos.');

            res.json(produtos);
        });
    });

//Rotas que irão terminar em '/produtos/:produto_id' (servir tanto para: GET, PUT & DELETE: id):
router.route('/produtos/:produto_id')

    /* 3) Método: Selecionar por Id: (acessar em: GET http://localhost:8000/api/produtos/:produto_id) */
    .get(function (req, res) {

        //Função para poder Selecionar um determinado produto por ID - irá verificar se caso não encontrar um detemrinado
        //produto pelo id... retorna uma mensagem de error:
        Produto.findById(req.params.produto_id, function (error, produto) {
            if (error)
                res.send('Id do Produto não encontrado....: ' + error);

            res.json(produto);
        });
    })

    /* 4) Método: Atualizar por Id: (acessar em: PUT http://localhost:8000/api/produtos/:produto_id) */
    .put(function (req, res) {
        //Primeiro: para atualizarmos, precisamos primeiro achar 'Id' do 'Produto':
        Produto.findById(req.params.produto_id, function (error, produto) {
            if (error)
                res.send('Id do Produto não encontrado....: ' + error);

            //Segundo: 
            produto.nome = req.body.nome;
            produto.preco = req.body.preco;
            produto.descricao = req.body.descricao;

            //Terceiro: Agora que já atualizamos os dados, vamos salvar as propriedades:
            produto.save(function (error) {
                if (error)
                    res.send('Erro ao atualizar o produto....: ' + error);

                res.json({ message: 'Produto atualizado com sucesso!' });
            });
        });
    })

    /* 5) Método: Excluir por Id (acessar: http://localhost:8000/api/produtos/:produto_id) */
    .delete(function (req, res) {
        Produto.remove({
            _id: req.params.produto_id
        }, function (error) {
            if (error)
                res.send('Id do Produto não encontrado....: ' + error)

            res.json({
                message: "Produto excluído com sucesso!"
            })
        }
        )
    })

//Definindo um padrão das rotas prefixadas: '/api'
app.use('/api', router);

//Iniciando a aplicação: 
app.listen(port, () => {
    console.log("Iniciando a app na porta" + port);
});