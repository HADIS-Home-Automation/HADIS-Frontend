import Vue from "vue";
import VueRouter from "vue-router";
import content from "../configJSON.json"

let routes = [];
let groups = content.groups;

// dynamically build routes from configJSON
for( let i in groups){

  let route = {};
  route["path"] = groups[i].groupRoute;
  route["name"] = groups[i].groupNameMQTT;

  routes.push(route)
}

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
