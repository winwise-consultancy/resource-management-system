<template>
  <v-container>
    <v-card class="pa-md-4 mx-lg-auto">
      <v-form ref="onboardForm" @submit.prevent>
        <v-row>
          <v-col>
            <v-combobox
              clearable
              label="*Which Department you belong?"
              v-model="Department"
              :rules="rules"
              :items="getDepartments"
            >
            </v-combobox>
          </v-col>
          <v-col>
            <v-combobox
              clearable
              v-model="Team"
              label="Which Team you belong?"
              :items="getTeams"
            ></v-combobox>
          </v-col>
          <v-col>
            <v-text-field
              clearable
              v-model="Name"
              label="*First Name, Last Name"
              :rules="rules"
            ></v-text-field>
          </v-col>
        </v-row>
        <small>*indicates required field</small>
        <div class="v-messages"></div>
        <v-row justify="center">
          <v-btn @click="resetForm" class="mr-4">Reset</v-btn>
          <div v-if="onboard">
            <v-btn
              @click="onBoard"
              type="submit"
              color="primary"
              class="mr-4"
              :disabled="!detailsComplete"
              >Onboard</v-btn
            >
          </div>
          <div v-else>
            <v-btn
              @click="offBoard"
              type="submit"
              color="primary"
              class="mr-4"
              :disabled="!detailsComplete"
              >Offboard</v-btn
            >
          </div>
        </v-row>
      </v-form>
      <div class="v-messages"></div>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "onboard",
  data: () => ({
    Department: "",
    Team: "",
    Name: "",
    rules: [(value) => !!value || "Required."],
  }),
  props: {
    onboard: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    detailsComplete() {
      return this.Department && this.Name;
    },
    getDepartments() {
      return [...this.$store.state.OrganizationData.keys()];
    },
    getTeams() {
      return this.$store.state.OrganizationData.has(this.Department)
        ? [...this.$store.state.OrganizationData.get(this.Department)]
        : [];
    },
  },
  methods: {
    resetForm() {
      this.$refs.onboardForm.reset();
    },
    onBoard() {
      this.$store.dispatch("onBoard", {
        Department: this.Department,
        Team: this.Team,
        Name: this.Name,
        Bandwidth: this.$store.state.BusinessDays,
        PercentageBandwidth: new Array(
          this.$store.state.BusinessDays.length
        ).fill(100),
      });
      this.resetForm();
    },
    offBoard() {
      this.$store.dispatch("offBoard", {
        Department: this.Department,
        Team: this.Team,
        Name: this.Name,
      });
      this.resetForm();
    },
  },
};
</script>
