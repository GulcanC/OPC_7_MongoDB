<template>
  <article class="post-card p-2 mb-4 shadow-sm">
    <div class="post-user">
      <figure
        class="post-user-info"
        aria-label="information about the owner of the post"
      >
        <div class="picture-user-container mx-auto mt-1 ms-4">
          <img
            v-if="post.authorImg"
            :src="post.authorImg"
            alt="profil picture"
            class="picture-user-profil shadow"
          />

          <img
            v-else
            src="../assets/avatar.png"
            alt="default profil picture"
            class="picture-user-profil shadow"
          />
        </div>

        <figcaption aria-label="user name and date of the post">
          {{ post.userName }} <br />
          <span class="date">{{ timestamp }}</span>
        </figcaption>
      </figure>

      <div class="modif">
        <button
          @click="ShowModalPost = true"
          v-if="post.userId == user.userId || user.admin == true"
          role="button"
          type="button"
          class="btn btn-primary"
          aria-label="update the post"
        >
          <fa icon="pencil" alt="icon" />
        </button>

        <transition name="modalFade">
          <update-post-modal-comp
            v-if="showModalPost"
            @closeModal="showModalPost = false"
            title="Update the post"
          >
            <h2>Update your post and profil picture</h2>

            <form
              @submit.prevent="UpdatePost"
              style="text-align: left"
              aria-label="Edit post fields"
            >
              <div class="mb-3">
                <div class="form-floating">
                  <textarea
                    class="form-control text-left"
                    id="floatingTextarea"
                    name="textarea"
                    placeholder="Add your modifications"
                    cols="30"
                    rows="10"
                    v-model="newPost.post"
                  ></textarea>

                  <label for="floatingTextarea">Change or add a message</label>
                </div>
              </div>
              <div class="mb-5">
                <label for="formFile" class="form-label"
                  >Change or add a message</label
                >
                <input
                  @change="uploadFile"
                  accept="image/*"
                  type="file"
                  class="form-control"
                  id="formFile"
                  aria-label="change picture"
                />
              </div>

              <div class="d-flex justify-content-between">
                <button
                  @click="deletePost"
                  class="btn btn-danger"
                  role="button"
                  type="button"
                  aria-label="delete the post"
                >
                  <fa icon="trash-alt" class="me-2" alt="icon" />Delete the post
                </button>

                <button
                  class="btn btn-primary"
                  role="button"
                  type="submit"
                  aria-label="Save the modifications"
                >
                  Save the modifications
                </button>
              </div>
              <p>{{ errorMessage }}</p>
            </form>
          </update-post-modal-comp>
        </transition>
      </div>
    </div>

    <div class="post-content">
      <p>{{ post.post }}</p>
      <div v-if="post.imageUrl != null" class="post-content--img">
        <img :src="post.imageUrl" alt="post picture" />
      </div>
    </div>

    <div class="like">
      <button
        @click="likeIt()"
        class="btn like-button"
        type="button"
        role="button"
        aria-label="like"
      >
        <span class="badge" aria-label="like"> {{ post.likes }}</span>
        <fa icon="heart" alt="image" />
      </button>
    </div>
  </article>
</template>

<script>
import axios from "axios";
import UpdatePostModalComp from ".UpdatePostModalComp.vue";

export default {
  name: "UserPostComp",
  components: { UpdatePostModalComp },

  data() {
    return {
      publications: [],
      showModalPost: false,
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

    uploadFile(event) {
      this.newPost.image = event.target.files[0];
    },

    UpdatePost() {
      const token = localStorage.getItem("token");
      let formData = new FormData();
      formData.append("post", this.newPost.post);
      formData.append("id", this.post._id);

      if (this.newPost.image != "") {
        formData.append("file", this.newPost.image);
      }
      let id = this.post._id;
      axios
        .put(`publication/${id}`, formData, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          this.$store.commit("updatePost", res.data.post);
          this.showModalPost = false;
        })
        .catch((error) => {
          console.log(error);
          this.errorMessage =
            "You cannot edit your post at this time, please try again later.";
        });
    },

    deletePost() {
      const token = localStorage.getItem("token");
      axios
        .delete("publication/" + this.post._id, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.delPost.acknowledged) {
            this.$store.dispatch("getAllPosts");
          }
          this.showModalPost = false;
        })
        .catch((error) => {
          console.log(error);
          this.errorMessage =
            "You cannot delete your post at this time, please try again later.";
        });
    },

    likeIt() {
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
          this.$store.commit("updateLikes", response.data.updatedPost);
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>
<style>
.post-card {
  border: none;
}
.post-user {
  display: flex;
  justify-content: space-between;
}
.post-user-info {
  display: flex;
}

.fa-heart {
  color: #dd0303;
  font-size: 1.7em;
  transition: all 600ms ease;
}

.post-content {
  margin: -10px 100px;
}

.post-content img {
  max-height: 300px;
  width: 100%;
  margin: 10px 0px;
  object-fit: contain;
}
figcaption {
  min-width: fit-content;
  margin: 5px;
}

.profile-picture {
  border-radius: 50%;
  width: 80px;
  box-shadow: 1px 1px grey;
  height: 80px;
  object-position: center;
  object-fit: cover;
}

.date {
  color: #b2b2b2;
  font-size: 12px;
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
  width: 78px;
  object-fit: cover;
}

.badge {
  color: var(--tertiary-color);
}
.like {
  margin: 0px 100px;
  display: flex;
  justify-content: flex-end;
}
.like-btn {
  display: flex;
  align-items: center;
}
.like .like-btn:hover,
.like .like-btn:focus,
.like .like-btn:active {
  background-color: white;
  border-color: white;
}

.like .like-btn:hover .fa-heart {
  transform: scale(1.2);
}
.fa-pencil {
  font-size: 1.2em;
}
@media (max-width: 768px) {
  .picture-user-container {
    width: 65px !important;
  }
  .picture-user-profile {
    height: 70px;
  }
}
</style>
