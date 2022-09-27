<template>
  <div class="container-flex">
    <router-view />
  </div>
</template>

<script>
import HeaderComp from "@/components/HeaderComp.vue";
import FooterComp from "@/components/FooterComp.vue";
import axios from "axios";

export default {
  components: {
    FooterComp,
    HeaderComp,
  },
  created() {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    if (token) {
      axios
        .post("http://localhost:3000/api/auth//identify", {}, config)
        .then((res) => {
          console.log(res.data);
          this.$store.commit("setUser", res.data);
          this.$router.push("/post");
        });
    } else if (!token) {
      this.$router.push("/");
    }
  },
};
</script>

<style>
* {
  font-family: "CURSIVE";
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
