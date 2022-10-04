<template>
  <div class="container-flex">
    <router-view />
    <VerifyUserComp />
  </div>
</template>

<script>
import VerifyUserComp from "@/components/VerifyUserComp.vue";

export default {
  name: "App",
  components: {
    VerifyUserComp,
  },
};
</script>

<style>
* {
  font-family: "CURSIVE";
}
#app {
  text-align: center;
  font-size: normal;
  background-color: #ffd7d7;
}
html {
  background-color: #ffd7d7;
}
:root {
  --primary-color: "#fd2d01";
  --secondary-color: #ffd7d7;
  --tertiary-color: "#4E5166";
}
</style>
