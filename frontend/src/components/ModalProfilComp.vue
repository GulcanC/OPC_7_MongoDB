<!-- Bootstrap modal example for the modification of the user's information-->
<template>
  <div>
    <!-- tabindex="-1", when modal dialog window opened, focus should be set to the dialog.-->
    <!-- so a screen reader will begin reading and the keyboard will begin navigating within the dialog. -->
    <!-- Because the modal dialog is not focusable by default, assigning it tabindex="-1" allows focus to be set to it with scripting when it is presented. -->
    <div
      class="modal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="Edit user information"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <!--modal header-->
          <!--data-dismiss="modal" closes the modal if you click on it.-->
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitle">{{ title }}</h5>

            <!--Using emit, we can trigger events and pass data up the component heirarchy. -->
            <!-- This is useful for things like: emitting data from an input, closing modals from inside the modal itself.-->

            <button
              type="button"
              class="close btn"
              aria-label="Close"
              data-dismiss="modal"
              @click="$emit('closeModal')"
            >
              <!-- Adding aria-hidden="true" to the icon hides the icon character from being included in the accessible name. -->
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <!-- modal body -->
          <!-- is a placeholder inside a web component that you can fill with your own markup, -->
          <!-- which lets you create separate DOM trees and present them together. -->
          <!-- The some part of the file "UserProfilComp" will be replaced with "slot" -->
          <div class="modal-body"><slot></slot></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// title comes from UserProfilComp.vue "Customize your profile"
export default {
  name: "ModalProfilComp",
  props: ["title"],
};
</script>

<style scoped>
.modal {
  display: block;
  background-color: #4d47478a;
  /* blur the element which is beheind the modal */
  backdrop-filter: blur(5px);
}
div.modal-header,
div.modal-footer,
#modalTitle,
.close.btn span {
  background-color: #fd2d01;
}
#modalTitle,
.close.btn span {
  color: white;
}

.modal-body {
  background-color: #4e5166;
}

.close {
  font-size: 1.5em;
}
</style>
