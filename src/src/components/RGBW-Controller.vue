<template>
  <v-col cols="10" lg="5" xl="5">
    <!-- dimmable light card -->
    <v-card :disabled="status === 'OFFLINE'" class="ma-auto rounded-lg">

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
        <DeviceSetupDialog v-model="dialog" :device-config="this.deviceConfig"/>

      </v-toolbar>

      <!-- card body -->
      <v-card-text>
        <v-row align="center" justify="space-between">

          <!-- toggle button -->
          <v-col cols="12" class="text-center">

            <div id="picker"/>

          </v-col>
        </v-row>

        <!-- toggle button -->
        <v-row>
          <v-col class="text-center">
            <v-btn :dark="buttonColor()" rounded x-large :color="currentColor" @click="toggle">
              <v-icon class="pr-3" large>
                {{ isOn ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off-outline' }}
              </v-icon>
              {{ isOn ? 'ON' : 'OFF' }}
            </v-btn>
          </v-col>
        </v-row>

        <!-- color presets -->
        <v-row align="center" justify="space-between">
          <v-col cols="3 text-center" v-for="preset in deviceConfig.presets" :key="preset.color">
            <v-btn dark fab :color="preset.color" @click="presetColorChange(preset.color)"></v-btn>
          </v-col>
        </v-row>

      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import {mqttClient} from "@/main";
import iro from '@jaames/iro';

export default {
  name: "RGBW-Controller",
  components: {},
  data: () => ({
    isOn: false,
    status: 'OFFLINE',
    dialog: false,
    unsubscribe: null,
    colorPicker: null,
    buttonColorMemory: {r: 255, g: 255, b: 255},
    currentColor: "#000000",
    colorToggleMemory: "#FF0000",
  }),
  computed: {
    // generate mqtt topics
    topicRGBWcontrol() {
      return "HADIS/" + this.deviceConfig.deviceName + "/RGBW-CONTROL"
    },
    topicRGBWToggle() {
      return "HADIS/" + this.deviceConfig.deviceName + "/RGBW-TOGGLE"
    },
    topicRGBW() {
      return "HADIS/" + this.deviceConfig.deviceName + "/RGBW"
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

      if (this.currentColor !== "#000000") {
        this.colorToggleMemory = this.currentColor;
        this.currentColor = "#000000";
      } else {
        this.currentColor = this.colorToggleMemory;
      }

      this.colorPicker.color.set(this.currentColor);
      this.publishCommand();
    },
    // publishCommand switch state to mqtt
    publishCommand() {
      let mqttMessage = this.currentColor;
      mqttClient.publish(this.topicRGBWcontrol, mqttMessage, {qos: 0, retain: true})

      this.publishColor();
    },
    // build hex rgb / rgbw value depending on device mode
    publishColor() {

      let viewModel = this;
      let mqttMessage = "#";

      // rgbw test pattern
      let pattern1 = /^(?=[rgbw]{4}$)(?!.*(.).*\\1).*$/;

      // rgb test pattern
      let pattern2 = /^(?=[rgb]{3}$)(?!.*(.).*\\1).*$/;

      // build rgbw color string
      if (pattern1.test(this.deviceConfig.mode)) {
        let resColor = this.colorPicker.color.rgb;
        resColor.w = Math.min(resColor.r, resColor.b, resColor.g);

        // string generation
        for (const char of viewModel.deviceConfig.mode) {

          mqttMessage += resColor[char] > 15 ? "" : "0";
          mqttMessage += resColor[char].toString(16);
        }

      }
      // build rgbw color string
      else if (pattern2.test(this.deviceConfig.mode)) {

        // string generation
        for (const char of viewModel.deviceConfig.mode) {
          let colorValueFromPicker = viewModel.colorPicker.color.rgb[char];

          mqttMessage += colorValueFromPicker > 15 ? "" : "0";
          mqttMessage += viewModel.colorPicker.color.rgb[char].toString(16);
        }

        // add 0 as WHITE value at the end;
        mqttMessage += "00"
      }

      // publish rgbw value to controller
      console.log(mqttMessage);
      mqttClient.publish(this.topicRGBW, mqttMessage, {qos: 0, retain: true})
    },
    // determine button text color depending on background
    buttonColor() {
      return (this.buttonColorMemory.r * 0.299 + this.buttonColorMemory.g * 0.587 + this.buttonColorMemory.b * 0.114) < 210
    },
    // handle color preset click
    presetColorChange(color) {
      this.currentColor = color;
      this.colorPicker.color.set(this.currentColor);
      this.publishCommand();
    },
  },
  watch: {
    // trigger on color change
    currentColor: function (color, prevColor) {
      this.isOn = this.currentColor !== "#000000";

      // on color moving to off store toggle memory
      if (prevColor !== "#000000" && color === "#000000") {
        this.colorToggleMemory = prevColor;
        mqttClient.publish(this.topicRGBWToggle, this.colorToggleMemory, {qos: 0, retain: true})
      }
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
      if (messageState.topic === this.topicRGBWcontrol) {
        this.colorPicker.color.set(messageState.msg);
        this.currentColor = messageState.msg;
        this.buttonColorMemory = this.colorPicker.color.rgb;
      }

      // handle message for device rgb brightness toggle value
      if (messageState.topic === this.topicRGBWToggle) {
        this.colorToggleMemory = messageState.msg;
      }

    });

  },
  // on component mount subscribe to required mqtt topics & initialise color picker
  mounted() {
    mqttClient.subscribe(this.topicStatus);
    mqttClient.subscribe(this.topicRGBWcontrol);
    mqttClient.subscribe(this.topicRGBWToggle);

    let viewModel = this;

    // initialisation of color picker
    this.colorPicker = new iro.ColorPicker('#picker', {
      width: 290,
      display: "inline-block",
    });

    // handle color picker input
    this.colorPicker.on('input:end', function (color) {
      viewModel.currentColor = color.hexString;
      viewModel.buttonColorMemory = color.rgb;
      viewModel.publishCommand();
    });

  },
  // on component destroy unsubscribe from mqtt topics & vuex mqtt message store
  destroyed() {
    this.unsubscribe();
    mqttClient.unsubscribe(this.topicRGBWcontrol);
    mqttClient.unsubscribe(this.topicRGBWToggle);
    mqttClient.unsubscribe(this.topicStatus);
  }
};
</script>

<style scoped>

</style>

