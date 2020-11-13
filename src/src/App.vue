<template>
  <v-app>
    <!-- toolbar -->
    <v-app-bar color="primary" dark app clipped-left>
      <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>H△DIS</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- drawer -->
    <v-navigation-drawer v-model="drawer" app clipped :permanent="$vuetify.breakpoint.mdAndUp">

      <!-- drawer components -->
      <v-list nav>
        <v-list-item-group color="primary">

          <!-- dynamic drawer navigation rendering -->
          <v-list-item @click="$router.push(group.groupRoute).catch(err => {})"
                       v-for="group in contentJSON.groups" :key="group.groupNameDisplay">
            <v-list-item-title>{{ group.groupNameDISPLAY }}</v-list-item-title>
          </v-list-item>

        </v-list-item-group>

      </v-list>

    </v-navigation-drawer>

    <!-- app view for ui -->
    <v-main >

      <router-view/>

    </v-main>

    <!-- app view displayed only as landing page -->
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
};
</script>
