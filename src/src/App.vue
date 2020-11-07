<template>
  <v-app>
    <!-- toolbar -->
    <v-app-bar color="primary" dark app clipped-left>
      <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>HADIS</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- drawer -->
    <v-navigation-drawer v-model="drawer" app clipped :permanent="$vuetify.breakpoint.mdAndUp">

      <!-- drawer components -->
      <v-list nav>
        <v-list-item-group color="primary">

          <!-- dynamic drawer navigation rendering -->
          <v-list-item @click="$router.push(group.groupRoute).catch(err => {})"
                       v-for="group in contentJSON.groups" :key="group.groupNameMQTT">
            <v-list-item-title>{{ group.groupNameDISPLAY }}</v-list-item-title>
          </v-list-item>

        </v-list-item-group>

      </v-list>

    </v-navigation-drawer>

    <!-- app view -->
    <v-main>

      <!-- heading container -->
      <v-container>
        <v-row align="center">
          <div class="text-h3 pa-auto mx-auto">{{ getRightGroup().groupNameDISPLAY }}</div>
        </v-row>
      </v-container>

      <!-- control cards container -->
      <v-container>
        <v-row align="center" justify="center">

          <!-- dynamic control component rendering -->
          <template v-for="component in getRightGroup().components">
            <component :is="component.componentType" :deviceName=component.deviceName
                       :groupNameMQTT=getRightGroup().groupNameMQTT :key="component.deviceName"></component>
          </template>

        </v-row>
      </v-container>

    </v-main>

  </v-app>
</template>

<script>

import content from './configJSON.json'

export default {
  name: "App",
  data: () => ({
    drawer: null,
    contentJSON: content,
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
};
</script>
