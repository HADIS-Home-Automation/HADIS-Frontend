<template>
  <v-col cols="10" lg="5" xl="5">
    <!-- dimmable light card -->
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
        <v-row class="mb-4" justify="space-between">

          <!-- toggle button -->
          <v-col class="text-center">
            <v-btn dark depressed rounded x-large :color="color" @click="toggle">
              <v-icon class="pr-3" large >
                {{ isOn ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off-outline' }}
              </v-icon>
               Switch: {{ isOn ? 'ON' : 'OFF'}}
            </v-btn>
          </v-col>

        </v-row>

      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import {mqttClient} from "@/main";

export default {
  name: "WifiSwitch",
  components: {},
  data: () => ({
    isOn: false,
    status: 'OFFLINE',
    dialog: false,
    unsubscribe: null,
  }),
  computed: {
    // generate mqtt topics
    topicSwitch() {
      return "HADIS/" + this.deviceConfig.deviceName + "/SWITCH"
    },
    topicStatus() {
      return "HADIS/" + this.deviceConfig.deviceName + "/STATUS"
    },

    // toggle button color
    color() {
      return this.isOn ? 'primary' : 'gray';
    },
    // calculate device status color & get vuetify theme colors
    statusColor() {
      if (this.status === "ONLINE") return this.$vuetify.theme.themes.dark.success
      if (this.status === "OFFLINE") return this.$vuetify.theme.themes.dark.error
      return 'gray'
    },

  },
  methods: {
    // handle switch toggle on button press
    toggle() {
      this.isOn = !this.isOn
      this.publish();
    },
    // publishCommand switch state to mqtt
    publish() {
      let mqttMessage = this.isOn ? "1" : "0";
      mqttClient.publish(this.topicSwitch, mqttMessage, {qos: 0, retain: true})
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
      if (messageState.topic === this.topicSwitch) {
        this.isOn = !!parseInt(messageState.msg.toString());
      }

    });
  },
  // on component mount subscribe to required mqtt topics
  mounted() {
    console.log(this.topicStatus)

    mqttClient.subscribe(this.topicStatus);
    mqttClient.subscribe(this.topicSwitch);
  },
  // on component destroy unsubscribe from mqtt topics & vuex mqtt message store
  destroyed() {
    this.unsubscribe();
    mqttClient.unsubscribe(this.topicSwitch);
    mqttClient.unsubscribe(this.topicStatus);
  }
};
</script>

