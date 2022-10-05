import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    user: {},
    posts: [],
  },
  // use this function in the PostPage.vue and UserProfilComp.vue
  getters: {
    fullName: function (state) {
      return `${state.user.firstName} ${state.user.lastName}`;
    },
  },

  mutations: {
    // call SET_USER in the components SignInPage, VerifyUserComp, UserProfilComp
    SET_USER(state, user) {
      state.user = user;
    },
    SET_POST(state, posts) {
      state.posts = posts;
    },
    // call CREATE_POST in the component UserNewPostComp
    CREATE_POST(state, newPost) {
      state.posts.unshift(newPost);
    },
    // call UPDATE_USER in the component UserProfilComp
    UPDATE_USER(state, updatedUser) {
      state.user.description = updatedUser.description;
      state.user.picture = updatedUser.picture;
    },
    // call UPDATE_POST in the action
    UPDATE_POST(state, updatedPost) {
      state.posts.forEach((post) => {
        if (post._id === updatedPost._id) {
          post.post = updatedPost.post;
          post.imageUrl = updatedPost.imageUrl;
        }
      });
    },
    // call LIKE_POST in the component UserPostComp
    LIKE_POST(state, updatedPost) {
      state.posts.forEach((post) => {
        if (post._id == updatedPost._id) {
          post.likes = updatedPost.likes;
          //post.usersLiked = updatedPost.usersLiked
          console.log("UPDATE_POST.likes", updatedPost.likes);
          console.log("post.likes", post.likes);
        }
      });
    },
  },
  // the actions like the methods, it contains a name, a parameter context and second argument optional
  // to use the actions in the components, use dispatch
  actions: {
    async getAllPosts(context) {
      try {
        const response = await axios.get("publication", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        context.commit("SET_POST", response.data);
      } catch (err) {
        console.log(err);
      }
    },
  },
  modules: {},
});
