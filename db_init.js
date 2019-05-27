var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: ".data/db.sqlite3"
    },
    debug: true,
});

// création de la table
async function createTable() {  
  try{
    await knex.raw(`CREATE TABLE users (
    mail varchar(255) PRIMARY KEY,
    pwd varchar(255) NOT NULL
  )`);
  }
  catch(err){
     console.error('Erreur dans la création de la table');  
  }
   
}

// insertion d'un tuple dans une table
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

// suppression de la table
async function deleteTable() {
   await knex.raw(`DROP TABLE IF EXISTS users`);
}

// affichage de la table
async function printTableContent(){
  try{
    let rows = await knex('users');
    let str;
    for (var r of rows) {
      str="["+r.mail+" "+r.pwd+"]";
      console.log(str);
    }
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


// fonction principale
async function main(){
  await deleteTable();
  await createTable();
  await printTableContent();
  
  await knex.destroy();
}

// appel de la fonction principale
main();