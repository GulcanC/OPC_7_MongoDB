<template>
  <div>
    <div
      class="modal"
      role="dialog"
      tabindex="-1"
      aria-labelledby="Update user information"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="modal-title">{{ modal - title }}</h4>
            <button
              class="close"
              type="button"
              data-dismiss="modal"
              aria-label="Close"
              @click="$emit('closeModal')"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-secondary"
              type="button"
              aria-label="Remove the modification"
              data-dismiss="modal"
              @click="$emit('closeModal')"
            >
              Do not save modififcations
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalProfilComp",
  props: ["title"],
};
</script>

<style scoped>
.modal {
  display: block;
  margin-top: 25rem;
}
.close {
  font-size: 1.2rem;
}
</style>
