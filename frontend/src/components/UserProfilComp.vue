<template>
  <article
    class="card container d-flex justify-content-center align-items-center border-0 text-light"
  >
    <!-- add profil picture comp -->
    <ProfilPictureComp></ProfilPictureComp>
    <!-- fs-1 font size xlarge, fw font weight -->
    <h2 class="fs-5 fw-bold mt-2">MY ACCOUNT</h2>
    <span
      ><h3 class="text-capitalize fs-5">
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

        <!-- change profil picture, here the file input field is default bootstrap, so it can not be changed -->
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

        <!-- User description field-->
        <!-- class="form-floating", When there’s a value already defined, <label>s will automatically adjust to their floated position.-->
        <div class="mb-3">
          <div class="form-floating" aria-label="describe user">
            <!-- Here it does not accept label, I do not know why, so I used <p> tag-->
            <label for="comment"></label>
            <p class="text-capitalize text-light">
              {{ $store.state.user.firstName }}, describe yourself in one
              sentence
            </p>
            <textarea
              class="form-control text-left"
              id="comment"
              row="2"
              v-model="user.description"
            ></textarea>
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <button
            role="button"
            title="Delete account"
            @click.prevent="deleteAccount"
            class="btn btn-outline-secondary d-flex flex-row align-items-center gap-4 border-0 mb-3"
          >
            <fa icon="fa fa-trash-alt" alt="icon" />
            Delete my account
          </button>

          <button
            role="button"
            title="Save changes"
            type="submit"
            class="btn btn-outline-secondary d-flex flex-row align-items-center gap-4 border-0 mb-3"
          >
            <fa icon="fa fa-paper-plane" alt="icon" />
            Save changes
          </button>
        </div>
        <p class="err-msg">{{ errorMessage }}</p>
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
      errorMessage: "",
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
      if (alert("⚠️ Are you sure you want to delete your account? ⚠️")) {
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
          this.errorMessage = error.response.data.message
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
  transition: all 0.3s;
}
article button:hover {
  background-color: #4e5166 !important;
  color: white !important;
  border: 0.1rem solid white !important;
}

h2 {
  color: #4e5166;
}
</style>
