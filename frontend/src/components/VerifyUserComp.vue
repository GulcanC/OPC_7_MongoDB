<template></template>

<script>
import axios from "axios";

export default {
  name: "VerifyUserComp",
  created() {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .post(
          "auth/verify",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
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
