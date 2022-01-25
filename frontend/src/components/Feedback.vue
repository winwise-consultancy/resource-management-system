<template>
  <v-container fill-height fluid align-items="center">
    <v-layout col wrap>
      <v-row align="center" justify="center">
        <v-card>
          <v-card-title
            >Feeback
            <v-spacer />
            <v-card-actions>
              <v-btn
                class="mr-4"
                type="submit"
                color="primary"
                @click="dialog = true"
                >+
              </v-btn>
            </v-card-actions>
          </v-card-title>
          <v-card-text>
            <div v-for="(f, index) in feedbackList" :key="index">
              <v-row>
                <v-col>
                  <v-card>
                    <v-card-title>{{ f.Summary }}</v-card-title>
                    <v-card-text
                      >{{ f.Description }}
                      <div v-if="f.Name || f.Email">
                        <small>
                          From {{ " : " + f.Name }} {{ " : " + f.Email }}
                        </small>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-row>
      <v-row justify="center">
        <v-dialog
          v-model="dialog"
          @keydown.esc="dialog = false"
          @click:outside="dialog = false"
          persistent
          max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Request Feature or Report issue</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-col>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="Summary"
                        clearable
                        clear-icon="mdi-close-circle"
                        label="*Summary"
                        value=""
                      ></v-text-field
                    ></v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-textarea
                        v-model="Description"
                        clearable
                        clear-icon="mdi-close-circle"
                        label="#Description"
                        value=""
                      ></v-textarea
                    ></v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="Name"
                        label="#Name"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="Email"
                        label="#Email"
                        required
                      ></v-text-field
                    ></v-col>
                  </v-row>
                </v-col>
              </v-container>
              <small>
                #indicates optional field
                <br />
                *indicates required field
              </small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="mr-4" @click="dialog = false"> Close </v-btn>
              <v-btn
                class="mr-4"
                type="submit"
                color="primary"
                @click="onSubmit"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Feedback",
  data: () => ({
    Name: "",
    Email: "",
    Summary: "",
    Description: "",
    dialog: false,
  }),
  computed: {
    feedbackList() {
      return this.$store.state.FeedbackList;
    },
  },
  methods: {
    onSubmit() {
      this.dialog = false;
      if (!this.Summary) {
        return;
      }
      let feeback = {};
      feeback.Summary = this.Summary;
      feeback.Description = this.Description;
      feeback.Name = this.Name;
      feeback.Email = this.Email;
      this.$store.state.FeedbackList.push(feeback);

      this.Summary = "";
      this.Description = "";
      this.Name = "";
      this.Email = "";

      this.storeFeedback();
    },
    storeFeedback() {
      if (this.$store.state.FeedbackList.length === 0) {
        return;
      }
      let feedbackFile = "../../storage/data/FeedbackList.json";
      let data = [
        { file: feedbackFile, content: this.$store.state.FeedbackList },
      ];
      this.$store.dispatch("write", data);
    },
  },
};
</script>
