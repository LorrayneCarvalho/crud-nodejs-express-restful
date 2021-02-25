/**
 * Arquivo: produto.js
 * Descrição: arquivo onde trataremos o modelo de classe 'Produto' 
 * Author:  Lorrayne Carvalho
 * Data de criação: 11/02/2021
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

/**
 * Produto: 
 * -> id: int
 * -> Nome: String
 * -> Preço: Number
 * -> Descrição: String
 */


 let ProdutoSchema = new Schema({
     nome: String,
     preco: Number,
     descricao: String
 })

 module.exports = mongoose.model('Produto', ProdutoSchema);