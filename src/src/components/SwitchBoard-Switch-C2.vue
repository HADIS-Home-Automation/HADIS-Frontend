<template>

  <!-- switch row -->
  <v-row align="center" justify="space-between">

    <!-- switch -->
    <v-col cols="4" class="pa-0">
      <v-switch :disabled="status === 'OFFLINE'" @change="publish1" v-model="isOn1" inset :label="`${deviceConfig.deviceNameDISPLAY1}`"/>
    </v-col>

    <!-- status indicator & setup button -->
    <v-col cols="6" >
      <div class="text-right" :style="{color: statusColor}"><b>{{ status }}  </b>

        <!-- setup button -->
        <v-btn :disabled="status === 'OFFLINE'"  icon @click.stop="dialog=true" x-small>
          <v-icon>mdi-cog</v-icon>
        </v-btn>

        <!-- setup dialog -->
        <DeviceSetupDialog v-model="dialog" :device-config="this.deviceConfig"/>

      </div>
    </v-col>

    <!-- switch -->
    <v-col cols="4" class="pa-0">
      <v-switch :disabled="status === 'OFFLINE'" @change="publish2" v-model="isOn2" inset :label="`${deviceConfig.deviceNameDISPLAY2}`"/>
    </v-col>

  </v-row>
</template>

<script>
import {mqttClient} from "@/main";

export default {
  name: "SwitchBoardSwitch",
  components: {},
  data: () => ({
    isOn1: false,
    isOn2: false,
    status: 'OFFLINE',
    dialog: false,
    unsubscribe: null,
  }),
  computed: {
    // generate mqtt topics
    topicSwitch1() {
      return "HADIS/" + this.deviceConfig.deviceName + "/SWITCH1"
    },
    topicSwitch2() {
      return "HADIS/" + this.deviceConfig.deviceName + "/SWITCH2"
    },
    topicStatus() {
      return "HADIS/" + this.deviceConfig.deviceName + "/STATUS"
    },

    // calculate device status color & get vuetify theme colors
    statusColor() {
      if (this.status === "ONLINE") return this.$vuetify.theme.themes.dark.success
      if (this.status === "OFFLINE") return "#863539"

      // saved for light mode color
      //if (this.status === "OFFLINE") return "#fd989d"
      return 'gray'
    },

  },
  methods: {
    // publish switch state to mqtt
    publish1() {
      let mqttMessage = this.isOn1 ? "1" : "0";
      mqttClient.publish(this.topicSwitch1, mqttMessage, {qos: 0, retain: true})
    },
    publish2() {
      let mqttMessage = this.isOn2 ? "1" : "0";
      mqttClient.publish(this.topicSwitch2, mqttMessage, {qos: 0, retain: true})
    },
  },
  props: {
    deviceConfig: Object,
  },
  created() {
    // initialisation for vuex store mutation subscription
    this.unsubscribe = this.$store.subscribe((mutation) => {

      let messageState = mutation.payload;
      //console.log(messageState.msg + " on: " + messageState.topic)

      // handle message for device status
      if (messageState.topic === this.topicStatus) {
        this.status = messageState.msg.toString();
      }

      // handle message for device toggling
      if (messageState.topic === this.topicSwitch1) {
        this.isOn1 = !!parseInt(messageState.msg.toString());
      }
      if (messageState.topic === this.topicSwitch2) {
        this.isOn2 = !!parseInt(messageState.msg.toString());
      }

    });
  },
  // on component mount subscribe to required mqtt topics
  mounted() {
    mqttClient.subscribe(this.topicStatus);
    mqttClient.subscribe(this.topicSwitch1);
    mqttClient.subscribe(this.topicSwitch2);
  },
  // on component destroy unsubscribe from mqtt topics & vuex mqtt message store
  destroyed() {
    this.unsubscribe();
    mqttClient.unsubscribe(this.topicSwitch1);
    mqttClient.unsubscribe(this.topicSwitch2);
    mqttClient.unsubscribe(this.topicStatus);
  }
};
</script>