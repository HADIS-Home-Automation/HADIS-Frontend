<template>

  <!-- container -->
  <v-container>

    <!-- logo -->
    <v-row align="center" justify="center">
      <v-col cols="4">
        <v-img max-height="300" src="../assets/logo.png" contain/>
      </v-col>
    </v-row>

    <!-- title -->
    <v-row>
      <div class="text-h3 font-weight-light pa-auto mx-auto text-center">Welcome to H△DIS:</div>
    </v-row>

    <!-- subtitle -->
    <v-row>
      <div class="text-h5 font-weight-light pa-auto mx-auto text-center">
        Home Automation, Development and Integration System
        <v-divider/>
      </div>
    </v-row>


    <!-- signature -->
    <v-row>
      <div class="text-overline font-weight-light pa-auto mx-auto text-center">Developed by Matej Horvat</div>
    </v-row>

  </v-container>
</template>

<script>
export default {
  name: "LandingPage"
}
</script>
