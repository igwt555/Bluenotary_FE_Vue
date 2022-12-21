<template>
  <q-layout>
    <q-page-container class="container">
      <q-page class="q-pa-lg">
        <div class="flex justify-between q-pt-md items-center">
          <h1>
            Sessions
          </h1>
          <div>
            <router-link v-if="$user.memberType !== 'free' && (!$user.memberTypeProWhenInvited || $user.businessUserAllowedNotaryToInvite)" to="/business/invite">
              <q-btn
                color="primary"
                label="Invite Signer"
              />
            </router-link>
          </div>
        </div>
        <span v-if="freeSessionsLeft || totalSessionsDone" style="font-size: 12px;display:block">{{ freeSessionsLeft }} Free Sessions Remaining. Total {{ totalSessionsDone }} Sessions this month.</span>
        <q-checkbox v-model="showArchievedSessions" size="xs" class="" style="font-size:.7rem;" label="Show Archived Sessions" />
        <template v-if="loading">
          <div class="renderer">
            <img src="/icons/Loading.gif" alt="loading-gif" style="max-width: 100px;" />
          </div>
        </template>
        <div class="row flex flex-center">
          <q-card v-if="!loading && !sessionData.length && !showArchievedSessions" class="welcome-card" flat bordered>
            <q-card-section horizontal>
              <q-card-section class="q-pa-lg">
                <div class="text-overline text-orange-9">Let's get started</div>
                <div class="text-h5 q-mt-sm q-mb-xs">Welcome to BlueNotary!</div>
                <p>The faster, smarter, more secure way to notarization your documents.</p>
                <div class="q-pt-lg">
                  <ul>
                    <li><q-icon name="check_circle" /> Your Invited Sessions List will come down here</li>
                  </ul>
                </div>
              </q-card-section>

              <q-card-section class="col-5 flex flex-center">
                <q-img
                  class="rounded-borders"
                  src="~assets/notary-public-sm.jpg"
                />
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
        <template v-if="sessionData && sessionData.length">
          <div class="row mbroww" style="font-size:.6rem;">
            <div class="text-left q-pb-sm dcol-aerr"> &nbsp;</div>
            <div class="text-left" style="width: 20%">Signer</div>
            <div class="text-left" style="width: 20%">Notary</div>
            <div class="text-left dcol-sttus">Status</div>
            <div class="text-left" style="width: 30%">Meeting Time</div>
          </div>
          <div class="q-table__card sessions-info">
            <div v-for="(item, key) of sessionData" :key="key">
              <div>
                <q-list class="rounded-borders">
                  <q-expansion-item
                    expand-icon-toggle
                    switch-toggle-side
                    class="tbnner"
                  >
                    <template v-slot:header>
                      <div class="text-left mbhide c-link-wrap dcol-fname" style="width: 20%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                        {{ item.signerDocForBusinessSession && item.signerDocForBusinessSession.name }}
                      </div>
                      <div class="text-left mbhide c-link-wrap dcol-fname" style="width: 20%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                        {{ item.notary && item.notary.name }}
                      </div>
                      <div class="text-left dcol-sttus mbhide">
                        <q-badge :color="getStatusColor(item.status)">
                          {{ item.status }}
                        </q-badge>
                      </div>
                      <div class="text-left" style="width: 25%">
                        <q-icon label="" name="today" />
                        <q-tooltip anchor="bottom left" :delay="1500">
                          Scheduled meeting with signer.
                        </q-tooltip>
                        {{ (typeof(item.meetingdate) === 'undefined' || item.meetingdate === "N/A" || item.meetingdate === "") ? "Meeting not scheduled" : formatDateForMeetingtime(item.meetingdate, item) }}
                      </div>
                      <div class="text-right" style="width: 20%">
                        <q-btn v-if="!showArchievedSessions && showArchieveButton(item)" outline color="red" icon="archive" style="margin-left: 10px; float: right" @click="archiveClicked(item.current_session_id)">
                          <q-tooltip>Click here to Archive the session</q-tooltip>
                        </q-btn>
                        <q-btn v-if="showArchievedSessions && showArchieveButton(item)" outline color="blue" icon="unarchive" style="margin-left: 10px; float: right" @click="unarchiveClicked(item.current_session_id)">
                          <q-tooltip>Click here to UnArchive the session</q-tooltip>
                        </q-btn>
                      </div>
                      <div class="text-left dcol-sttus vmob">
                        <q-badge :color="getStatusColor(item.status)">
                          {{ item.status }}
                        </q-badge>
                      </div>
                    </template>
                    <q-card class="session-info-card">
                      <q-card-section>
                        <q-list separator>
                          <q-item>
                            <q-item-section>
                              <q-item-label overline>Session ID</q-item-label>
                              <q-item-label>{{ item.current_session_id.substr(item.current_session_id.length - 5).toUpperCase() }}</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label overline>File Name</q-item-label>
                              <q-item-label>{{ (item.files) ? splittingFileName(item.files && item.files[0] && item.files[0].name): "No file uploaded" }}</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label overline>Notarization Act Type</q-item-label>
                              <q-item-label class="text-capitalize">{{ item.session.notorizationType }}</q-item-label>
                              <q-item-label v-if="item.notary" class="text-capitalize">{{ 'Notary: '+item.notary.name }}</q-item-label>
                              <q-item-label v-if="item.notary" class="text-capitalize">{{ 'Commission Number: '+item.notary.commissionNumber }}</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item v-if="item.additionalSignerIdentyDocs && item.additionalSignerIdentyDocs.length">
                            <q-item-section>
                              <q-item-label overline>Additional Signers</q-item-label>
                              <q-item-label v-for="additionalSigner in item.additionalSignerIdentyDocs" :key="additionalSigner._id" class="text-capitalize">
                                {{ additionalSigner.email }} - Status:
                                <span style="font-weight: bold">
                                  <template v-if="additionalSigner.additionalSignerNextStage === 'photoid_check_stage'">
                                    KBA Successful. Photo ID Check Not Completed
                                  </template>
                                  <template v-else-if="additionalSigner.additionalSignerNextStage === 'meet_notary'">
                                    KBA and Photo ID Check Successful
                                  </template>
                                  <template v-else>
                                    KBA and Photo ID Check Not Completed
                                  </template>
                                </span>
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label overline>Original Document</q-item-label>
                              <q-item-label>
                                <template v-if="item.files && item.files.length">
                                  <a v-for="tempFinalDocument in item.files" :key="tempFinalDocument._id" :href="tempFinalDocument.url" target="_blank" class="blue c-link-wrap">
                                    {{ tempFinalDocument.name }}
                                    <br />
                                  </a>
                                </template>
                                <template v-else>No file uploaded</template>
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label overline>Final Document</q-item-label>
                              <q-item-label>
                                <template v-if="item.finalDocument">
                                  <a v-for="tempFinalDocument in item.finalDocument" :key="tempFinalDocument._id" :href="tempFinalDocument.url" target="_blank" class="blue">
                                    {{ tempFinalDocument.name }}
                                    <br />
                                  </a>
                                </template>
                                <template v-else>Notarization not completed yet</template>
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label overline>Notarization Start Time</q-item-label>
                              <q-item-label>{{ formatDate(item.sessionStartedTime, item.session) }}</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label overline>Notarization End Time</q-item-label>
                              <q-item-label>{{ (item.status === "complete") ? formatDate(item.session.updatedAt, item.session) : 'Notarization not completed yet' }}</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label overline>Type of Credentials Provided</q-item-label>
                              <q-item-label>{{ getKBAType(item) }}</q-item-label>
                            </q-item-section>
                          </q-item>

                          <q-item>
                            <q-item-section>
                              <q-item-label overline>Fee Charged</q-item-label>
                              <q-item-label>
                                <template v-if="item.session.costOfNotarization && item.status === 'complete'">
                                  <div v-for="tempCost,index in item.session.costOfNotarization" :key="index">
                                    <div :key="'tempCostname' + index" class="q-pb-md">
                                      <span class="text-teal">{{ tempCost.name }}</span>
                                      <br />
                                      {{ tempCost.currency }}{{ tempCost.price }}
                                    </div>
                                  </div>
                                  <div class="q-pb-md">
                                    <span class="text-teal">Total</span>
                                    <br />{{ item.session.finalCostOfNotarization }}
                                  </div>
                                  <div v-if="item.session.stripePaymentData && item.session.stripePaymentData[0] && item.session.stripePaymentData[0].receiptUrl" class="q-pb-md">
                                    <span class="text-teal">Payment Receipt</span>
                                    <br /> <a :href="item.session.stripePaymentData[0].receiptUrl" target="_blank">Link</a>
                                  </div>
                                </template>
                                <template v-else>Notarization not completed yet</template>
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label overline>Video Recording</q-item-label>
                              <q-item-label>
                                <a v-if="item.videoData" :href="item.videoData.url" target="_blank" class="blue">
                                  {{ item.videoData.name }}
                                </a>
                                <template v-if="item.session.videoSavingProcessingStage">
                                  <div v-if="item.session.videoSavingProcessingStage !== 'completed'">
                                    Status: {{ item.session.videoSavingProcessingStage }}
                                  </div>
                                  <div v-if="item.session.videoSavingProcessingError">
                                    Error Message: {{ item.session.videoSavingProcessingError }}
                                  </div>
                                </template>
                                <template v-else>
                                  <div>N/A</div>
                                </template>
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label overline>Session Audit Logs</q-item-label>
                              <q-item-label>
                                <a @click="auditTrailClicked(item)">View Audit Logs</a>
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                  <q-separator />
                </q-list>
              </div>
            </div>
          </div>
        </template>
        <div v-if="paginate" class="q-pa-lg flex flex-center">
          <q-pagination
            v-model="current"
            :max="paginate.totalPages"
            :max-pages="6"
            direction-links
            boundary-links
            @click="loadSessionData($user,current)"
          />
        </div>
      </q-page>
    </q-page-container>
    <q-dialog v-model="openAuditLogsModal">
      <q-card style="width: 70%; min-width: 70%; max-width: 70%">
        <q-card-section>
          <div class="text-h6">Session Audit Logs</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <audit-logs-display-component :current-session-audit-logs="currentSessionAuditLogs" :full-session-doc="fullSessionItem" />
        </q-card-section>
        <q-card-actions align="left">
          <q-btn v-close-popup outline label="Close" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { ref } from "@vue/composition-api";
import { $axios } from "boot/axios";
import __ from "lodash";
import DateFormatMixin from "@/mixins/DateFormatMixin";
import VueEventBus from "../../plugins/eventbus.js";
import AuditLogsDisplayComponent from "../../components/AuditLogsDisplayComponent.vue";

// const moment = require("moment");

export default {
  name: "BusinessSessions",
  components: {
    AuditLogsDisplayComponent
  },
  mixins: [DateFormatMixin],
  data() {
    return {
      confirmationSessionId: "",
      confirmationSessionDialog: false,
      confirmationSessionDoc: {},
      freeSessionsLeft: false,
      totalSessionsDone: false,
      showArchievedSessions: false,
      openAuditLogsModal: false,
      currentSessionAuditLogs: [],
      fullSessionItem: {},
      current: 1,
      paginate: [],
    };
  },
  computed: {
  },
  watch: {
    showArchievedSessions: {
      handler() {
        this.loadSessionData(this.$user, this.current);
      }
    }
  },
  async mounted() {
    this.loading = true;
    await this.loadSessionData(this.$user, this.current);
    console.log(this.sessionData);
    VueEventBus.$on("SOCKET_UPDATES", (socketData) => {
      console.log("socketData", JSON.parse(JSON.stringify(socketData)));
      if (typeof socketData.event !== "undefined") {
        if (socketData.event === "sessionActivityChanged") {
          const sessionidChanged = socketData.sessionid;
          __.map(this.sessionData, (localSessionDoc) => {
            if (String(localSessionDoc.session._id) === sessionidChanged) {
              this.loadSessionData([sessionidChanged], this.current);
            }
          });
        }
      }
    });
    VueEventBus.$on("SOCKET_RECONNECTED", () => {
      this.socketRequest("join_user");
    });
    this.socketRequest("join_user");
    this.loading = false;
    try {
      if (window.cameraStream) {
        window.cameraStream.getTracks().forEach((track) => { track.stop(); });
        window.cameraStream = false;
      }
    } catch (error) {
      console.log("error", error);
    }
    try {
      if (window.cameraStreamChecking) {
        window.cameraStreamChecking.getTracks().forEach((track) => { track.stop(); });
        window.cameraStreamChecking = false;
      }
    } catch (error) {
      console.log("error", error);
    }
  },
  beforeDestroy() {
    this.socketRequest("leave_user");
    VueEventBus.$off("SOCKET_UPDATES");
    VueEventBus.$off("SOCKET_RECONNECTED");
  },
  setup(_, context) {
    const {
      root: { $user },
    } = context;
    const loading = ref(false);
    const sessionData = ref([]);
    const deleteSessionItem = async (item) => {
      try {
        const url = "session/delete";
        const response = await $axios.post(
          url,
          { sessionId: item },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("loadSessionData", response.data);
        const newSessionData = await this.loadSessionData(this.$user, this.current);
        console.log("newSessionData = ", newSessionData);
        sessionData.value = newSessionData;
      } catch (error) {
        console.log(error);
      }
    };
    const deleteSession = async (item) => {
      await deleteSessionItem(item.sessionId);
      // const newSessionData = await loadSessionData();
      // console.log("newSessionData = ", newSessionData);
      // this.sessionData = newSessionData;
    };
    const socketRequest = async (eventName) => {
      const dataToSend = {
        user: $user._id
      };
      if (window.currentSocket) {
        window.currentSocket.emit(eventName, dataToSend, (res) => {
          console.log("res", res);
        });
      }
    };
    return {
      loading,
      sessionData,
      deleteSession,
      deleteSessionItem,
      socketRequest
    };
  },
  methods: {
    getKBAStatus(session) {
      let status = "N/A";
      if (session.identityData !== null &&
        (session.identityData.fillAPIResponseDoc && session.identityData.fillAPIResponseDoc !== null) &&
        session.identityData.fillAPIResponseDoc.PlatformResponse.Response !== ""
      ) {
        status = session.identityData.fillAPIResponseDoc.PlatformResponse.Response.WorkflowOutcome.text;
      }
      if (session?.identityData?.cardAPIResponseDoc?.platformresponse?.response?.[0]?.workflowoutcome?.[0]?._) {
        status = session?.identityData?.cardAPIResponseDoc?.platformresponse?.response?.[0]?.workflowoutcome?.[0]?._;
      }
      return status;
    },
    getKBAType(session) {
      let kbaType = "ID + KBA";
      if (session?.session?.typeOfKBA === "foreigners_without_residential") {
        kbaType = "Id + Biometrics";
      }
      if (session?.identityData?.typeOfPhotoId) {
        let photoIdName = "Driver's License";
        const photoIdType = session?.identityData?.typeOfPhotoId;
        if (photoIdType === "passportbook") {
          photoIdName = "Passport Book";
        } else if (photoIdType === "passportcard") {
          photoIdName = "Passport Card";
        }
        kbaType += ` (${photoIdName})`;
      } else {
        kbaType += " (Driver's License)";
      }
      if (session?.session?.skipCustomerKBACheck) {
        kbaType = "Skipped";
      }
      return kbaType;
    },
    splittingFileName(fileName) {
      if (!fileName) {
        return "";
      }
      if (fileName.length < 20) {
        return fileName;
      }
      fileName = fileName.split(/[.]+/);
      return ` ${fileName[0].slice(0, 10)}...${fileName[0].substr(fileName[0].length - 10)}.${fileName[fileName.length - 1]}`;
    },
    getStatusColor(status) {
      let statusColor = "primary";
      switch (status) {
        case "unsigned":
          statusColor = "primary";
          break;
        case "complete":
          statusColor = "teal";
          break;
        case "expired":
          statusColor = "gray";
          break;
        case "ready to sign":
          statusColor = "green";
          break;
        case "ready to pick up":
          statusColor = "orange";
          break;
        default:
          statusColor;
      }
      return statusColor;
    },
    socketRequest(eventName) {
      const dataToSend = {
        user: this.$user._id
      };
      if (window.currentSocket) {
        window.currentSocket.emit(eventName, dataToSend, (res) => {
          console.log("res", res);
        });
      }
    },
    async loadSessionData(user, current) {
      const baseUrl = "session/load/sessiondata/";
      const url = baseUrl + current;
      const response = await $axios.post(
        url,
        { user, businessSessions: true, showArchievedSessions: this.showArchievedSessions },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      this.sessionData = (response.data && response.data.sessionData) || [];
      this.paginate = response.data.paginate;
      if (response.data && (response.data.freeSessionsLeft || response.data.totalSessionsDone)) {
        this.freeSessionsLeft = response.data.freeSessionsLeft;
        this.totalSessionsDone = response.data.totalSessionsDone;
      }
      console.log("this.sessionData", this.sessionData);
      __.map(this.sessionData, (sessionDoc) => {
        if (sessionDoc.session && sessionDoc.session.paid === false) {
          console.log(sessionDoc);
          this.confirmationSessionId = sessionDoc.session._id;
          this.confirmationSessionDoc = sessionDoc;
          this.confirmationSessionDialog = false;
          this.paymentFailure = true;
          this.paymentDoneDialog = true;
          this.cannotStartNewSession = true;
        }
      });
    },
    async auditTrailClicked(sessionItem) {
      const url = `session/getAuditTrail/${sessionItem.current_session_id}`;
      const response = await $axios.get(
        url
      );
      console.log("audittrail", response.data);
      this.currentSessionAuditLogs = (response.data && response.data.auditTrail) || [];
      this.fullSessionItem = sessionItem;
      this.openAuditLogsModal = true;
    },
    archiveClicked(sessionid) {
      console.log(sessionid);
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure you want to archieve this Session?",
        cancel: true,
        persistent: true
      }).onOk(async () => {
        console.log("done");
        const url = "session/archieve";
        const response = await $axios.post(
          url,
          { sessionId: sessionid }
        );
        console.log("archieve", response.data);
        if (response.data && response.data.success) {
          this.$q.notify({
            color: "primary",
            position: "bottom",
            message: "Session Archieved Successfully.",
          });
          this.sessionData = __.filter(this.sessionData, (tempSessionDoc) => tempSessionDoc.current_session_id !== sessionid);
        } else {
          this.$q.notify({
            color: "red",
            position: "bottom",
            message: "Arhieve Failed. Please try again later.",
          });
        }
      });
    },
    unarchiveClicked(sessionid) {
      console.log(sessionid);
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure you want to unarchieve this Session?",
        cancel: true,
        persistent: true
      }).onOk(async () => {
        console.log("done");
        const url = "session/unarchieve";
        const response = await $axios.post(
          url,
          { sessionId: sessionid }
        );
        console.log("unarchieve", response.data);
        if (response.data && response.data.success) {
          this.$q.notify({
            color: "primary",
            position: "bottom",
            message: "Session Unarchieved Successfully.",
          });
          this.sessionData = __.filter(this.sessionData, (tempSessionDoc) => tempSessionDoc.current_session_id !== sessionid);
        } else {
          this.$q.notify({
            color: "red",
            position: "bottom",
            message: "Unarhieve Failed. Please try again later.",
          });
        }
      });
    },
    showArchieveButton(sessionDoc) {
      let showButton = true;
      if (sessionDoc.currentStage === "meet_notary_stage") {
        showButton = false;
      }
      if (sessionDoc.status === "complete") {
        showButton = false;
      }
      return showButton;
    },
  },
};
</script>
<style lang="sass" scoped>
</style>
