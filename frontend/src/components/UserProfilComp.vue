<template>
  <article class="card container shadow-sm">
    <ProfilComp />
    <h2>My account</h2>
    <span>
      <h3 class="profil-username">
        {{ $store.state.user.firstname }}
        {{ $store.state.user.lastname }}
      </h3>
    </span>
    <p v-if="$store.state.user.description">
      {{ $store.state.user.description }}
    </p>

    <button
      class="btn btn-primary my-2 px-5"
      role="button"
      type="button"
      aria-label="Edit my profile"
      @click="showModal = true"
    >
      Edit my Profile <fa icon="pen-to-square" class="ms-4" alt="icon"></fa>
    </button>

    <transition name="modalFade">
      <modal-profil-comp
        v-if="showModal"
        title="Customize your profile"
        @closeModal="showModal = false"
      >
        <h2>Add a description and profile picture</h2>
        <form
          @submit.prevent="save"
          style="text-align: left"
          aria-label="modification of user information"
        >
          <div class="mb-3">
            <div
              class="form-floating"
              aria-label="modification of user information"
            >
              <textarea
                class="form-control text-left"
                id="floatingTextarea"
                description="description"
                cols="30"
                rows="10"
                aria-label="user description fields"
                v-model="user.description"
              ></textarea>
              <label for="floatingTextarea"></label>
            </div>
          </div>
          <div class="mb-5" aria-label="Change profil picture">
            <label for="formFile" class="form-label"
              >Change your profile picture
            </label>
            <input
              type="file"
              class="form-control"
              id="formFile"
              aria-label="Upload an image"
              @change="uploadProfilFile"
            />
          </div>

          <div class="d-flex justify-content-between">
            <button
              class="btn btn-danger"
              role="button"
              aria-label="Delete my account"
              @click.prevent="deleteAccount"
            >
              <fa icon="trash-alt" class="me-2" alt="delete account"></fa>Delete
              account
            </button>

            <button
              role="button"
              type="submit"
              class="btn btn-primary"
              aria-label="save the modifications"
            >
              Submit
            </button>
          </div>
          <p class="err-msg">{{ errorMessage }}</p>
        </form></modal-profil-comp
      >
    </transition>
    <button
      role="button"
      class="btn btn-outline-secondary my-2"
      aria-label="Logout"
      @click="handleClick"
    >
      Logout <fa icon="right-from-bracket" class="ms-4" alt="icon"></fa>
    </button>
  </article>
</template>

<script>
import axios from "axios";
import ModalProfilComp from "./ModalProfilComp.vue";
import ProfilPictureComp from "./ProfilPictureComp.vue";

export default {
  components: { ModalProfilComp, ProfilPictureComp },
  name: "UserProfilComp",
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
      if (confirm("Do you really want to delete your account?")) {
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
.card {
  border: none;
  margin-bottom: 20px;
}
h2 {
  font-size: 1.2em;
  font-weight: 600;
}
.profil-username {
  font-weight: 700;
  font-size: medium;
  margin-top: 8px;
}

.modalFade-enter-from {
  opacity: 0;
}
.modalFade-enter-to {
  opacity: 1;
}
.modalFade-enter-active,
.modalFade-leave-active {
  transition: all 300ms ease;
}
.modalFade-leave-from {
  opacity: 1;
}

.modalFade-leave-to {
  opacity: 0;
}

.picture-user-container {
  width: 78px;
}
.picture-user-profile {
  border-radius: 50%;
  padding: 0;
  height: 78px;
  object-fit: cover;
}
.err-msg {
  color: var(--primary-color);
  font-weight: 400;
  margin-top: 20px;
}
</style>
