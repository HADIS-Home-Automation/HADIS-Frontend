<template>

  <!-- dialog -->
  <v-dialog v-model="show" max-width="500">

    <!-- dialog card -->
    <v-card>
      <v-card-title class="headline">Start device's setup mode?</v-card-title>
      <v-card-text>By clicking <b>proceed</b> start the <b>{{this.deviceName}}</b> setup mode. This will disconnect the device from
        the broker and let you configure its settings.</v-card-text>

      <!-- dialog card buttons -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" text @click.stop="show=false">Cancel</v-btn>
        <v-btn color="primary darken-1" text @click.stop="clickConfirm">Proceed</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

</template>

<script>
import {mqttClient} from "@/main";

export default {
  name: "Dialog_DeviceSetup",
  props: {
    groupNameMQTT: String,
    deviceName: String,
    value: Boolean
  },
  computed: {
    // for displaying and closing the dialog
    show: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    // generate mqtt topic
    topicSetup() {
      return "HADIS/" + this.groupNameMQTT + "/" + this.deviceName + "/SETUP"
    }
  },
  methods:{
    // proceed click function
    clickConfirm(){
      // publish setup mode request to MQTT
      mqttClient.publish(this.topicSetup, "1", {qos: 0, retain: false});

      this.show = false;
    }
  }
}
</script>
