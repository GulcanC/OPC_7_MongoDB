<template>
  <div class="picture-user-container mx-auto">
    <img
      v-if="$store.state.user.picture"
      :src="store.state.user.picture"
      alt="user profil picture"
      class="picture-user-profile shadow"
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
  width: 78px;
  margin-top: 10px;
}
.picture-user-profile {
  border-radius: 50%;
  padding: 0;
  height: 78px;
  object-fit: cover;
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
