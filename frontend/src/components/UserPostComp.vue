<!-- user post comp will be shown in the modal post -->
<template>
  <article class="post-card p-2 mb-4 text-light">
    <div class="post-user">
      <figure class="post-user-info" aria-label="user information">
        <!-- user picture on the post -->
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
      <div class="modif">
        <!-- button to edit post -->
        <button
          role="button"
          aria-label="update your post"
          v-if="post.userId == user.userId || user.admin == true"
          type="button"
          class="btn button-type-1"
          @click="showModal = true"
        >
          <fa icon="fa-pen-to-square" alt="icon" />
        </button>

        <!-- this part of the modal will be replaced with the slot in ModalPostComp -->
        <transition name="modalFade">
          <ModalPostComp
            v-if="showModal"
            title="Update your post"
            @fermeLeModal="showModal = false"
          >
            <form
              @submit.prevent="UpdatePost"
              style="text-align: left"
              aria-label="form to edit post"
            >
              <div class="mb-3">
                <label for="formFile" class="form-label"
                  >Add or change the image</label
                >
                <input
                  accept="image/*"
                  class="form-control"
                  type="file"
                  @change="uploadFile"
                  id="formFile"
                />
              </div>

              <div class="mb-3">
                <div class="form-floating">
                  <p class="text-transparent">Add or change the message</p>
                  <textarea
                    class="form-control text-left"
                    placeholder="ajoutez vos modifications"
                    id="floatingTextarea"
                    v-model="newPost.post"
                  ></textarea>
                </div>
              </div>

              <div class="d-flex justify-content-between">
                <button
                  role="button"
                  type="button"
                  class="btn button-type-2"
                  @click="deletePost"
                >
                  <fa icon="fa-trash-alt" class="me-2" alt="icon" />
                  Delete the post
                </button>

                <button
                  role="button"
                  aria-label="Enregistrer les modifications"
                  type="submit"
                  class="btn button-type-2"
                >
                  <fa icon="fa-paper-plane" class="me-2" alt="icon" />
                  Save the changes
                </button>
              </div>

              <p>{{ errorMessage }}</p>
            </form>
          </ModalPostComp>
        </transition>
      </div>
    </div>

    <!-- user post and image -->
    <div class="post-content">
      <p class="text-left-align">{{ post.post }}</p>
      <div class="post-content--img" v-if="post.imageUrl != null">
        <img :src="post.imageUrl" alt="post image" />
      </div>
    </div>
    <!---- Partie Like ---->
    <div>
      <div class="like">
        <button
          type="button"
          role="button"
          aria-label="ajouter un like à ce post"
          class="btn like-btn"
          @click="likeIt()"
        >
          <span aria-label="nombre de like" class="badge">{{
            post.likes
          }}</span>
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

    /*Choisir une nouvelle image*/
    uploadFile(event) {
      this.newPost.image = event.target.files[0];
    },

    /* Modifier et envoyer le nouveau post */
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
        .then((res) => {
          this.$store.commit("updatePost", res.data.post);
          this.showModal = false;
        })
        .catch((error) => {
          console.log(error);
          this.errorMessage =
            "Vous ne pouvez pas modifier votre publication pour le moment, veuillez réessayer plus tard.";
        });
    },
    /* Supprimer le post */

    deletePost() {
      const token = localStorage.getItem("token");
      axios
        .delete("publication/" + this.post._id, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log("response du delete", response.data);
          if (response.data.delPost.acknowledged) {
            //appel la fonction pour remettre l'ensemble des post
            this.$store.dispatch("getAllPosts");
          }
          this.showModal = false;
        })
        .catch((error) => {
          console.log(error);
          this.errorMessage =
            "Vous ne pouvez pas supprimer votre publication pour le moment, veuillez réessayer plus tard.";
        });
    },

    /****************Like et dislikes*************** */
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
  max-height: 20rem;
  margin-bottom: 3rem;
  width: 100%;
  object-fit: contain;
}
figcaption {
  min-width: fit-content;
  margin: 0.5rem;
}
.text-left-align {
  text-align: left !important;
  margin-left: 3rem;
  color: black;
}

.picture-user-container {
  width: 7rem;
}
.picture-user-profile {
  border-radius: 50%;
  height: 6rem;
  width: 6rem;
  object-fit: cover;
}

.badge {
  color: green;
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
