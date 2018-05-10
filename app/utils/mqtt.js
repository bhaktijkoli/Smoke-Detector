import { Client, Message } from 'react-native-paho-mqtt';
import consts from './consts';
import  PushNotification from 'react-native-push-notification';


const myStorage = {
  setItem: (key, item) => {
    myStorage[key] = item;
  },
  getItem: (key) => myStorage[key],
  removeItem: (key) => {
    delete myStorage[key];
  },
};

module.exports.init = () => {
  if(!global.mqtt) {
    global.mqtt = new Client({ uri: consts.MQTT_ADDRESS, clientId: 'Smoke Detector App', storage: myStorage });

    mqtt.on('connectionLost', (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log(responseObject.errorMessage);
      }
    });
    mqtt.on('messageReceived', (message) => {
      var topic = message.destinationName;
      var payload = message.payloadString;
      console.log("MQTT Message Recieved: Topic: " + topic + " payload: " + payload);
      PushNotification.localNotification({
        message: "Alert", // (required)
      });
    });

    // connect the client
    mqtt.connect({userName:'admin', password:'root'})
    .then(() => {
      console.log('MQTT Connected.');
      var topicHead = "/admin/smoke/"
      mqtt.subscribe(topicHead);
    })
    .catch((responseObject) => {
      console.log(JSON.parse(responseObject));
    })
  }
}
