const { MongoClient } = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://adrianadame01:lambda-2022@cluster0.6mok6gs.mongodb.net/?retryWrites=true&w=majority";

var _db;

const connectDB = () => {
    const client = new MongoClient(uri);

    _db = client.db('papeleria-pincelin')
    console.log("Create Connection");
}

const getDB = () => _db;

const getCollection = (name) => _db.collection(name)

module.exports = {connectDB, getDB, getCollection};