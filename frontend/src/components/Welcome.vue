<template>
  <v-timeline align-top dense>
    <div v-for="(step, index) in steps" :key="index">
      <v-timeline-item
        fill-dot
        small
        :color="step.color"
        :left="step.alignment === 'left'"
      >
        <v-card class="pa-md-4" max-width="40%">
          <v-card>
            <v-card-title :class="step.color">
              <v-icon dark size="42" class="mr-4"> {{ step.icon }} </v-icon>
              <h5 class="text-h5 white--text font-weight-light">
                {{ step.title }}
              </h5>
            </v-card-title>
            <v-container>
              <v-row>
                <v-col cols="6" md="10">
                  {{ step.content }}
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-card>
      </v-timeline-item>
    </div>
  </v-timeline>
</template>

<script>
export default {
  name: "Welcome",
  data() {
    return {
      steps: [
        {
          color: "primary",
          alignment: "right",
          size: "",
          icon: "",
          title: "WorkDetails",
          content:
            "Onboard/offboard resource and fill the teamwise resource availability details.",
        },
        {
          color: "primary",
          alignment: "right",
          size: "small",
          icon: "",
          title: "WorkOverview",
          content:
            "Displays monthly resource availability in percentage and person days.",
        },
        {
          color: "primary",
          alignment: "right",
          size: "",
          icon: "mdi-message-text",
          title: "Feedback",
          content: "To provide suggestion, feature request or report an issue.",
        },
      ],
    };
  },
  mounted: function () {},
  methods: {},
  computed: {},
};
</script>
