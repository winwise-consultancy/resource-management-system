<template>
  <v-layout column wrap style="height: 80vh">
    <v-flex md12 style="overflow: auto">
      <v-sheet fluid>
        <v-row>
          <v-col cols="12">
            <!-- To move between Windows -->
            <v-card-actions class="justify-space-between">
              <v-btn text @click="prev">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-item-group
                v-model="selectedWindow"
                class="text-center"
                mandatory
                rounded
              >
                <v-item
                  v-for="w in windows"
                  :key="w"
                  v-slot="{ active, toggle }"
                >
                  <v-btn rounded :input-value="active" @click="toggle">
                    {{ w }}
                  </v-btn>
                </v-item>
              </v-item-group>
              <v-btn text @click="next">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-card-actions>

            <!-- Windows Content here -->
            <v-window v-model="selectedWindow" horizontal>
              <v-window-item>
                <v-card class="mb-2">
                  <v-card-title class="”title”"
                    >Resource allocation(Percentage)
                  </v-card-title>
                  <div v-if="isDataPresent">
                    <v-card class="pa-md-4" max-width="40%">
                      <v-card>
                        <v-simple-table>
                          <thead>
                            <tr>
                              <th>Legand</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Team capacity available</td>
                              <td v-for="(l, index) in legand" :key="index">
                                <v-chip :color="l.color" dark>
                                  {{ l.text }}
                                </v-chip>
                              </td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </v-card>
                    </v-card>
                  </div>
                  <v-card-text>
                    <v-data-table
                      :headers="headers"
                      :items="percentageItems"
                      :multi-sort="false"
                      class="elevation-1"
                      disable-pagination
                      hide-default-footer
                    >
                      <template v-slot:body="{ items, headers }">
                        <tbody>
                          <tr v-for="(item, idx) in items" :key="idx">
                            <td v-for="(header, key) in headers" :key="key">
                              <div
                                v-if="
                                  header.value == 'Department' ||
                                  header.value == 'Team'
                                "
                              >
                                {{ item[header.value] }}
                              </div>
                              <div v-else>
                                <v-chip
                                  :color="getColor(item[header.value])"
                                  dark
                                  >{{ item[header.value] + "%" }}
                                </v-chip>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-window-item>

              <v-window-item>
                <v-card class="mb-2">
                  <v-card-title class="”title”"
                    >Resource allocation(Person Days)
                  </v-card-title>
                  <v-card-text>
                    <v-data-table
                      :headers="headers"
                      :items="personDaysItems"
                      :multi-sort="false"
                      class="elevation-1"
                      disable-pagination
                      hide-default-footer
                    >
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-window-item>

              <v-window-item>
                <v-card class="mb-2">
                  <v-card-title class="”title”"
                    >Resource allocation(Graph)
                    <v-spacer />
                    <v-switch
                      v-model="graphType"
                      :label="`${getGraphLable()}`"
                      color="info"
                      hide-details
                    ></v-switch>
                  </v-card-title>
                  <div v-for="(data, index) in personDaysItems" :key="index">
                    <v-card class="mb-2">
                      <v-card-title class="”title”">{{
                        "Details for " +
                        Object.values(data).splice(0, 1) +
                        ", " +
                        Object.values(data).splice(1, 1)
                      }}</v-card-title>
                      <div v-if="graphType">
                        <v-sparkline
                          show-labels
                          auto-line-width
                          type="bar"
                          :gradient="['#5EF7B7', '#0CBB72']"
                          :value="Object.values(data).splice(2)"
                        />
                      </div>
                      <div v-else>
                        <v-sparkline
                          show-labels
                          auto-line-width
                          :gradient="['#5EF7B7', '#0CBB72']"
                          :value="Object.values(data).splice(2)"
                        />
                      </div>
                    </v-card>
                  </div> </v-card
              ></v-window-item>
            </v-window>
          </v-col>
        </v-row>
      </v-sheet>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "WorkOverview",
  data() {
    return {
      selectedWindow: 0,
      windows: [
        "Resource allocation(Percentage)",
        "Resource allocation(Person Days)",
        "Resource allocation(Graph)",
      ],
      legand: [
        {
          text: "> 20%",
          color: "green",
        },
        {
          text: "in between 10%-20%",
          color: "orange",
        },
        {
          text: "<= 0%",
          color: "red",
        },
      ],
      graphType: false,
    };
  },
  mounted: function () {
    if (!this.$store.state.UpdatedWorkDetailsItems.size) {
      return;
    }
    let data = [...this.$store.state.UpdatedWorkDetailsItems.values()];
    this.$store.state.UpdatedWorkDetailsItems = new Map();
    this.$store.dispatch("save", data);
  },
  methods: {
    getColor(value) {
      if (value <= 0) return "red";
      if (value >= 20) return "green";
      return "orange";
    },
    getGraphLable() {
      return this.graphType ? "line chart" : "bar chart";
    },
    next() {
      this.selectedWindow =
        this.selectedWindow + 1 === this.windows.length
          ? 0
          : this.selectedWindow + 1;
    },
    prev() {
      this.selectedWindow =
        this.selectedWindow - 1 < 0
          ? this.windows.length - 1
          : this.selectedWindow - 1;
    },
  },
  computed: {
    months() {
      return this.$store.state.Months;
    },
    headers() {
      return this.$store.state.WorkOverviewHeaders;
    },
    personDaysItems() {
      return this.$store.state.WorkOverviewPersonDaysItems;
    },
    percentageItems() {
      return this.$store.state.WorkOverviewPercentageItems;
    },
    isDataPresent() {
      return (
        this.$store.state.WorkOverviewPercentageItems &&
        this.$store.state.WorkOverviewPercentageItems.length
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
