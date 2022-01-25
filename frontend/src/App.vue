<template>
  <v-app>
    <v-main>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-app-bar app color="primary" dark elevation="1">
              <v-app-bar-nav-icon
                @click.stop="sidebarMenu = !sidebarMenu"
              ></v-app-bar-nav-icon>
              <v-spacer></v-spacer>
              <v-toolbar-title>Resource Management System</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-app-bar>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-navigation-drawer
            v-model="sidebarMenu"
            app
            floating
            :permanent="sidebarMenu"
          >
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h6">RMS</v-list-item-title>
                <v-list-item-subtitle
                  >Resource Management System</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
            <v-list dense color="primary" dark>
              <v-list-item
                v-for="item in items"
                :key="item.title"
                link
                :to="item.href"
              >
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-col>

        <v-col cols="12">
          <v-container class="px-4 py-0 fill-height" fluid>
            <v-row class="fill-height">
              <v-col>
                <transition name="fade">
                  <router-view></router-view>
                </transition>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-footer color="primary" dark padless>
            <v-layout justify-center wrap>
              <v-flex primary py-4 text-center white--text xs12>
                <strong>{{ new Date().getFullYear() }}</strong>
              </v-flex>
            </v-layout>
          </v-footer>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      sidebarMenu: true,
      items: [
        {
          title: "Welcome",
          href: "/Welcome",
          icon: "mdi-home-outline",
        },
        {
          title: "WorkDetails",
          href: "/WorkDetails",
          icon: "mdi-account-multiple-outline",
        },
        {
          title: "WorkOverview",
          href: "/WorkOverview",
          icon: "mdi-view-dashboard",
        },
        {
          title: "Feedback",
          href: "/Feedback",
          icon: "mdi-message-text",
        },
      ],
    };
  },
  created: function () {
    this.$store.dispatch("init");
  },
  mounted: function () {
    this.$store.commit("load");
  },
  unmounted: function () {
    if (!this.$store.state.UpdatedWorkDetailsItems.size) {
      return;
    }
    let data = [...this.$store.state.UpdatedWorkDetailsItems.values()];
    this.$store.state.UpdatedWorkDetailsItems = new Map();
    this.$store.dispatch("save", data);
  },
  methods: {},
};
</script>
