<template>
  <div class="profil-picture-container">
    <img
      v-if="$store.state.user.picture"
      :src="store.state.user.picture"
      alt="user profil picture"
      class="profil-picture-user"
    />
    <img
      v-else
      src="../assets/avatar.png"
      alt="default profil picture"
      class="profil-picture-user"
    />
  </div>
</template>

<script>
export default {
  name: "ProfilPictureComp",
};
</script>

<style>
.profil-picture-user {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
}

@media (max-width: 768px) {
}
</style>
