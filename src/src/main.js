import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./store"

const mqtt = require("mqtt");

// connection init to mqtt broker with web socket
const clientId = "HADIS-Client-" + Math.random().toString(16).substr(2, 8);
const host = "ws://docker-iot:9001";
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

// connection status listeners
mqttClient.on("error", err => {
    console.log("Connection error: ", err);
});

mqttClient.on("reconnect", () => {
    console.log("Reconnecting...");
});

mqttClient.on("connect", () => {
    console.log("Client connected: " + clientId);
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


// component registration for dynamic rendering

// setup dialog
import Dialog_DeviceSetup from "@/components/Dialog_DeviceSetup";
Vue.component("DeviceSetupDialog", Dialog_DeviceSetup);

// dimmable light
import DimmableLight from "@/components/DimmableLight";
Vue.component("DimmableLight", DimmableLight);

// wifi switch
import WifiSwitch from "@/components/WifiSwitch";
Vue.component("WifiSwitch", WifiSwitch);

// switchboard
import SwitchBoard from "@/components/SwitchBoard";
Vue.component("SwitchBoard", SwitchBoard);

// rgbw controller
import RGBWController from "@/components/RGBW-Controller";
Vue.component("RGBW-Controller", RGBWController);

// temperature & humidity sensor
import TempHumSensor from "@/components/TempHumSensor";
Vue.component("TempHumSensor", TempHumSensor);

// vue init
new Vue({
    store,
    router,
    vuetify,
    render: h => h(App)
}).$mount("#app");



