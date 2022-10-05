<!-- User profil edit -->
<template>
  <article
    class="card container text-light d-flex flex-direction-column align-items-center justify-content-center"
  >
    <ProfilPictureComp></ProfilPictureComp>
    <h2 class="text-uppercase text-dark fs-5 font-weight-bold">My account</h2>
    <span
      ><h3 class="profil-username text-capitalize font-italic">
        {{ $store.getters["fullName"] }}
      </h3></span
    >

    <p v-if="$store.state.user.description">
      {{ $store.state.user.description }}
    </p>

    <!-- user update profil picture -->
    <div class="mb-3" aria-label="update profil picture">
      <label for="formFile" class="form-label text-left text-dark"
        >Change your profile picture</label
      >
      <input
        class="form-control"
        type="file"
        aria-label="Chargez une image"
        @change="uploadProfilFile"
        id="formFile"
      />
    </div>

    <!-- textarea to write a description -->

    <p class="text-dark text-left">Describe yourself in one sentence</p>
    <form
      @submit.prevent="save"
      style="text-align: left"
      aria-label="update user profile"
    >
      <div class="mb-3">
        <div class="form-floating" aria-label="update user profile">
          <textarea
            aria-label="update user profile"
            class="form-control text-left"
            placeholder="description"
            id="floatingTextarea"
            v-model="user.description"
          ></textarea>
          <label for="floatingTextarea">Description</label>
        </div>
      </div>

      <!-- button to delete account and submit the changes -->

      <div class="d-flex flex-column gap-3">
        <button
          role="button"
          title="Save changes"
          type="submit"
          class="btn button-type-1"
        >
          <fa icon="fa fa-paper-plane" class="me-2" alt="icon" />
          Submit changes
        </button>

        <button
          role="button"
          title="Delete user account"
          class="btn button-type-1"
          @click.prevent="deleteAccount"
        >
          <fa icon="fa fa-trash-alt" class="me-2" alt="icon" />
          Delete account
        </button>
      </div>
      <p class="err-msg">{{ errorMessage }}</p>
    </form>
    <!-- button logout -->
    <button
      role="button"
      title="logout"
      class="btn button-type-2 mb-3"
      @click="handleClick"
    >
      Log out
      <fa
        icon="fa fa-right-from-bracket"
        class="ms-4"
        alt="image d'une flèche de sortie"
      />
    </button>
  </article>
</template>

<script>
import axios from "axios";
import ProfilPictureComp from "./ProfilPictureComp.vue";
export default {
  components: { ProfilPictureComp },
  name: "UserProfileComp",
  data() {
    return {
      user: {
        picture: "",
        description: "",
      },
      errorMessage: "",
    };
  },
  created() {
    this.user.description = this.$store.state.user.description;
  },
  methods: {
    /*choisir  une image de profil */
    uploadProfilFile(event) {
      this.user.picture = event.target.files[0];
    },
    /* Se déconnecter */
    handleClick() {
      localStorage.removeItem("token");
      this.$store.commit("SET_USER", null);
      this.$router.push("/");
    },
    /* Supprimer son compte */
    deleteAccount() {
      const token = localStorage.getItem("token");
      const id = this.$store.state.user._id;
      if (confirm("⚠️ Are you sure you want to delete this account? ⚠️")) {
        axios
          .delete("auth/" + id, {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then(localStorage.clear());
        this.$router.push({ path: "/" }).catch((error) => {
          error;
        });
      }
    },
    save() {
      let formData = new FormData();
      formData.append("file", this.user.picture);
      formData.append("description", this.user.description);
      const token = localStorage.getItem("token");
      const id = this.$store.state.user._id;
      axios
        .put("auth/" + id, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          this.$store.commit("UPDATE_USER", response.data);
        })
        .catch((error) => {
          console.log(error);
          this.errorMessage = error.response.data.message
            ? error.response.data.message
            : error;
        });
    },
  },
};
</script>

<style scoped>
.card {
  background-color: #fd2d01;
  opacity: 0.9;
  transition: all 0.3s;
}
.card:hover {
  opacity: 1;
}
.button-type-1 {
  background-color: #ffd7d7;
  color: #4e5166;
  border: 1px solid #4e5166;
}
.button-type-1:hover {
  border: 1px solid white !important;
}
.button-type-2 {
  background-color: #4e5166;
  color: #ffd7d7;
  border: 1px solid #ffd7d7;
}
.button-type-2:hover {
  border: 1px solid white !important;
}
.profil-username {
  font-weight: 700;
  font-size: medium;
  margin-top: 0.7rem;
}
</style>
