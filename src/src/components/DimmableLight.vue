<template>

  <!-- dimmable light card -->
  <v-card :disabled="status === 'OFFLINE'" class="mx-auto" max-width="600">

    <!-- card toolbar -->
    <v-toolbar flat>
      <v-toolbar-title><b>{{ deviceName }}</b></v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- status indicator -->
      <div :style="{color: statusColor}"><b>{{ status }}</b></div>

      <!-- setup button -->
      <v-btn icon @click.stop="dialog=true">
        <v-icon>mdi-cog</v-icon>
      </v-btn>

      <!-- dialog temporary -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title class="headline">Start device's setup mode?</v-card-title>
          <v-card-text> By clicking <b>proceed</b> start the device's setup mode. This will disconnect the device from the broker and let you configure its settings.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary darken-1" text @click.stop="dialog=false">Cancel</v-btn>
            <v-btn color="primary darken-1" text @click.stop="dialog=false">Proceed</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-toolbar>

    <v-card-text>
      <!-- percentage text -->
      <v-row class="mb-4" justify="space-between">
        <v-col class="text-left">
          <span class="display-3 font-weight-light">{{ percent }}</span>
          <span class="subheading font-weight-light mr-1">%</span>
        </v-col>

        <!-- toggle button -->
        <v-col class="text-right">
          <v-btn dark depressed fab :color="color" @click="toggle">
            <v-icon large>
              {{ isOn ? 'mdi-lightbulb-on-outline' : 'mdi-lightbulb-outline' }}
            </v-icon>
          </v-btn>
        </v-col>

      </v-row>

      <!-- slider -->
      <v-slider v-model="sliderValue" @change="publish()" hange="" track-color="grey" min="0" max="1023" step="32" thumb-label>
        <template v-slot:prepend>
          <v-icon @click="decrement">mdi-minus</v-icon>
        </template>
        <template v-slot:append>
          <v-icon @click="increment">mdi-plus</v-icon>
        </template>
      </v-slider>


    </v-card-text>
  </v-card>
</template>

<script>
import {mqttClient} from "@/main";

// initialisation for vuex store mutation subscription
let unsubscribe;

export default {
  name: "DimmableLight",
  components: {},
  data: () => ({
    sliderValue: 0,
    brightnessToggleMemory: 1023,
    percent: 0,
    isOn: false,
    status: 'OFFLINE',
    dialog: false,
  }),
  computed: {
    // generate mqtt topics
    topicLight() {
      return "HADIS/" + this.groupName + "/" + this.deviceName + "/LIGHT"
    },
    topicLightToggle() {
      return "HADIS/" + this.groupName + "/" + this.deviceName + "/LIGHT-TOGGLE"
    },
    topicStatus() {
      return "HADIS/" + this.groupName + "/" + this.deviceName + "/STATUS"
    },

    // toggle button color
    color() {
      if (this.sliderValue > 0) return 'primary'
      return 'gray'
    },
    // calculate device status color & get vuetify theme colors
    statusColor() {
      if (this.status === "ONLINE") return this.$vuetify.theme.themes.dark.success
      if (this.status === "OFFLINE") return this.$vuetify.theme.themes.dark.error
      return 'gray'
    },

  },
  methods: {
    // on - press handle brightness decrease by 1 tick
    decrement() {
      this.sliderValue -= 32;
      this.publish();
    },
    // on + press handle brightness increase by 1 tick
    increment() {
      this.sliderValue += 32;
      this.publish();
    },
    // handle brightness toggle on button press
    toggle() {
      this.isOn = !this.isOn
      if (this.sliderValue > 0) {
        this.brightnessToggleMemory = this.sliderValue;
        this.sliderValue = 0;
      }
      else {
        this.sliderValue = this.brightnessToggleMemory;
      }
      this.publish();
    },
    // publish brightness to mqtt
    publish() {
      mqttClient.publish(this.topicLight, this.sliderValue.toString(), {qos: 0, retain: true})
    },
  },
  props: {
    deviceName: String,
    groupName: String,
  },
  watch: {
    // trigger on sliderValue change
    sliderValue: function (value, prevValue) {
      // calculate percentage of brightness and determine if light is on
      this.percent = Math.round(this.sliderValue / 1024 * 100);
      this.isOn = this.sliderValue > 0;

      // on sliderValue moving to 0 store toggle memory
      if (prevValue > 0 && value === 0) {
        this.brightnessToggleMemory = prevValue;
      }
    },
  },
  created() {

    unsubscribe = this.$store.subscribe((mutation) => {

      let messageState = mutation.payload;
      //console.log(messageState.msg + " on: " + messageState.topic)

      // handle message for device status
      if (messageState.topic === this.topicStatus) {
        this.status = messageState.msg.toString();
      }

      // handle message for device brightness
      if (messageState.topic === this.topicLight) {
        this.sliderValue = parseInt(messageState.msg.toString());
      }

      // handle message for device brightness toggle value
      if (messageState.topic === this.topicLightToggle) {
        this.brightnessToggleMemory = parseInt(messageState.msg.toString());
      }

    });
  },
  // on component mount subscribe to required mqtt topics
  mounted() {
    mqttClient.subscribe(this.topicStatus);
    mqttClient.subscribe(this.topicLight);
    mqttClient.subscribe(this.topicLightToggle);
  },
  // on component destroy unsubscribe from mqtt topics & vuex mqtt message store
  destroyed() {
    unsubscribe();
    mqttClient.unsubscribe(this.topicLight);
    mqttClient.unsubscribe(this.topicLightToggle);
    mqttClient.unsubscribe(this.topicStatus);
  }
};
</script>

<style scoped></style>
