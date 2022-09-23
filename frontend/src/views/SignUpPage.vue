<template>
  <!---- S'inscrire ---->
  <div class="login">
    <form
      @submit.prevent="signup"
      method="post"
      aria-label="Signup Form"
      class="form-login"
    >
      <div class="form-group">
        <label for="firstname">First Name</label>
        <input
          type="text"
          id="firstname"
          class="form-control"
          placeholder="First Name"
          v-model="user.firstName"
        />
      </div>
      <br />

      <div class="form-group">
        <label for="lastname">Last Name</label>
        <input
          type="text"
          id="lastname"
          class="form-control"
          placeholder="Last Name"
          v-model="user.lastName"
        />
      </div>
      <br />
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="xxxx@xxxx.com"
          v-model="user.email"
          class="form-control"
        />
      </div>
      <br />
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Xx1-"
          v-model="user.password"
          class="form-control"
        />
      </div>
      <br />
      <div class="form-group">
        <label for="password">Confirm your Password</label>
        <input
          type="password"
          id="confirm-password"
          placeholder="Confirm your Password"
          v-model="user.passwordConfirm"
          class="form-control"
        />
      </div>
      <p class="form-error-message">{{ errMsg }}</p>

      <button role="button" class="btn-login" type="submit">Sign up</button>
    </form>
  </div>
  <div class="go-to-login">
    <p>Already have an account?</p>
    <router-link to="/login" class="go-to-login-button">
      <p>Sign in &rarr;</p>
    </router-link>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Signup",
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: "",
      },
      errMsg: null,
    };
  },
  components: {},
  methods: {
    async signup() {
      /* vérifie si tous les champs sont bien remplis */
      if (
        !this.user.firstName ||
        !this.user.lastName ||
        !this.user.email ||
        !this.user.password ||
        !this.user.passwordConfirm
      ) {
        this.errMsg =
          "⛔️ Please fill in all the fields of the form and check your password.";
        return;
      }
      const response = await axios
        .post("auth/signup", this.user)
        .then((response) => {
          this.$router.push("/login");
        })
        .catch((error) => {
          console.log(error);
          this.errMsg =
            "⛔️ We don't have access to the server at the moment, please try again later.";
        });
    },
  },
};
</script>

<style>
.login {
  border-radius: 0.3rem;
  font-size: 1rem;
  text-align: left;
  padding: 1.2rem;
  width: 25rem;
  margin: auto;
}
.form-group,
.form-login,
.form-group label,
.btn-login,
.form-error-message {
  background-color: #4e5166;
}

.form-login {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form-group label {
  margin: 0.5rem 0 0 0;
  font-weight: bold;
}

.form-group label {
  color: white;
}
.btn-login {
  border: none;
  padding: 0.5rem;
  margin: 1rem;
  display: inline-block;
  transition: 0.1s ease-in-out;
  transition: all 0.2s;
  border-radius: 1.2rem;
  width: 6rem;
}
.btn-login:hover {
  background: #4e5166;
  padding: 0.4rem;
  border-bottom: none;
  transform: translateY(0.1rem);
}

.go-to-login-button,
.btn-login {
  color: #fd2d01;
  font-weight: bold;
}

.go-to-login-button:hover,
.btn-login {
  background-color: white;
  text-decoration: none;
}
.form-error-message {
  color: black;
  margin: 1rem 0 0 0;
}
</style>
