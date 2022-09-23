<template>
  <div class="home">
    <h1>Welcome to your new business social network!</h1>
  </div>
</template>

<script>
export default {
  name: "HomeMsgComp",
  // addd your message as a props to be shown in the HomeView page
  props: {
    message: String,
  },
};
</script>
<style scoped>
.home h1 {
  display: inline-block;
  background-image: linear-gradient(to right, #fd2d01, #4e5166);
  font-weight: bold;
  background-clip: text;
  -ms-background-clip: text;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  color: transparent;
  letter-spacing: 0.2rem;
  transition: all 0.2s;
}
.home h1:hover {
  transform: skewY(2deg);
}
</style>
