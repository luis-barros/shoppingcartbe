const express = require('express');
const oDataServer = require('simple-odata-server');
const Adapter = require('simple-odata-server-mongodb')
const app = express();
const port = 3000;
const url = 'mongodb://localhost:27017'
const mongo = require('mongodb').MongoClient;

var model = {
    namespace: "test",
    entityTypes: {
        "listType": {
            "_id": {"type": "Edm.String", key: true},
            "name": {"type": "Edm.String"},
        }
    },
    entitySets: {
        "list": {
            entityType: "listType"
        }
    }
};

var odataServer = oDataServer().model(model);

mongo.connect(url, function(err, db) {
  odataServer.adapter(Adapter(function(cb) {
    cb(err, db.db('test'));
  }));
})
app.use("/odata", function(req, res) {
  odataServer.handle(req, res);
})
app.listen(port, () => console.log('listening on port ${port}'))
