//setting up database
const { Firestore } = require('@google-cloud/firestore')
const firestore = new Firestore({ keyFilename: './credentials/todo-svcaccount.json'});

module.exports = firestore