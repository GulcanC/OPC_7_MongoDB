<template>
  <article
    class="card container d-flex justify-content-center align-items-center border-0 text-light"
  >
    <ProfilPictureComp></ProfilPictureComp>
    <h2>MY ACCOUNT</h2>
    <span
      ><h3 class="text-capitalize profil-username">
        {{ $store.state.user.firstName }}
        {{ $store.state.user.lastName }}
      </h3></span
    >

    <p v-if="$store.state.user.description">
      {{ $store.state.user.description }}
    </p>

    <button
      role="button"
      aria-label="edit the profile"
      type="button"
      class="btn btn-outline-secondary d-flex flex-row align-items-center gap-4 border-0 mb-3"
      @click="showModal = true"
    >
      <fa icon="pen-to-square" class="fa-icon" alt="icon" />
      Edit your profile
    </button>
    <!-- This part will go to the part "modal body" in the file ModalProfilComp -->
    <!-- To achive this we will use <slot></slot> in the file ModalProfilComp -->
    <!-- The showModal() method shows the dialog. When this method is used to show a dialog window, the user is not able to interact with other elements on the page.-->
    <ModalProfilComp
      v-if="showModal"
      title="Customize your profile"
      @closeModal="showModal = false"
    >
      <form
        @submit.prevent="save"
        style="text-align: left"
        aria-label="user profil update form"
      >
        <!-- hello message by calling the name of the user-->
        <h5 class="text-capitalize text-light text-center">
          Hello! {{ $store.state.user.firstName }}
        </h5>

        <!-- change profil picture -->
        <div class="mb-4" aria-label="update profil picture">
          <label for="formFile" class="form-label text-capitalize text-light"
            >You can change your profil picture</label
          >
          <input
            id="formFile"
            class="form-control"
            type="file"
            aria-label="upload picture"
            @change="uploadProfilFile"
          />
        </div>

        <p class="text-capitalize text-light">
          {{ $store.state.user.firstName }}, describe yourself in one sentence
        </p>
        <div class="mb-3">
          <div
            class="form-floating"
            aria-label="Modification de la description utilisateur"
          >
            <textarea
              aria-label="champs description utilisateur"
              class="form-control text-left"
              placeholder="describe yourself"
              id="floatingTextarea"
              v-model="user.description"
            ></textarea>
            <label for="floatingTextarea">Description</label>
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <button
            role="button"
            aria-label="Supprimer mon compte"
            class="btn btn-danger"
            @click.prevent="deleteAccount"
          >
            <fa icon="trash-alt" class="me-2" alt="image d'une poubelle" />
            Supprimer mon compte
          </button>

          <button
            role="button"
            aria-label="Enregister les modifications"
            type="submit"
            class="btn btn-primary"
          >
            Submit
          </button>
        </div>
        <p class="err-msg">{{ errMsg }}</p>
      </form>
    </ModalProfilComp>

    <button
      role="button"
      aria-label="Déconnexion du compte"
      class="btn btn-outline-secondary d-flex flex-row align-items-center gap-4 border-0 mb-3"
      @click="handleClick"
    >
      <fa
        icon="right-from-bracket"
        class="fa-icon"
        alt="image d'une flèche de sortie"
      />
      Log out
    </button>
  </article>
</template>

<script>
import axios from "axios";
import ModalProfilComp from "./ModalProfilComp.vue";
import ProfilPictureComp from "./ProfilPictureComp.vue";
export default {
  components: { ModalProfilComp, ProfilPictureComp },
  name: "ProfileComp",
  data() {
    return {
      user: {
        picture: "",
        description: "",
      },
      showModal: false,
      errMsg: "",
    };
  },
  created() {
    this.user.description = this.$store.state.user.description;
  },
  methods: {
    uploadProfilFile(event) {
      this.user.picture = event.target.files[0];
    },

    handleClick() {
      localStorage.removeItem("token");
      this.$store.commit("setUser", null);
      this.$router.push("/");
    },

    deleteAccount() {
      const token = localStorage.getItem("token");
      const id = this.$store.state.user._id;
      if (confirm("Attention cette action supprimera votre compte")) {
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
          this.$store.commit("updateUser", response.data);
          this.showModal = false;
        })
        .catch((error) => {
          console.log(error);
          this.errMsg = error.response.data.message
            ? error.response.data.message
            : error;
        });
    },
  },
};
</script>

<style scoped>
article.card {
  background-color: #fd2d01;
  margin-top: 6rem;
  opacity: 0.7;
}
article.card:hover {
  opacity: 1;
}
article button {
  background-color: white;
  color: #4e5166;
}
article button:hover {
  background-color: white;
  color: #4e5166;
}

h2 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #4e5166;
}
.profil-username {
  font-weight: 700;
  font-size: medium;
  margin-top: 8px;
}
</style>
