const { MongoClient } = require('mongodb');


const uri  = "mongodb+srv://oviegolde456:admin@cluster0.fftyd.mongodb.net/"
const client = new MongoClient(uri)

let db;

async function connectToDB() {
    try {
        await client.connect();
        db - client.db('database');
        console.log('Connected to MongoDB');
        console.log('Connected to database:' , db.databaseName);
    } catch (error) {
        console.error('error connecting to MongoDB:', error);
        process.exit(1);
    }
}

function getDB() {
    if (!db) throw new Error('Database not initialized');
    return db;
}

module.exports = {connectToDB, getDB};
