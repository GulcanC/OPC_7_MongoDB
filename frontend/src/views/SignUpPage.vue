<template>
  <div>
    <HeaderComp />
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

        <button role="button" class="btn-login" type="submit">Sign up</button>
        <div class="errors-messages" v-if="errors.length">
          <b> ⛔️ Please correct the errors to sign up!</b>
          <ul>
            <li v-for="error in errors" :key="error.message">{{ error }}</li>
          </ul>
        </div>
      </form>
    </div>
    <div class="go-to-login">
      <p>Already have an account?</p>
      <router-link to="/login" class="go-to-login-button">
        <p>Sign in &rarr;</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import HeaderComp from "@/components/HeaderComp.vue";
export default {
  name: "SignUpPage",
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: "",
      },
      errors: [],
    };
  },
  components: { HeaderComp },
  methods: {
    async signup() {
      /* if (
        !this.user.firstName ||
        !this.user.lastName ||
        !this.user.email ||
        !this.user.password ||
        !this.user.passwordConfirm
      ) {
        this.errorMessage =
          "⛔️ Please fill in all the fields of the form and check your password.";
        return;
      } */

      var regExPassword = new RegExp(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{4}$/
      );
      var regExEmail = new RegExp(
        /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/
      );
      var regExText = new RegExp(/^[a-zA-Zà-ùÀ-Ù- -']+$/);
      // create an array for the errors
      this.errors = [];

      if (!this.user.firstName || !regExText.test(this.user.firstName)) {
        this.errors.push(
          "❗️ Please provide a valide name between 2-10 characters! "
        );
      } else if (regExText.test(this.user.firstName)) {
        this.errors.push("✅ First name is valid!");
      }

      if (!this.user.lastName || !regExText.test(this.user.lastName)) {
        this.errors.push(
          "❗️ Please provide a valide last name between 2-10 characters!"
        );
      } else if (regExText.test(this.user.lastName)) {
        this.errors.push("✅ Last name is valid!");
      }

      if (!this.user.email || !regExEmail.test(this.user.email)) {
        this.errors.push("❗️ Please provide a valide e-mail address!");
      } else if (regExEmail.test(this.user.email)) {
        this.errors.push("✅ Email address is valid!");
      }
      if (!this.user.password || !regExPassword.test(this.user.password)) {
        this.errors.push(
          "❗️ Password have to contain 4 characters; 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character!"
        );
      } else if (regExPassword.test(this.password)) {
        this.errors.push("✅ Password is valid!");
      }
      if (this.user.password !== this.user.passwordConfirm) {
        this.errors.push("❗️ Password does not match!");
      } else if (
        this.user.password === this.user.passwordConfirm &&
        regExPassword.test(this.password)
      ) {
        this.errors.push("✅ Password is correct!");
      }
      if (!this.errors.length) {
        this.signup();
      }

      // http://localhost:3000/api/auth/signup
      await axios
        .post("auth/signup", this.user)
        .then((response) => {
          console.log(response);
          this.$router.push("/login");
        })
        .catch((error) => {
          console.log(error);
          this.errorMessage =
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
.btn-login {
  background-color: #4e5166;
}
.form-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0.3rem;
  box-shadow: 0.3rem 0.3rem 0.3rem black;
}
.form-group label {
  margin: 0.5rem 0 0 0.4rem;
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
  color: white;
  margin: 1rem 0.5rem 1rem 0.5rem;
  background-color: transparent;
}
</style>
