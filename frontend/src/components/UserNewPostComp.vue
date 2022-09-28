<!-- the first card at the top of post page to create a new post by users -->
<template>
  <article class="card p-2 mb-4">
    <form
      @submit.prevent="createPost"
      class="form-post p-2"
      aria-label="form to create new post "
    >
      <div class="d-flex flex-column justify-content-center align-items-center">
        <!-- add profil picture component to the card -->
        <div>
          <ProfilPictureComp></ProfilPictureComp>
        </div>
        <!-- new post card body -->
        <div class="w-75">
          <label for="floatingTextarea" class="m-2 text-light fs-5"
            ><span class="text-capitalize">{{
              $store.state.user.firstName
            }}</span
            >, write your message</label
          >
          <!-- add image for the post -->
          <div>
            <textarea
              name="post"
              id="floatingTextarea"
              rows="2"
              placeholder="Write your message"
              class="form-control text-justify"
              v-model="post"
            ></textarea>

            <div class="mb-3">
              <label for="formFile" class="form-label m-2 text-light fs-5"
                >Add the image for your message</label
              >
              <input
                :key="fileInputKey"
                name="file"
                accept="image/*"
                class="form-control"
                type="file"
                aria-label="upload image"
                @change="uploadFile"
                id="formFile"
              />
            </div>

            <p class="text-light">{{ errorMessage }}</p>

            <button
              role="button"
              type="submit"
              class="btn btn-outline-secondary mb-3"
            >
              <fa icon="fa-paper-plane" />
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  </article>
</template>

<script>
import axios from "axios";

import ProfilPictureComp from "./ProfilPictureComp.vue";
export default {
  components: { ProfilPictureComp },
  name: "UserNewPostComp",

  data() {
    return {
      post: "",
      file: "",
      errorMessage: null,
      fileInputKey: 0,
    };
  },

  methods: {
    uploadFile(event) {
      this.file = event.target.files[0];
    },

    createPost() {
      /*Il faut qu'il y est quelque chose à poster*/
      if (!this.post && !this.file) {
        this.errorMessage = "⛔️ Please write a message and choose an image!";
        return;
      }

      /* on créé un objet formData qui va contenir les élements à poster*/
      let formData = new FormData();
      formData.append("post", this.post);
      formData.append("file", this.file);
      formData.append("userId", this.$store.state.user._id);
      formData.append("authorImg", this.$store.state.user.picture);
      formData.append(
        "userName",
        this.$store.state.user.firstName + " " + this.$store.state.user.lastName
      );

      /* envoi de l'objet formData via axios.post */
      axios
        .post("publication", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          if (response.status === 201) {
            this.$store.commit("ajouterPost", response.data.post);
            this.post = "";
            this.file = "";
            this.fileInputKey++;
            this.$emit("postCree", true);
          }
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
  margin: auto;
  background-color: #4e5166 !important;
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

@media (max-width: 768px) {
  .card {
    margin: auto 3rem;
  }
}
</style>
