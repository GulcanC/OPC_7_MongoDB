<!-- user post comp will be shown in the modal post -->
<template>
  <article class="post-card p-2 mb-4 text-light">
    <div class="d-flex justify-content-between">
      <figure class="d-flex" aria-label="user information">
        <!-- user profil picture on the post, if user does not choose a profil picture, show default one -->
        <div class="picture-user-container mx-auto mt-1 ms-4">
          <img
            class="picture-user-profile shadow"
            v-if="post.authorImg"
            :src="post.authorImg"
            alt="profil picture"
          />
          <img
            v-else
            src="../assets/avatar.png"
            alt="default profil picture"
            class="picture-user-profile shadow"
          />
        </div>
        <!-- user name and date on the post -->
        <figcaption aria-label="user name" class="text-capitalize">
          {{ post.userName }} <br />
          <span class="date text-muted"> {{ timestamp }} </span>
        </figcaption>
      </figure>
      <!-- button on the post container which will open a modal to edit post -->
      <div class="modif">
        <!-- button to edit post, user can delete her own post and administrator can delete all user's post -->
        <button
          role="button"
          type="button"
          class="btn button-type-1"
          title="Update your post"
          v-if="post.userId == user.userId || user.admin == true"
          @click="showModal = true"
        >
          <fa icon="fa-pen-to-square" alt="icon" />
        </button>

        <!-- this part of the modal will be replaced with the slot in ModalPostComp -->

        <ModalPostComp
          v-if="showModal"
          title="Update your post"
          @closePostModal="showModal = false"
        >
          <form
            @submit.prevent="UpdatePost()"
            style="text-align: left"
            aria-label="form to edit post"
          >
            <!-- upload picture field on the modal -->
            <div class="mb-3">
              <label for="formFile" class="form-label"
                >Add or change the image</label
              >
              <input
                accept="image/*"
                class="form-control"
                type="file"
                @change="uploadPicture"
                id="formFile"
              />
            </div>

            <!-- textarea to change user's message on the modal -->
            <div class="mb-3">
              <div class="form-floating">
                <p class="text-light">Add or change the message</p>
                <textarea
                  class="form-control text-left"
                  placeholder="Write your message"
                  id="floatingTextarea"
                  v-model="newPost.post"
                ></textarea>
              </div>
            </div>

            <!-- delete and submit changes buttons on the post -->
            <div class="d-flex justify-content-between">
              <button
                role="button"
                type="button"
                class="btn button-type-2"
                @click="deletePost()"
              >
                <fa icon="fa-trash-alt" class="me-2" alt="icon" />
                Delete the post
              </button>

              <button role="button" type="submit" class="btn button-type-2">
                <fa icon="fa-paper-plane" class="me-2" alt="icon" />
                Save the changes
              </button>
            </div>

            <p>{{ errorMessage }}</p>
          </form>
        </ModalPostComp>
      </div>
    </div>

    <!-- user post and image on the post container-->
    <div class="post-content">
      <div class="post-content--img" v-if="post.imageUrl != null">
        <img :src="post.imageUrl" alt="post image" />
      </div>
    </div>

    <p class="post-text">
      {{ post.post }}
    </p>

    <!-- like button on the post container -->
    <div>
      <div class="like">
        <button
          type="button"
          role="button"
          aria-label="like"
          class="button d-flex flex-row gap-1 mt-3 mb-3 m-auto border-0"
          @click="likePost()"
        >
          <span class="like-number" aria-label="likes">{{ post.likes }}</span>
          <fa icon="fa-thumbs-up" alt="icon" />
        </button>
      </div>
    </div>
  </article>
</template>

<script>
import axios from "axios";
import ModalPostComp from "./ModalPostComp.vue";
export default {
  name: "UserPostComp",
  components: {
    ModalPostComp,
  },
  data() {
    return {
      publications: [],
      showModal: false,
      newPost: {
        post: "",
        image: "",
      },
      user: {
        admin: this.$store.state.user.admin,
        userId: this.$store.state.user._id,
      },
      timestamp: "",
      errorMessage: "",
    };
  },
  created() {
    setInterval(this.getNow, 1000);
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  methods: {
    //afficher la date sur le post
    getNow: function () {
      const today = new Date();
      const date =
        today.getDate() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getFullYear();
      this.timestamp = date;
    },
    // function for upload image when we open the modal,
    uploadPicture(event) {
      this.newPost.image = event.target.files[0];
    },
    // function to update post when we open the modal, newPost comes from store
    UpdatePost() {
      const token = localStorage.getItem("token");
      let formData = new FormData();
      formData.append("post", this.newPost.post);
      formData.append("id", this.post._id);
      if (this.newPost.image != "") {
        formData.append("file", this.newPost.image);
      }
      let id = this.post._id;
      // http://localhost:3000/api/publication/:id
      axios
        .put(`publication/${id}`, formData, {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.data);
          this.$store.commit("UPDATE_POST", response.data.post);
          this.showModal = false;
        })
        .catch((error) => {
          console.log(error);
          this.errorMessage =
            "⛔️ You cannot edit this post, please try again later.";
        });
    },
    // function to delete the post
    deletePost() {
      let id = this.post._id;
      const token = localStorage.getItem("token");
      axios
        .delete("publication/" + `${id}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          console.log(response.data);
          // deleteUserPost comes from backend, it is an object,
          // here "acknowledged" is a boolean, it means, if the deletion is accepted get all posts
          // deleteUserPost is an object that contains "acknowledged" and "deletedCount" shows the quantity of deleted item
          if (response.data.deleteUserPost.acknowledged) {
            this.$store.dispatch("getAllPosts");
          }
          this.showModal = false;
        })
        .catch((error) => {
          console.log(error);
          this.errorMessage =
            "⛔️ Error! You can not delete this post, please try again later.";
        });
    },
    likePost() {
      const userId = this.$store.state.user._id;
      const likeData = {
        userId,
        postId: this.post._id,
        like: 1,
      };
      axios
        .post(`publication/${this.post._id}/like/`, likeData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.$store.commit("LIKE_POST", response.data.updatedPost);
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>

<style scoped>
.button-type-1 {
  background-color: #ffd7d7;
  color: #4e5166;
  border: 1px solid #4e5166;
}
.button-type-2 {
  background-color: white;
  color: #4e5166;
  border: 1px solid #4e5166;
}
.button-type-2:hover {
  border: 1px solid white;
}
.post-card {
  background-color: #4e5166;
}
.post-text {
  color: white;
  background-color: transparent;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
  padding: 1rem;
  margin: 0 1rem 0 1rem;
  border-radius: 0.3rem;
}
.post-content img {
  max-height: 15rem;
  margin-bottom: 3rem;
  width: 100%;
  object-fit: contain;
}
figcaption {
  min-width: fit-content;
  margin: 0.5rem;
}

.picture-user-container {
  width: 7rem;
}
.picture-user-profile {
  border-radius: 50%;
  width: 6rem;
  height: 6rem;
  object-fit: cover;
}
.like button {
  color: #ffd7d7;
  background-color: transparent;
}
.like button:active,
.like button:focus {
  transform: scale(1.2);
  color: #fd2d01;
}
.like button:hover {
  transform: scale(1.2);
  color: black;
}

@media (max-width: 768px) {
  .picture-user-container {
    width: 5rem !important;
    height: 5rem !important;
    margin-right: 2rem !important;
  }
  .picture-user-profile {
    height: 5rem;
  }
}
</style>
