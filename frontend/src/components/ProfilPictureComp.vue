<template>
  <div class="picture-user-container">
    <img
      class="picture-user-profile shadow"
      v-if="$store.state.user.picture"
      :src="$store.state.user.picture"
      alt="profil picture"
    />
    <img
      v-else
      src="../assets/avatar.png"
      alt="default profil picture"
      class="picture-user-profile shadow"
    />
  </div>
</template>

<script>
export default {
  name: "ProfilPictureComp",
};
</script>

<style scoped>
.picture-user-container {
  width: 7rem;
  margin-top: 10px;
  background-color: transparent;
}
.picture-user-profile {
  border-radius: 50%;
  padding: 0;
  object-fit: cover;
  height: 6rem;
  width: 6rem;
}

@media (max-width: 768px) {
  .picture-user-container {
    width: 5rem !important;
  }
  .picture-user-profile {
    height: 6rem;
  }
}
</style>
