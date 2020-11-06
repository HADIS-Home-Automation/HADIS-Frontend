<template>
  <v-dialog v-model="show" max-width="500">
    <v-card>
      <v-card-title class="headline">Start device's setup mode?</v-card-title>
      <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" text @click.stop="show=false">Cancel</v-btn>
        <v-btn color="primary darken-1" text @click.stop="set(true)" @click.native="show=false">Proceed</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Dialog_DeviceSetup",
  props: {
    value: Boolean
  },
  computed: {
    show: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value);
      }
    }
  }
}
</script>

<style scoped>

</style>