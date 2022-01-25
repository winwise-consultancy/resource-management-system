import Vue from "vue";
import Router from "vue-router";
import Welcome from "./components/Welcome.vue"
import WorkOverview from "./components/WorkOverview.vue";
import WorkDetails from "./components/WorkDetails.vue";
import Feedback from "./components/Feedback.vue"

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: "*", name: "/", component: Welcome, },
    { path: "/Welcome", name: "Welcome", component: Welcome, },
    { path: "/WorkOverview", name: "WorkOverview", component: WorkOverview, },
    { path: "/WorkDetails", name: "WorkDetails", component: WorkDetails, },
    { path: "/Feedback", name: "Feedback", component: Feedback, },
  ],
});
