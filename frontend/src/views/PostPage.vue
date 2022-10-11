<!-- Post page -->
<template>
  <main class="main">
    <!-- logo and welcome message -->
    <div
      class="navbar-post d-flex flex-row justify-content-between align-items-center"
    >
      <img src="../assets/icon-left-font-monochrome-white.svg" alt="logo" />
      <h5 class="mt-3 mb-3 profil-username text-light">
        Hello
        <b class="text-uppercase"> {{ $store.getters["fullName"] }}</b
        >, share your message!
      </h5>
    </div>
    <div class="row overflow-hidden flex-row conteiner-main">
      <!-- user profil at the left of the page-->
      <section class="col-lg-3 mx-4 conteiner-profil">
        <UserProfilComp />
      </section>

      <!-- welcome message, new post area and all posts at the right of the page -->
      <section class="col-lg-8">
        <!-- welcome message at the top of the page -->

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
    return {};
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
      }
    } else {
      this.$router.push("/login");
    }
  },
};
</script>

<style scoped>
.conteiner-main {
  padding: 1.5rem;
  margin: auto;
}
div .navbar-post img {
  width: 10rem;
  padding: 1rem 0 1rem 0;
}
div .navbar-post {
  padding-right: 4rem;
  padding-left: 4rem;
  background-color: #4e5166;
}

@media (max-width: 992px) {
  .conteiner-main {
    padding: 8px;
  }
  .conteiner-profil {
    margin: 0px !important;
  }
}

@media (max-width: 768px) {
  .navbar-post {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
  }
}
</style>
