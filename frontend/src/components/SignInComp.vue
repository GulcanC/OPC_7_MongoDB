<template>
  <div>
    <HeaderComp />
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
            autocomplete="off"
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
            autocomplete="off"
            v-model="user.password"
          />
        </div>
        <button role="button" class="btn-login" type="submit">Sign in</button>
        <p class="text-center text-light">{{ errorMessage }}</p>
      </form>
    </div>

    <div class="go-to-login">
      <p class="text-center">If you have not registered yet, click!</p>
      <router-link to="/signup" class="go-to-login-button">
        <p class="text-center">Sign up &rarr;</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import HeaderComp from "@/components/HeaderComp.vue";
export default {
  name: "SignInPage",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },

      errorMessage: "",
    };
  },
  components: { HeaderComp },
  methods: {
    async login() {
      if (!this.user.email || !this.user.password) {
        this.errorMessage = "⛔️ Fill in all the fields!";
      }
      // other error messages will come from backend. if user not found in tha data base and if the password is not correct
      else {
        // http://localhost:3000/api/auth/login
        await axios
          .post("auth/login", this.user)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              localStorage.setItem("token", response.data.token);
              this.$router.push("/post");
              this.$store.commit("SET_USER", response.data);
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
      }
    },
  },
};
</script>
