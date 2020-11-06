import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./store"

const mqtt = require("mqtt");

// connection init to mqtt broker with web socket
const clientId = "HADIS-Client-" + Math.random().toString(16).substr(2, 8);
const host = "ws://10.0.0.71:8883";
const options = {
    keepalive: 60,
    clientId: clientId,
    protocolId: "MQTT",
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000
};

// connect to broker
export let mqttClient = mqtt.connect(host, options);
console.log(mqttClient);

// connection status listeners
mqttClient.on("error", err => {
    console.log("Connection error: ", err);
});

mqttClient.on("reconnect", () => {
    console.log("Reconnecting...");
});

mqttClient.on("connect", () => {
    console.log("Client connected:" + clientId);
});

// mqtt message listener
mqttClient.on('message',  (topic, message) => {
    //console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)

    // create a message object with msg and topic
    let mqttMessage = {};
    mqttMessage["msg"] =  message.toString();
    mqttMessage["topic"] =  topic;

    // commit the message object to vuex store
    store.commit('setMessage', mqttMessage );
})

Vue.config.productionTip = false;

new Vue({
    store,
    router,
    vuetify,
    render: h => h(App)
}).$mount("#app");



