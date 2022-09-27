<template>
  <main class="main">
    <div class="row overflow-hidden flex-row-reverse conteiner-main">
      <section class="col-lg-3 mx-4 conteiner-profil">
        <UserProfilComp />
      </section>
      <section class="col-lg-8">
        <h1 v-if="firstPost" class="first-post">Partager quelque chose!</h1>
        <UserNewPostComp @postCree="this.firstPost = false" />
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
import axios from "axios";

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
