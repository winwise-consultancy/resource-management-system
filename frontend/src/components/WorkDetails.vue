<template>
  <v-layout column wrap style="height: 80vh">
    <v-flex md12 style="overflow: auto">
      <v-sheet fluid>
        <v-card width="100vw">
          <v-card-title class="”title”">Work Details</v-card-title>
          <v-card-text fluid
            >'Project Work', 'Departmental Internal Work', 'Vacation' to be
            filled out by department head for his/her team in business
            days</v-card-text
          >
          <div v-if="!isFetching">
            <v-list
              v-for="[Department, Teams] in OrganizationData"
              :key="Department"
            >
              <v-list-group :value="false">
                <template v-slot:activator>
                  <v-list-item-title
                    ><strong>{{ Department }}</strong></v-list-item-title
                  >
                </template>

                <v-list-group
                  v-for="(Team, index) in Teams"
                  :key="index"
                  :value="false"
                  sub-group
                >
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title>{{ Team }}</v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <v-list-item>
                    <WorkData :Department="Department" :Team="Team" />
                  </v-list-item>
                </v-list-group>
              </v-list-group>
            </v-list>
          </div>
          <v-list>
            <v-list-group>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>Onboard ( + )</v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item>
                <Onboard :onboard="true" />
              </v-list-item>
            </v-list-group>
            <v-list-group>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>Offboard ( - )</v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item>
                <Onboard :onboard="false" />
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-card>
      </v-sheet>
    </v-flex>
  </v-layout>
</template>

<script>
import WorkData from "./WorkData.vue";
import Onboard from "./Onboard.vue";

export default {
  name: "WorkDetails",
  data() {
    return {};
  },
  mounted: function () {
    this.$store.dispatch("load");
  },
  methods: {},
  computed: {
    isFetching() {
      return this.$store.state.isFetching;
    },
    OrganizationData() {
      return this.$store.state.OrganizationData;
    },
  },
  components: { WorkData, Onboard },
};
</script>
