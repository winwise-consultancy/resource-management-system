<template>
  <v-container fluid fill-height>
    <v-card width="100vw">
      <v-card-text fluid>
        <v-row>
          <v-alert v-model="alert" type="info" shaped dense dismissible>
            {{ alertText }}
          </v-alert>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :items="items"
              item-key="Department"
              class="elevation-1"
              fixed-header
              style="overflow: auto"
              disable-pagination
              hide-default-footer
            >
              <template v-slot:header>
                <thead>
                  <tr>
                    <th colspan="1" />
                    <template v-for="month in months">
                      <th colspan="2" />
                      <th>
                        <strong>{{ month + "-22" }}</strong>
                      </th>
                      <th colspan="2" />
                    </template>
                  </tr>
                  <tr>
                    <th>Business Days</th>
                    <template v-for="businessDay in businessDays">
                      <th colspan="2" />
                      <th>
                        <strong>{{ businessDay }}</strong>
                      </th>
                      <th colspan="2" />
                    </template>
                  </tr>
                </thead>
              </template>

              <template v-slot:body="{ items, headers }">
                <tbody>
                  <tr v-for="(item, row) in items" :key="row">
                    <td v-for="(header, col) in headers" :key="col">
                      <div
                        v-if="
                          header.text.includes('Work') ||
                          header.text.includes('Vacation')
                        "
                        contenteditable
                        @input="onInput($event, header.value, item)"
                        @focus="onFocus($event, header.value, item)"
                        @blur="onBlur"
                      >
                        <v-chip>
                          {{ item[header.value] }}
                        </v-chip>
                      </div>
                      <div v-else>{{ item[header.value] }}</div>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "WorkData",
  data: () => ({
    alert: false,
    alertText: "",
    currentValue: "",
    newValue: "",
  }),
  props: {
    Department: {
      type: String,
      required: true,
    },
    Team: {
      type: String,
      required: true,
    },
  },
  computed: {
    months() {
      return this.$store.state.Months;
    },
    headers() {
      return this.$store.state.WorkDetailsHeaders;
    },
    items() {
      return this.$store.state.WorkDetailsItems.filter(
        (elements) => elements.Department == this.Department
      ).filter((e) => e.Team == this.Team);
    },
    businessDays() {
      return this.$store.state.BusinessDays;
    },
  },
  methods: {
    onInput(e, col, item) {
      this.alert = false;
      this.alertText = "";

      let month = col.split(" ")[0];
      let businessDays = this.$store.state.BusinessDaysList[month];

      if (e.target.innerText > businessDays) {
        e.target.innerText = 0;
        this.alert = true;
        this.alertText = "value cannot be greater than " + businessDays;
        return;
      }
      if (e.target.innerText < 0) {
        e.target.innerText = 0;
        this.alert = true;
        this.alertText = "value cannot be negative";
        return;
      }

      this.newValue = Number(e.target.innerText) | 0;
      item[col] = this.newValue;

      this.$store.commit("computeBandwidth", {
        month: month,
        businessDays: businessDays,
        item: item,
        col: col,
        newValue: this.newValue,
        currentValue: this.currentValue,
      });
    },
    onFocus(e, col, item) {
      this.currentValue = item[col];
      this.alert = false;
      this.alertText = "";
      e.target.innerText = e.target.innerText == 0 ? "" : e.target.innerText;
    },
    onBlur(e) {
      this.alert = false;
      this.alertText = "";
      e.target.innerText = Number(e.target.innerText) | 0;
    },
  },
};
</script>

<style lang="scss" scoped></style>
