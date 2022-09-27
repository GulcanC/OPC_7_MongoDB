import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import SignInPage from "@/views/SignInPage.vue";
import SignUpPage from "@/views/SignUpPage.vue";
import PostPage from "@/views/PostPage.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  /*   {
    path: "/post",
    name: "post",
    component: PostPage,
  }, */
  {
    path: "/signup",
    name: "SignUpPage",
    component: SignUpPage,
  },
  {
    path: "/login",
    name: "SignInPage",
    component: SignInPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
