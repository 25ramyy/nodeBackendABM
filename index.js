const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

  
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });

  let data;
  var mongoDb = require('mongodb');

  var mongoClient = mongoDb.MongoClient;
  var serverUrl = "mongodb://127.0.0.1:27017/";
  mongoClient.connect(serverUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
    var dbo = db.db("instrumentosdb");
    dbo.collection("instrumentos").find({}).toArray(function(err, result) {
        if (err) throw err;
        data=result[0].instrumentos;
    });
  
});
app.use(express.json());

app.get("/api", (req, res) => {
    res.json({ data});
    //console.log(data.length);
  });
  app.post("/suba", (req, res) => {

  console.log("post en proceso...");
  
  console.log(req.body);      // your JSON
  res.send(req.body); 


  mongoClient.connect(serverUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db2) {
    var dbo2 = db2.db("instrumentosdb");
    /*dbo2.collection("instrumentos").insertOne(req.body, function(err, res) {
      if (err) throw err;
    });*/
    dbo2.collection("instrumentos").updateMany({}, {$set:{
      "id": req.body.id, "instrumento": req.body.instrumento, "marca": req.body.marca,
      "modelo": req.body.modelo, "precio": req.body.precio, "costoEnvio":req.body.costoEnvio,
      "cantidadVendida": req.body.cantidadVendida, "descripcion":req.body.descripcion
    },})
    //console.log(data.length);
  });
  });

  app.post("/baja", (req, res) => {
    console.log("baja en proceso...");
    console.log(req.body);      // your JSON
    res.send(req.body);  
    mongoClient.connect(serverUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db2) {
      var dbo2 = db2.db("instrumentosdb");
      dbo2.collection("instrumentos").update({}, {$unset: {id:req.body.id}}, false, true);
    });
    });
  
  var corsMiddleware = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'localhost'); //replace localhost with actual host
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
    next();
}

app.use(corsMiddleware);