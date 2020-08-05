import Vue from "vue";
import VueHashRouter from "../vue-hash-router";
import Home from "../views/Home.vue";

Vue.use(VueHashRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueHashRouter({
  routes
});

export default router;
