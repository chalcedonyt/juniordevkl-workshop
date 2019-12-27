//setting up database
const { Firestore } = require('@google-cloud/firestore')
const firestore = new Firestore({ keyFilename: './credentials/svc-account.json'});

module.exports = firestore