<template>
  <div>
    <div v-if="!auditLogsData.length">No Audit Logs Found</div>
    <q-table v-else
             class="my-sticky-header-table"
             :data="auditLogsData"
             :columns="auditLogsHeader"
             row-key="name"
             hide-bottom
             :table-style="{ 'font-size': '20px' }"
             :rows-per-page-options="[0]"
    >
      <template v-slot:top-right>
        <q-btn color="primary" label="Export as CSV" @click="exportTable" />
      </template>
    </q-table>
  </div>
</template>

<script>

import _ from "lodash";
// import moment from "moment";
import DateFormatMixin from "@/mixins/DateFormatMixin";
import { exportFile } from "quasar";

function wrapCsvValue (val) {
  let formatted = val;

  formatted = formatted === undefined || formatted === null ?
    ""
    : String(formatted);

  formatted = formatted.split("\"").join("\"\"");
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

const AUDIT_TRAIL_ACTION_MAP = {
  join_session: "Session Joined",
  kba_answered: "KBA Answered",
  kba_failed: "KBA Failed",
  kba_first_set_failed: "KBA First Set Failed",
  kba_started: "KBA Started",
  kba_succeeded: "KBA Succeeded",
  leave_session: "Session Left",
  session_completed: "Session Completed",
  session_terminated: "Session Terminated",
  video_capture_started: "Video Capture Started",
  notary_invited: "Notary Invited Signer For Session",
  skip_kba_consent_for_customer: "Skip KBA Consent Given by Notary",
  personal_details_filled: "Personal Details Filled",
  photo_id_failed: "PhotoId Failed",
  photo_id_passed: "PhotoId Passed",
  biometrics_passed: "Biometrics Passed"
};

export default {
  name: "AuditLogsDisplayComponent",
  components: {},
  mixins: [DateFormatMixin],
  props: {
    currentSessionAuditLogs: {
      type: Array,
      default: () => {}
    },
    fullSessionDoc: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      auditLogsHeader: [
        {
          name: "eventName", label: "Event Name", field: "eventName", headerStyle: "font-size: 17px", style: "font-size: 17px"
        },
        {
          name: "userName", label: "User Name", field: "userName", headerStyle: "font-size: 17px", style: "font-size: 17px"
        },
        {
          name: "userType", label: "User Type", field: "userType", headerStyle: "font-size: 17px", style: "font-size: 17px"
        },
        {
          name: "eventAt", label: "Event At", field: "eventAt", headerStyle: "font-size: 17px", style: "font-size: 17px"
        }
      ],
      auditLogsData: []
    };
  },

  computed: {
  },

  watch: {
  },

  mounted() {
    _.map(this.currentSessionAuditLogs, (auditLog) => {
      let userType = "";
      if (this.fullSessionDoc && this.fullSessionDoc.session && this.fullSessionDoc.session.notaryUserId === auditLog.userId) {
        userType = "Notary";
      } else if (this.fullSessionDoc && this.fullSessionDoc.session && this.fullSessionDoc.session.userId === auditLog.userId) {
        userType = "Primary Signer";
      } else if (this.fullSessionDoc && this.fullSessionDoc.additionalSignerIdentyDocs) {
          let currentSignerNumber = 1;
          _.map(this.fullSessionDoc.additionalSignerIdentyDocs, (additionalSignerDoc) => {
            if (additionalSignerDoc && additionalSignerDoc.userId === auditLog.userId) {
              userType = `Additional Signer #${currentSignerNumber}`;
            }
            currentSignerNumber += 1;
          });
          if (!userType) {
            let currentSignerNumberSecond = 1;
            _.map((this.fullSessionDoc.session && this.fullSessionDoc.session.multiSignerList) || [], (tempSignerDoc) => {
              if (tempSignerDoc && auditLog.userDoc && tempSignerDoc.email === auditLog.userDoc.email) {
                userType = `Additional Signer #${currentSignerNumberSecond}`;
              }
              currentSignerNumberSecond += 1;
            });
          }
        }
      if (!userType) {
        console.log("NOT FOUND!! HELP");
        console.log(auditLog);
      }
      console.log("audit");
      const finalObject = {
        eventName: AUDIT_TRAIL_ACTION_MAP[auditLog.actionType],
        userName: auditLog.userDoc && auditLog.userDoc.name,
        userType,
        eventAt: this.formatDateWithUTC(auditLog.createdAt, this.fullSessionDoc.session)
      };
      this.auditLogsData.push(finalObject);
    });
  },
  created() {
  },

  methods: {
    exportTable () {
      // naive encoding to csv format
      const content = [this.auditLogsHeader.map((col) => wrapCsvValue(col.label))].concat(
        this.auditLogsData.map((row) => this.auditLogsHeader.map((col) => wrapCsvValue(
          typeof col.field === "function" ?
            col.field(row)
            : row[col.field === undefined ? col.name : col.field],
          col.format
        )).join(","))
      ).join("\r\n");

      const status = exportFile(
        `${this.fullSessionDoc.session._id.substr(this.fullSessionDoc.session._id.length - 5).toUpperCase()}_audit_logs.csv`,
        content,
        "text/csv"
      );

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        });
      }
    },
  }
};

</script>
