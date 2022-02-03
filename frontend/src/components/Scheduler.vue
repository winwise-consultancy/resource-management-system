<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Today
            </v-btn>
            <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="$refs.calendar.prev()"
            >
              <v-icon small> mdi-chevron-left </v-icon>
            </v-btn>
            <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="$refs.calendar.next()"
            >
              <v-icon small> mdi-chevron-right </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn-toggle
              v-model="toggle_exclusive"
              dense
              outlined
              class="mr-4"
              color="primary"
              group
              tile
              mandatory
            >
              <v-btn @click="type = 'day'"> Day </v-btn>
              <v-btn @click="type = 'week'"> Week </v-btn>
              <v-btn @click="type = 'month'"> Month </v-btn>
            </v-btn-toggle>
            <v-btn text @click="toggleWeekend">{{
              includeWeekends ? " - weekend" : " + weekend"
            }}</v-btn>
          </v-toolbar>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-card height="100%">
          <v-sheet class="pa-2" color="primary">
            <v-sheet class="pa-4">
              <v-row>
                <v-btn-toggle class="pa-2" dense borderless>
                  <v-btn @click="selectedOpen = false">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn @click="editEvent">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </v-btn-toggle>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  label="Search"
                  flat
                  hide-details
                  clearable
                  clear-icon="mdi-close-circle-outline"
                ></v-text-field>
              </v-row>
            </v-sheet>
          </v-sheet>
          <v-card-text>
            <v-treeview
              :items="getTreeData"
              :search="search"
              @input="selected"
              v-model="tree"
              color="primary"
              selected-color="indigo"
              return-object
              open-on-click
              transition
              selectable
              selection-type="independent"
              rounded
              hoverable
              activatable
              on-icon="mdi-bookmark"
              off-icon="mdi-bookmark-outline"
              expand-icon="mdi-chevron-down"
              indeterminate-icon="mdi-bookmark-minus"
            >
            </v-treeview>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="value"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            :weekdays="weekdays"
            :show-week="true"
            @click:date="viewDay"
            @click:event="showEvent"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card class="flexcard" height="100%">
              <v-system-bar color="primary" dark class="mx-0">
                <v-btn-toggle
                  background-color="primary"
                  dense
                  dark
                  borderless
                  x-small
                >
                  <v-btn @click="selectedOpen = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-btn @click="editEvent">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn @click="deleteEvent">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-system-bar>

              <v-toolbar :color="selectedEvent.color" dark>
                <v-toolbar-title v-html="selectedEvent.name"> </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field label="Start :">{{
                    selectedEvent.start
                  }}</v-text-field>
                </v-col>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Scheduler",
  data: () => ({
    value: "",
    type: "month",
    weekdays: [1, 2, 3, 4, 5],
    includeWeekends: false,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
    names: [
      "Public Holiday",
      "Business Days",
      "Vacations",
      "Project Work",
      "Departmental Internal Work",
    ],
    menuItems: [
      { icon: "mdi-close" },
      { icon: "mdi-pencil" },
      { icon: "mdi-delete" },
    ],
    ///
    toggle_exclusive: 2,
    ///
    tree: [],
    selectedEmployee: null,
    search: null,
  }),
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    setToday() {
      this.value = "";
    },
    viewDay({ date }) {
      this.value = date;
    },
    getEventColor(event) {
      return event.color;
    },
    toggleWeekend() {
      this.includeWeekends = !this.includeWeekends;
      this.includeWeekends
        ? (this.weekdays = [1, 2, 3, 4, 5, 6, 0])
        : (this.weekdays = [1, 2, 3, 4, 5]);
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    editEvent(event) {
      console.log(event);
    },
    deleteEvent(event) {
      console.log(event);
    },
    selected(ids) {
      if (!ids.length || !this.tree) return;

      this.selectedEmployee = this.tree.at(-1);
      this.tree = [this.selectedEmployee];
      this.events = this.selectedEmployee.events
        ? this.selectedEmployee.events
        : [];
    },
  },

  computed: {
    ////
    getTreeData() {
      return this.$store.state.TreeData;
    },
  },
};
</script>
