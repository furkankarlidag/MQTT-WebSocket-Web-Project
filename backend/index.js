const Ws = require("./ws_mqtt");
const sql = require("./postreSQL");

const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8070 });
 
const express = require('express');
const cors = require("cors");
const app = express();
const port = 3000;

let devices = [];

app.use(express.json());
app.use(cors());

app.get("/api/devices/read", (req, resq) => {
  var sendingData;
  const { Client } = require('pg');
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'furkan1158',
    database: "macAdres",
  });
  var jsonData;
  client.connect();
  client.query("SELECT dmac,time FROM devices", (err, res) => {
    if (!err) {
      const data = res.rows;
      resq.send(data);
    }

    else
      console.log(err);
    client.end();
  });
});

//Ws.runMQTT(server);
//Ws.closeMQTT(server);

app.post('/api/devices/add', (req, res) => {
  let data = req.body;
  sql.ekleDB(data.dmac, data.time);
  res.status(200).send("device is added");
});

app.post('/api/devices/runMQTT', (req, res) => {
  Ws.runMQTT(server);
  res.status(200).send("mqtt is running");
});


app.post('/api/devices/closeMQTT', (req, res) => {
  Ws.closeMQTT();
  res.status(200).send("mqtt is closed");
});

app.get('/api/devices/statusOfMQTT', (req, res) => {
  let status = Ws.statusOfMQTT();
  res.send(status);
});

app.delete("/api/devices/delete", (req, res) => {
  let data = req.body;
  sql.deleteRows(data.dmac);
  res.send("device is deleted");
});

app.listen(port, () => {
  console.log(`server is running on ${port} .`);
});
