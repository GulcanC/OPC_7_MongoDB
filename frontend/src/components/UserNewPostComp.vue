<template>
  <article class="card post card mb-4 shadow-sm">
    <form
      @submit.prevent="createPost"
      id="myForm"
      class="form-post p-2"
      name="myForm"
      aria-label="Creta epost form"
    >
      <div class="row">
        <div class="col-2">
          <ProfilPictureComp></ProfilPictureComp>
        </div>
        <div class="col-10">
          <label for="postContent" class="new-post">New post</label>

          <div>
            <textarea
              name="post"
              id="floatingTextarea"
              cols="30"
              rows="10"
              class="form-control text-left"
              placeholder="What do you want to share today?"
              aria-label="fields for post message"
              v-model="post"
            ></textarea>

            <div class="mb-5">
              <label for="formFile" class="form-label"
                >Add an image below</label
              >
              <input
                @change="uploadFile"
                :key="fileInputKey"
                accept="image/*"
                name="file"
                type="file"
                class="form-control"
                id="formFile"
                aria-label="Upload an image"
              />
            </div>
            <p class="err-msg">{{ errorMessage }}</p>
            <button class="btn-post" role="button" type="submit">
              <fa icon="chack" />Publish
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
      if (!this.post && !this.file) {
        this.errorMessage = "You have to publish a picture and a massage!";
        return;
      }

      let formData = new FormData();
      formData.append("post", this.post);
    },
  },
};
</script>
