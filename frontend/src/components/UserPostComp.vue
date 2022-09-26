<template>
  <article class="post-card p-2 mb-4 shadow-sm">
    <div class="post-user">
      <figure
        class="post-user-info"
        aria-label="information about the owner of the post"
      >
        <div class="picture-user-container mx-auto mt-1 ms-4">
          <img
            v-if="post.authorImg"
            :src="post.authorImg"
            alt="profil picture"
            class="picture-user-profil shadow"
          />

          <img
            v-else
            src="../assets/avatar.png"
            alt="default profil picture"
            class="picture-user-profil shadow"
          />
        </div>

        <figcaption aria-label="user name and date of the post">
          {{ post.userName }} <br />
          <span class="date">{{ timestamp }}</span>
        </figcaption>
      </figure>

      <div class="modif">
        <button
          @click="ShowModalPost = true"
          v-if="post.userId == user.userId || user.admin == true"
          role="button"
          type="button"
          class="btn btn-primary"
          aria-label="update the post"
        >
          <fa icon="pencil" alt="icon" />
        </button>

        <transition name="modalFade">
          <UpdatePostModalComp
            v-if="showModalPost"
            @closeModal="showModalPost = false"
            title="Update the post"
          >
            <h2>Update your post and profil picture</h2>

            <form
              @submit.prevent="UpdatePost"
              style="text-align: left"
              aria-label="Edit post fields"
            >
              <div class="mb-3">
                <div class="form-floating">
                  <textarea
                    class="form-control text-left"
                    id="floatingTextarea"
                    name="textarea"
                    placeholder="Add your modifications"
                    cols="30"
                    rows="10"
                    v-model="newPost.post"
                  ></textarea>

                  <label for="floatingTextarea">Change or add a message</label>
                </div>
              </div>
              <div class="mb-5">
                <label for="formFile" class="form-label"
                  >Change or add a message</label
                >
                <input type="file" class="form-control" id="formFile" />
              </div>
            </form>
          </UpdatePostModalComp>
        </transition>
      </div>
    </div>
  </article>
</template>
