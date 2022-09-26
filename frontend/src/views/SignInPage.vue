<template>
  <!---- Se connecter ---->
  <div class="login">
    <form
      @submit.prevent="login"
      method="post"
      aria-label="Sign in form"
      class="form-login"
    >
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="xxxx@xxxx.com"
          class="form-control"
          v-model="user.email"
        />
      </div>
      <br />
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          class="form-control"
          v-model="user.password"
        />
      </div>
      <button role="button" class="btn-login" type="submit">Sign in</button>
      <p class="form-error-message">{{ errorMessage }}</p>
    </form>
  </div>

  <div class="go-to-login">
    <p>If you have not registered yet, click!</p>
    <router-link to="/signup" class="go-to-login-button">
      <p>Sign up &rarr;</p>
    </router-link>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      errorMessage: "",
    };
  },
  components: {},
  methods: {
    async login() {
      await axios
        .post("auth/login", this.user)
        .then((response) => {
          if (response.status == 200) {
            localStorage.setItem("token", response.data.token);
            this.$router.push("/post");
            this.$store.commit("setUser", response.data);
          }
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.errorMessage = error.response.data.message
              ? error.response.data.message
              : error;
          } else {
            this.errorMessage =
              "⛔️ We don't have access to the server at the moment, please try again later.";
          }
        });
    },
  },
};
</script>
