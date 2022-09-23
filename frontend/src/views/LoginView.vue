<template>
  <!---- Se connecter ---->
  <div class="login">
    <form
      @submit.prevent="login"
      method="post"
      aria-label="Formulaire de connexion"
      class="form-login"
    >
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          aria-label="email"
          placeholder="xxxx@xxxx.com"
          v-model="user.email"
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          aria-label="Mot de passe"
          placeholder="Password"
          v-model="user.password"
          class="form-control"
        />
      </div>
      <button role="button" class="btn-login" type="submit">Login</button>
    </form>
  </div>
  <p class="form-error-message">{{ errMsg }}</p>
  <div class="go-to-login">
    <p>Already have an account?</p>
    <router-link to="/signup" class="go-to-login-button">
      <p>Login &rarr;</p>
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
      errMsg: "",
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
            this.$router.push("/actu");
            this.$store.commit("setUser", response.data);
          }
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.errMsg = error.response.data.message
              ? error.response.data.message
              : error;
          } else {
            this.errMsg =
              "Nous n'avons pas accès au serveur pour le moment, merci de réssayer plus tard.";
          }
        });
    },
  },
};
</script>
