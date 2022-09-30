<!-- Post page -->
<template>
  <main class="main">
    <div class="row overflow-hidden flex-row conteiner-main">
      <!-- user profil at the left of the page-->
      <section class="col-lg-3 mx-4 conteiner-profil">
        <UserProfilComp />
      </section>

      <!-- welcome message, new post area and all posts at the right of the page -->
      <section class="col-lg-8">
        <!-- welcome message at the top of the page -->
        <h3
          v-if="firstPost"
          class="first-post profil-username text-capitalize font-italic"
        >
          Hi
          {{ $store.state.user.firstName }}
          {{ $store.state.user.lastName }}, share your message!
        </h3>

        <!-- area to choose a picture and to share a text -->
        <!-- <UserNewPostComp @postCree="this.firstPost = false" /> -->
        <UserNewPostComp />
        <!-- all posts -->
        <UserPostComp
          class="card"
          v-for="post in $store.state.posts"
          :key="post._id"
          :post="post"
        >
        </UserPostComp>
      </section>
    </div>
  </main>
</template>

<script>
import UserNewPostComp from "@/components/UserNewPostComp.vue";
import UserPostComp from "@/components/UserPostComp.vue";
import UserProfilComp from "@/components/UserProfilComp.vue";

export default {
  name: "PostPage",
  data() {
    return {
      firstPost: false,
    };
  },

  components: {
    UserNewPostComp,
    UserPostComp,
    UserProfilComp,
  },

  // getAllPosts is an action to trigger this action, we use dispatch => this.$store.dispatch("action");
  async created() {
    if (this.$store.state.user) {
      this.$store.dispatch("getAllPosts");
      if (!this.$store.state.posts || this.$store.state.posts.length === 0) {
        this.firstPost = true;
      }
    } else {
      this.$router.push("/login");
    }
  },
};
</script>

<style scoped>
.main {
  background-color: var(--secondary-color);
}
.conteiner-main {
  padding: 1.5rem;
  max-width: 1300px;
  margin: auto;
}
.first-post {
  margin-top: 25px;
  margin-bottom: 25px;
}

@media (max-width: 992px) {
  .conteiner-main {
    padding: 8px;
  }
  .conteiner-profil {
    margin: 0px !important;
  }
}
</style>
