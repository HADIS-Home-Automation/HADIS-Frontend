<template>

  <v-col cols="10" lg="5" xl="5">
    <!-- dimmable light card -->
    <v-card class="ma-auto rounded-lg" >

      <!-- card toolbar -->
      <v-toolbar flat>
        <v-toolbar-title><b>{{ this.deviceConfig.deviceNameDISPLAY }}</b></v-toolbar-title>

      </v-toolbar>

      <!-- card body -->
      <v-card-text>
        <v-row align="center" >

          <!-- dynamic switch row rendering -->
          <v-col class="" cols="11" offset="1">
            <template v-for="component in deviceConfig.switches">
              <SwitchBoardSwitch :deviceConfig=component :key="component.deviceName"></SwitchBoardSwitch>
            </template>
          </v-col>

        </v-row>

      </v-card-text>

    </v-card>
  </v-col>

</template>

<script>
import SwitchBoardSwitch from "@/components/SwitchBoard-Switch";

export default {
  name: "SwitchBoard",
  components: {SwitchBoardSwitch},
  props: {
    deviceConfig: Object,
  },
};
</script>

