// This file will export a router object that is returned from the createRouter function.
// import the views and create an array of objects, storing them into a const called routes
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import SignInPage from "@/views/SignInPage.vue";
import SignUpPage from "@/views/SignUpPage.vue";
import PostPage from "@/views/PostPage.vue";

// path: The URL address
// name: An assigned name to reference a route in your project
// component: The component that gets mounted when the path is entered in the URL bar of the browser

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/login",
    name: "SignInPage",
    component: SignInPage,
  },

  {
    path: "/signup",
    name: "SignUpPage",
    component: SignUpPage,
  },

  {
    path: "/post",
    name: "PostPage",
    component: PostPage,
  },
];

// The object you pass in has two properties: history and routes.
// The history property contains the generated history from createWebHistory and routes is an array of objects.
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
