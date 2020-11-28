<template>
  <div id="controllerPanel">
    <!-- heading container -->
    <v-container>
      <v-row align="center">
        <div class="text-h3 font-weight-light pa-auto mx-auto">{{ getRightGroup().groupNameDISPLAY }}</div>
      </v-row>
    </v-container>

    <!-- control cards container -->
    <v-container v-if="this.$router.currentRoute.path !== '/'">
      <v-row align="start" justify="center">

        <!-- 2 column rendering on large displays-->

        <!-- first, default column -->
        <v-col cols="10" lg="5">
          <v-row justify="end">
            <!-- dynamic control component rendering -->
            <template v-for="(component, index) in getRightGroup().components">
              <component :is="component.componentType" :deviceConfig=component :key="component.deviceName" v-if="index % 2 === 0 || $vuetify.breakpoint.mdAndDown"></component>
            </template>
          </v-row>
        </v-col>

        <!-- secondary column -->
        <v-col cols="10" lg="5" v-if="$vuetify.breakpoint.lgAndUp">
          <v-row justify="start">
            <!-- dynamic control component rendering -->
            <template v-for="(component, index) in getRightGroup().components">
              <component :is="component.componentType" :deviceConfig=component :key="component.deviceName" v-if="index % 2 !== 0"></component>
            </template>
          </v-row>
        </v-col>



      </v-row>
    </v-container>
  </div>
</template>

<script>
import content from '../configJSON.json'

export default {
  name: "ControllerPanelPage",
  data: () => ({
    contentJSON: content
  }),
  methods: {
    // return content of group selected by router
    getRightGroup() {
      let groups = this.contentJSON.groups;

      for (const i in groups) {

        if (groups[i].groupRoute === this.$route.path)
          return groups[i];

      }
      return null
    },
  },
}
</script>
