<template>
  <ProfilPictureComp />
  <ModalProfilComp />
  <UserProfilComp />
</template>

<script>
// @ is an alias to /src
import ProfilPictureComp from "@/components/ProfilPictureComp.vue";
import ModalProfilComp from "@/components/ModalProfilComp.vue";
import UserProfilComp from "@/components/UserProfilComp.vue";

export default {
  name: "HomePage",
  components: {
    ProfilPictureComp,
    ModalProfilComp,
    UserProfilComp,
  },
};
</script>
