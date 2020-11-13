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
      <v-row align="center" justify="center">

        <!-- dynamic control component rendering -->
        <template v-for="component in getRightGroup().components">
          <component :is="component.componentType" :deviceConfig=component :key="component.deviceName"></component>
        </template>

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
