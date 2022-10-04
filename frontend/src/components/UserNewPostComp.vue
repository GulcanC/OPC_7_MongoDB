<!-- create a new post -->
<template>
  <article class="card post-card mb-4">
    <form
      @submit.prevent="createPost"
      class="form-post p-2"
      name="myForm"
      id="myForm"
      aria-label="form for creating new post"
    >
      <div class="d-flex flex-column">
        <div class="">
          <ProfilPictureComp></ProfilPictureComp>
        </div>

        <!-- textarea for writing your post -->
        <div class="">
          <label class="new-post" for="postContent">Create your post</label>
          <div>
            <textarea
              name="post"
              id="floatingTextarea"
              rows="2"
              placeholder="Create your post"
              class="form-control text-left"
              v-model="post"
            ></textarea>

            <!-- input to upload an image -->
            <div class="mb-5">
              <label for="formFile" class="form-label">Add an image</label>
              <!-- This input will allow the user to open the browser file selection dialog and select one or more files -->
              <!-- The key acts as a sort of flag that tells Vue "if the data associated with this child component is moved somewhere else, then move the component along with it to preserve the changes that already exist".-->
              <input
                :key="pictureInputKey"
                @change="uploadPicture"
                name="file"
                accept="image/*"
                class="form-control"
                type="file"
                id="formFile"
              />
            </div>

            <!-- If the fields are empties show an error message -->
            <p class="err-msg">{{ errorMessage }}</p>
            <button role="button" type="submit" class="btn-post text-dark">
              <fa icon="fa fa-paper-plane" />
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
      pictureInputKey: 0,
    };
  },
  methods: {
    uploadPicture(event) {
      this.file = event.target.files[0];
    },
    createPost() {
      // if the post text and image are empties show an error message
      if (!this.post && !this.file) {
        this.errorMessage =
          "⛔️ Please write your message and choose a picture!";
        return;
      }
      // Create an object formData which contains the data that will be posted
      let formData = new FormData();
      formData.append("post", this.post);
      formData.append("file", this.file);
      formData.append("userId", this.$store.state.user._id);
      // authorImg comes from model "publicaton", picture comes from model "User"
      formData.append("authorImg", this.$store.state.user.picture);
      // userName comes from model "publication", firsName and lastName come from model "User"
      formData.append(
        "userName",
        this.$store.state.user.firstName + " " + this.$store.state.user.lastName
      );
      // use axios to send formData, http://localhost:3000/api/publication
      axios
        .post("publication", formData, {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          if (response.status === 201) {
            this.$store.commit("createUserPost", response.data.post);
            this.post = "";
            this.file = "";
            this.pictureInputKey++;
            // this.$emit("postCree", true);
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
}
.post-card {
  border: none;
}
.form-post {
  padding: 5%;
  display: flex;
  flex-direction: column;
}
.btn-post {
  border-radius: 15px;
  transition: all 300ms ease-in-out;
  border: none;
  padding: 5px 13px;
  color: white;
}
.btn-post:hover {
  background-color: var(--primary-color);
  transform: scale(1.1);
}
.err-msg {
  color: var(--primary-color);
  font-weight: 400;
}
@media (max-width: 768px) {
  .new-post {
    margin-top: 15px;
    margin-bottom: 20px;
  }
  .mb-5 {
    margin-top: 1rem;
    margin-bottom: 2rem !important;
  }
}
</style>
