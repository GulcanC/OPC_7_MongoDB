<!-- It is the same with ModalProfilComp -->
<template>
  <div
    class="modal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="Edit post"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <!-- modal header -->
        <div class="modal-header">
          <h5 class="modal-title" id="modalTitle">{{ title }}</h5>
          <button
            role="button"
            type="button"
            class="close btn"
            aria-label="Close"
            data-dismiss="modal"
            @click="$emit('closePostModal')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <!-- modal body -->
        <!-- here some part of UserPostComp will come instead of slot-->
        <div class="modal-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalPostComp",
  props: ["title"],
};
</script>

<style></style>
