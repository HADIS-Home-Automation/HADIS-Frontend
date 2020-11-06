<template>
  <div class="about">
    <h1>This is an about page</h1>

    <dimmable-light deviceName="DeskLight" group-name="MatejSoba"/>
  </div>
</template>


<script>
import DimmableLight from "@/components/DimmableLight";
export default {
  components: {DimmableLight}
}
</script>