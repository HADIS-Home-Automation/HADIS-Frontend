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
      <v-list nav >
        <v-list-item-group >
          <v-list-item @click="$router.push('/')">
            <v-list-item-title >Home</v-list-item-title>
          </v-list-item>

          <v-list-item @click="$router.push('/about')">
            <v-list-item-title >About</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>

    </v-navigation-drawer>

    <!-- app view from router -->
    <v-content>
      <router-view/>
    </v-content>

  </v-app>
</template>

<script>


export default {
  name: "App",
  data: () => ({
    drawer: null,
  }),

};
</script>
