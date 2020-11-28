<template>
  <v-col cols="12" >

    <!-- sensor card -->
    <v-card :disabled="status === 'OFFLINE'" class="ma-auto rounded-lg" >

      <!-- card toolbar -->
      <v-toolbar flat>
        <v-toolbar-title><b>{{ this.deviceConfig.deviceNameDISPLAY }}</b></v-toolbar-title>
        <v-spacer></v-spacer>

        <!-- status indicator -->
        <div :style="{color: statusColor}"><b>{{ status }}</b></div>

        <!-- setup button -->
        <v-btn icon @click.stop="dialog=true">
          <v-icon>mdi-cog</v-icon>
        </v-btn>

        <!-- setup dialog -->
        <DeviceSetupDialog v-model="dialog" :device-config="this.deviceConfig" />

      </v-toolbar>

      <!-- card body -->
      <v-card-text>

        <!-- card text -->
        <v-row class="mb-4" justify="center" >

          <!-- temperature indicator -->
          <v-col class="text-center" >
            <span class="subheading font-weight-light mr-1">Temperature: </span><br>
            <span class="display-3 font-weight-light">{{ temp }}°C</span>
          </v-col>

          <!-- humidity indicator -->
          <v-col class="text-center">
            <span class="subheading font-weight-light mr-1">Humidity: </span><br>
            <span class="display-3 font-weight-light">{{ hum }}%</span>
          </v-col>

        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import {mqttClient} from "@/main";
export default {
  name: "TempHumSensor",
  components: {},
  data: () => ({
    temp: 0,
    hum: 0,
    status: 'OFFLINE',
    dialog: false,
    unsubscribe: null,
  }),
  computed: {
    // generate mqtt topics
    topicTemp() {
      return "HADIS/" + this.deviceConfig.deviceName + "/TEMP"
    },
    topicHum() {
      return "HADIS/" + this.deviceConfig.deviceName + "/HUM"
    },
    topicStatus() {
      return "HADIS/" + this.deviceConfig.deviceName + "/STATUS"
    },
    // calculate device status color & get vuetify theme colors
    statusColor() {
      if (this.status === "ONLINE") return this.$vuetify.theme.themes.dark.success
      if (this.status === "OFFLINE") return this.$vuetify.theme.themes.dark.error
      return 'gray'
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
      // handle message for device brightness
      if (messageState.topic === this.topicTemp) {
        this.temp = parseFloat(messageState.msg.toString()).toFixed(2);
      }
      // handle message for device brightness toggle value
      if (messageState.topic === this.topicHum) {
        this.hum = parseFloat(messageState.msg.toString()).toFixed(2);
      }
    });
  },
  // on component mount subscribe to required mqtt topics
  mounted() {
    mqttClient.subscribe(this.topicStatus);
    mqttClient.subscribe(this.topicTemp);
    mqttClient.subscribe(this.topicHum);
  },
  // on component destroy unsubscribe from mqtt topics & vuex mqtt message store
  destroyed() {
    this.unsubscribe();
    mqttClient.unsubscribe(this.topicTemp);
    mqttClient.unsubscribe(this.topicHum);
    mqttClient.unsubscribe(this.topicStatus);
  }
};
</script>