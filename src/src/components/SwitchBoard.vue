<template>

  <v-col cols="12" >

    <!-- switch board card -->
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
                <SwitchBoardSwitchC2 :deviceConfig=component :key="component.deviceName" v-if="component.channel === 2"></SwitchBoardSwitchC2>
                <SwitchBoardSwitchC1 :deviceConfig=component :key="component.deviceName" v-else></SwitchBoardSwitchC1>
            </template>
          </v-col>

        </v-row>

      </v-card-text>

    </v-card>
  </v-col>

</template>

<script>
import SwitchBoardSwitchC1 from "@/components/SwitchBoard-Switch-C1";
import SwitchBoardSwitchC2 from "@/components/SwitchBoard-Switch-C2";

export default {
  name: "SwitchBoard",
  components: {SwitchBoardSwitchC1, SwitchBoardSwitchC2},
  props: {
    deviceConfig: Object,
  },
};
</script>

