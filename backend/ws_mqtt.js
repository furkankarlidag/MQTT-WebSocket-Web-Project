const mqtt = require('mqtt');
const MQTTUser = require('./config.js');

let client = null;
const topic = MQTTUser.topic;
const URL = `mqtt://${MQTTUser.host}:${MQTTUser.port}`;
function runMQTT(server) {
  console.log("runMQTT calisti");
  if (!client) {
    client = mqtt.connect(URL, {
      clientId: "mqtt_WS_Service",
      clean: true,
      connectTimeout: 4000,
      username: MQTTUser.username,
      password: MQTTUser.password,
    });

    client.on('connect', () => {
      console.log('MQTT client connected');
      client.subscribe([topic], (err) => {
        if (err) {
          console.error('Subscribe error:', err);
        } else {
          console.log(`Subscribed to topic '${topic}'`);
        }
      });
    });

    client.on('message', (topic, payload) => {
      server.clients.forEach((client) => {
        if (client.readyState) {
          client.send(payload.toString());
        }
      });
    });
  }
}

function closeMQTT() {
  if (client) {
    client.end(() => {
      console.log('MQTT disconnected');
      client = null;
    });
  }
}

function statusOfMQTT() {
  return client ? "connected" : "disconnected";
}

module.exports = { runMQTT, closeMQTT, statusOfMQTT };
