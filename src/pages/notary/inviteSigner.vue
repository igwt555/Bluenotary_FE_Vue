<template>
  <q-layout>
    <q-page-container class="q-pa-xl">
      <q-page class="container">
        <div class="row flex">
          <div class="col col-sm-8 col-md-6 offset-md-1">
            <h1>
              Invite A Signer
            </h1>
            <p class="q-my-md">We'll create a new session for you and send an invitation to the signer via email with instructions about how to get started with the process along with your scheduled date & time for the live session meeting. <strong>The invitee will be assigned to you automatically.</strong></p>
            <q-card class="q-pa-sm">
              <q-card-section>
                <q-form class="">
                  <h3 class="q-pb-sm">
                    Signer Details
                  </h3>
                  <q-input
                    v-model="$v.model.signerName.$model"
                    dense
                    filled
                    type="text"
                    label="Signer Name"
                    :error-message="errorMessage($v.model.signerName, 'Name')"
                    :error="!!errorMessage($v.model.signerName)"
                  >
                    <template v-slot:prepend>
                      <q-icon name="account_box" />
                    </template>
                  </q-input>
                  <q-input
                    v-model="$v.model.signerEmail.$model"
                    dense
                    filled
                    type="email"
                    label="Signer Email"
                    :error-message="errorMessage($v.model.signerEmail, 'Email')"
                    :error="!!errorMessage($v.model.signerEmail)"
                  >
                    <template v-slot:prepend>
                      <q-icon name="email" />
                    </template>
                  </q-input>
                  <div>
                    <div class="full-width">
                      <q-checkbox v-model="multiSignerFlag" label="Add Multiple Signers to this Session" :disable="!enableAdditionalSigners" />
                      <q-icon v-if="!enableAdditionalSigners" name="info" class="q-ml-sm" style="cursor: pointer;" @click="showUpgradePopup">
                        <q-tooltip>
                          Pro Hybrid plan feature
                        </q-tooltip>
                      </q-icon>
                    </div>
                    <div class="q-mx-sm">
                      <small><a href="https://bluenotary.freshdesk.com/en/support/solutions/articles/72000551402-how-does-multi-signer-session-work-" target="_blank"><u>How does multi-signer session work?</u></a></small>
                    </div>
                  </div>
                  <div class="col-12">
                    <div v-if="multiSignerFlag" class="flex column no-margin">
                      <div v-for="signerItem in multiSignerList" :key="signerItem.id" class="row" style="margin-top: 8px;">
                        <div class="col-6">
                          <q-input v-model="signerItem.email" dense filled label="Secondary Signer Email" type="email" />
                        </div>
                        <div class="col-2">
                          <q-btn flat outline color="primary" icon="clear" style="font-size: 17px" @click="removeSignerEmail(signerItem.id)" />
                        </div>
                      </div>
                      <q-btn icon="add" outline class="q-mt-sm" round @click="addMoreSignerButton" />
                    </div>
                  </div>
                  <div class="q-py-md">
                    <h3>
                      Session Type
                    </h3>
                    <div class="">
                      <div class="col" style="margin-top: 8px">
                        <q-select
                          v-model="sessionType"
                          filled
                          dense
                          :options="allSessionTypes"
                          label="Select Session Type"
                          icon="assignment"
                          input-debounce="0"
                          :options-dense="true"
                        >
                          <template v-slot:prepend>
                            <q-icon name="assignment" />
                          </template>
                        </q-select>
                      </div>
                    </div>
                  </div>
                  <div v-if="$user.role === 'customer' && ($user.memberType === 'business' || $user.memberType === 'agent')" class="q-py-md">
                    <h3>
                      Notary Selection
                    </h3>
                    <div class="">
                      <div class="col" style="margin-top: 8px">
                        <q-select
                          v-model="selectedNotary"
                          filled
                          dense
                          :options="allSelectableNotaries"
                          label="Select Notary for the Session"
                          icon="assignment"
                          input-debounce="0"
                          :options-dense="true"
                        >
                          <template v-slot:prepend>
                            <q-icon name="person" />
                          </template>
                        </q-select>
                      </div>
                    </div>
                  </div>
                  <div v-if="$user.role !== 'customer'" class="q-py-md">
                    <h3>
                      Billing Preference
                    </h3>
                    <div class="full-width">
                      <q-checkbox v-model="sessionChargeOnBusinessUser" label="Invoice the client outside of BlueNotary" :disable="!enableSessionChargeOnBusinessUser" />
                      <q-icon v-if="!enableSessionChargeOnBusinessUser" name="info" class="q-ml-sm" style="cursor: pointer;" @click="showUpgradePopup">
                        <q-tooltip>
                          Pro Hybrid plan feature
                        </q-tooltip>
                      </q-icon>
                    </div>
                    <div class="q-mx-sm"><small><u><a target="_blank" href="https://bluenotary.freshdesk.com/support/solutions/articles/72000561381-invoicing-the-client-outside-of-bluenotary">How does this work?</a></u></small></div>
                  </div>
                  <div v-if="!($user.role === 'customer' && $user.memberType === 'pro')">
                    <div class="full-width">
                      <q-checkbox v-model="skipCustomerKBACheck" label="Skip Signer KBA+ID" />
                    </div>
                  </div>
                  <div class="q-py-md">
                    <h3>
                      Meeting Date & Time
                    </h3>
                    <div class="">
                      <div class="col">
                        <q-input
                          v-model="model.meetingdate"
                          dense
                          filled
                          class="q-py-sm"
                          type="text"
                          label="Meeting Date & Time"
                          @click="notarizationDateTimeInputFieldClicked"
                        >
                          <template v-slot:prepend>
                            <q-icon name="event" />
                          </template>
                        </q-input>
                      </div>
                      <div class="col">
                        <q-select
                          v-model="meetingTimeZone"
                          filled
                          dense
                          :options="selectedTimezone"
                          label="Select Timezone"
                          use-input
                          icon="watch_later"
                          input-debounce="0"
                          :options-dense="true"
                          @filter="timezoneFilterFn"
                        >
                          <template v-slot:prepend>
                            <q-icon name="watch_later" />
                          </template>
                        </q-select>
                      </div>
                    </div>
                  </div>
                  <!-- <div v-if="$user.memberType !== 'pro'">
                    <h3 class="q-pb-sm upgradebrn" style="display:inline-block;">To use pre-tagged document templates </h3>
                    <q-btn
                        class="browse-btn"
                        label="upgrade to pro"
                        color="blue"
                        @click="showUpgradePopup"
                      />
                  </div> -->
                  <div v-if="$user.memberType === 'free'" class="ptdt">
                    <upgrade-account-popup-component :open-acc-pro-model="openUpgradePopup" />
                    <h3 class="q-pt-md q-pb-sm">
                      Select Pre-Tagged Document Template
                    </h3>
                    <q-select
                      dense
                      filled
                      clearable
                      label="Document Template"
                      style="margin-bottom:15px"
                      @click="showUpgradePopup"
                    >
                      <template v-slot:prepend>
                        <q-icon name="description" />
                      </template>
                    </q-select>
                    <div v-if="!selectedTemplate" class="horizontalLine" style="padding-top: 15px"><span>OR</span></div>
                  </div>
                  <div v-if="$user.memberType !== 'free'" class="q-py-lg" style="padding-bottom: 0px">
                    <h3 class="q-pb-sm">
                      Select Pre-Tagged Document Template
                    </h3>
                    <q-select
                      v-model="selectedTemplate"
                      dense
                      filled
                      clearable
                      :options="templates"
                      label="Document Template"
                      style="margin-bottom:15px;"
                    />
                    <div v-if="!selectedTemplate" class="horizontalLine" style="padding-top: 15px"><span>OR</span></div>
                  </div>
                  <div v-if="!selectedTemplate" class="q-py-lg">
                    <h3 class="">
                      Upload Document
                    </h3>
                    <div class="q-py-md">
                      <small>Upload the PDF document (Max 25MB) here if you have already received it from the client. Otherwise, leave this blank.</small>
                    </div>
                    <div class="q-py-md">
                      <q-btn
                        class="browse-btn q-pa-sm full-width"
                        label="Upload client documents"
                        outline
                        @click="$refs.fileinputDocument.$el.click()"
                      />
                      <div v-if="$refs.fileinputDocument !== undefined && $refs.fileinputDocument.selectedString" class="q-pa-lg">
                        <div v-for="localDocument in notaryDocuments" :key="localDocument.name">
                          <q-icon name="check_circle" color="green" style="font-size:2rem;padding:10px;" />
                          <u>{{ localDocument.name }}</u>
                          <q-btn flat icon="clear" @click.stop.prevent="removeDocument(localDocument)" />
                        </div>
                      </div>
                      <q-file
                        v-show="false"
                        ref="fileinputDocument"
                        v-model="notaryDocument"
                        standout
                        multiple
                        max-file-size="25000000"
                        color="primary"
                        label="Add a document"
                        accept=".pdf"
                        @rejected="onRejected"
                      />
                    </div>
                  </div>
                  <q-btn
                    size="md"
                    color="blue"
                    class="text-white"
                    type="button"
                    label="Send Invite"
                    :loading="isSubmitting"
                    :disable="isSubmitting"
                    @click="sendInviteToSigner"
                  />
                </q-form>
              </q-card-section>
            </q-card>
          </div>
          <div class="col col-md-4 q-pl-xl q-pt-xl mbhide">
            <h3 class="text-center q-pb-sm">Sample Preview of Email</h3>
            <img src="https://bluenotary.us/assets/img/invite-iphone-preview.png" />
          </div>
        </div>
      </q-page>
    </q-page-container>
    <q-dialog v-model="openDateTimePickerModal">
      <q-card style="min-width: 650px">
        <q-card-section>
          <div class="text-h6">Select Notarization Date and Time</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-py-md row justify-between">
            <q-date
              v-model="model.meetingdate"
              :options="optionsFn"
              mask="YYYY-MM-DD hh:mm A"
              color="primary"
            />
            <div style="margin-left:12px">
              <q-time
                v-model="model.meetingdate"
                mask="YYYY-MM-DD hh:mm A"
                color="primary"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup outline label="OK" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Payment Info -->
    <q-dialog v-model="showPaymentInfoModal" persistent>
      <q-card style="min-width: 90%; min-height: 80%">
        <q-card-section>
          <h5>
            Add Credit Card Details
            <q-btn round label="x" style="float: right" @click="closePaymentInfoModal" />
          </h5>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="columns is-multiline" style="margin-top: 6px">
            <payment-info :called-from-invite-signer-page="true" :payment-details-captured="paymentDetailsCaptured" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal Payment Info -->
    <!-- <q-dialog v-model="skipCustomerKBAModal" persistent>
      <q-card>
        <q-card-section>
          <h5>
            Skip Customer KBA
          </h5>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="columns is-multiline" style="margin: 8px">
            <div>If you personally know the customer, you have the option to skip the KBA flow for customer, so session can be done quickly.</div>
            <div style="margin-top: 12px;">Please give consent for Session without KBA below</div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Give Consent" color="primary" @click="kBAConsentGiven(true)" />
          <q-btn v-close-popup flat label="Cancel" color="red" @click="kBAConsentGiven(false)" />
        </q-card-actions>
      </q-card>
    </q-dialog> -->

    <!-- encryption files modal -->
    <q-dialog v-model="openEncryptionFilesModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">1 or more of your PDFs is locked.</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div
            v-for="encryptionFile in encryptionFiles"
            :key="encryptionFile.name"
          >
            <u>{{ encryptionFile.name }}</u>
          </div>
          <p class="q-mt-md">
            <a
              href="https://bluenotary.freshdesk.com/support/solutions/articles/72000564604-convert-encrypted-pdf"
              target="_blank"
            >
              How to unlock your PDF for use on BlueNotary
            </a>
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup outline label="OK" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import VuelidateHelperMixin from "@/mixins/VuelidateHelperMixin";
import { reactive } from "@vue/composition-api";
import { $axios } from "boot/axios";
import { date } from "quasar";
import moment from "moment";
import __ from "lodash";
import $ from "jquery";
import UpgradeAccountPopupComponent from "./upgradeAccount.vue";
import PaymentInfo from "../customer/paymentInfo.vue";

export const emailFormatter = (value) => {
  if (!value) return value;
  return value.toLowerCase();
};

export default {
  name: "InviteSigner",
  components: { UpgradeAccountPopupComponent, PaymentInfo },
  mixins: [VuelidateHelperMixin],
  data() {
    return {
      openUpgradePopup: false,
      notaryDocument: [],
      notaryDocuments: [],
      openDateTimePickerModal: false,
      window,
      timezoneValues: [],
      selectedTimezone: [],
      meetingTimeZone: "",
      templates: [],
      selectedTemplate: null,
      skipCustomerKBACheck: false,
      skipCustomerKBAModal: false,
      multiSignerFlag: false,
      multiSignerList: [
        {
          id: "input0",
          email: ""
        }
      ],
      enableAdditionalSigners: false,
      sessionType: {
        value: "gnw",
        label: "GNW"
      },
      allSessionTypes: [
        {
          value: "gnw",
          label: "GNW"
        }
      ],
      allSelectableNotaries: [],
      selectedNotary: "",
      loanSigningPermitted: false,
      sessionChargeOnBusinessUser: false,
      enableSessionChargeOnBusinessUser: false,
      showPaymentInfoModal: false,
      stripeIdentityDetails: false,
      encryptionFiles: [],
      openEncryptionFilesModal: false,
    };
  },

  watch: {
    notaryDocument: {
      handler(value) {
        if (value.length > 0) {
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < value.length; i++) {
            if (this.$user.memberType === "pro") {
              const reader = new FileReader();
              reader.readAsArrayBuffer(value[i]);
              reader.onload = () => {
                const files = new Blob([reader.result], { type: "application/pdf" });
                files.text().then(async (x) => {
                  const fileIsEncrypted = x.substring(x.lastIndexOf("<<"), x.lastIndexOf(">>")).includes("/Encrypt");
                  if (!fileIsEncrypted) {
                    this.notaryDocuments.push(value[i]);
                  } else {
                    this.encryptionFiles.push(value[i]);
                  }
                  if (this.encryptionFiles.length > 0) {
                    this.openEncryptionFilesModal = true;
                  }
                });
              };
            } else {
              const reader = new FileReader();
              reader.readAsArrayBuffer(value[i]);
              reader.onload = () => {
                const files = new Blob([reader.result], { type: "application/pdf" });
                files.text().then(async (x) => {
                  const fileIsEncrypted = x.substring(x.lastIndexOf("<<"), x.lastIndexOf(">>")).includes("/Encrypt");
                  if (!fileIsEncrypted) {
                    this.notaryDocuments = [value[i]];
                  } else {
                    this.encryptionFiles.push(value[i]);
                  }
                  if (this.encryptionFiles.length > 0) {
                    this.openEncryptionFilesModal = true;
                  }
                });
              };
            }
          }
        }
      }
    },
    sessionType: {
      handler(value) {
        if (value && value.value === "loan_signing" && !this.loanSigningPermitted) {
          this.sessionType = this.allSessionTypes[0];
          this.showUpgradePopup();
        }
      }
    },
    sessionChargeOnBusinessUser: {
      handler(value) {
        if (value) {
          if (!((this.$user.role === "customer" && (this.$user.memberType === "business" || this.$user.memberType === "agent")) || (this.$user.role === "notary" && this.$user.memberType === "pro"))) {
            this.sessionChargeOnBusinessUser = false;
            this.showUpgradePopup();
          } else {
            this.showPaymentInfoModal = true;
          }
        } else {
          this.showPaymentInfoModal = false;
        }
      }
    },
    skipCustomerKBACheck: {
      handler(value) {
        if (value) {
          this.skipCustomerKBAModal = true;
        }
      }
    }
  },
  async mounted() {
    if (this.$user.memberType !== "free") {
      await this.loadTemplates();
      this.enableAdditionalSigners = true;
    }
    if (this.$user.memberType !== "free") {
      this.enableSessionChargeOnBusinessUser = true;
    }
    let showLoanSigningOption = false;
    if (this.$user.role === "notary") {
      showLoanSigningOption = true;
      if (this.$user.memberType !== "free") {
        this.loanSigningPermitted = true;
      }
    } else if (this.$user.role === "customer") {
      if (this.$user.memberType === "agent") {
        this.loanSigningPermitted = true;
        showLoanSigningOption = true;
        this.allSessionTypes = [];
      }
    }
    if (showLoanSigningOption) {
      if (!this.allSessionTypes.length) {
        this.sessionType = {
          value: "loan_signing",
          label: "Loan Signing"
        };
      }
      this.allSessionTypes.push({
        value: "loan_signing",
        label: "Loan Signing"
      });
    }
    if (this.$user.role === "customer" && (this.$user.memberType === "business" || this.$user.memberType === "agent")) {
      this.fetchAllSelectableNotaries();
    }
    this.timezoneValues = window.allTimeZones;
    const allowedTimezones = ["(GMT-10:00) Hawaii", "(GMT-08:00) Pacific", "(GMT-07:00) Mountain", "(GMT-06:00) Central", "(GMT-05:00) Eastern"];
    this.selectedTimezone = this.timezoneValues.filter((timezone) => allowedTimezones.indexOf(timezone.label) >= 0);
    console.log(this.selectedTimezone);
    const timezone = String(((new Date().getTimezoneOffset()) / 60) * -1);
    __.map(this.selectedTimezone, (tempValue) => {
      if (tempValue.value === timezone) {
        this.meetingTimeZone = tempValue;
      }
    });
    $(document).on("click", ".ptdt", () => {
      this.showUpgradePopup();
    });
  },
  setup() {
    const model = reactive({
      signerName: "",
      signerEmail: "",
      meetingdate: "",
      notaryDocument: "",
    });
    return {
      model,
      isSubmitting: false,
      optionsFn (selectedDate) {
        return selectedDate >= date.formatDate(Date.now(), "YYYY/MM/DD");
      },
    };
  },
  validations: {
    model: {
      signerName: {
        required,
      },
      signerEmail: {
        required,
        email: (val) => email(emailFormatter(val)),
      },
      meetingdate: {
      },
    },
  },
  methods: {
    notarizationDateTimeInputFieldClicked() {
      this.openDateTimePickerModal = true;
    },
    showUpgradePopup() {
      this.openUpgradePopup = false;
      setTimeout(() => {
        this.openUpgradePopup = true;
      }, 200);
    },
    async loadTemplates() {
      const url = "notary/templateOptions";
      const dataToSend = {
        notary_user_id: this.$user._id,
      };
      const response = await $axios.post(url, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const templateDatas = response.data;
      this.templates = __.map(templateDatas, (tempDoc) => {
        tempDoc.label = tempDoc.name;
        tempDoc.value = tempDoc._id;
        return tempDoc;
      });
    },
    async sendInviteToSigner() {
      this.isSubmitting = true;
      this.$v.model.$touch();
      if (!this.$v.model.$invalid) {
        try {
          if ((this.meetingTimeZone.value === "" || this.meetingTimeZone.value === undefined) || (this.model.meetingdate === "")) {
            this.isSubmitting = false;
            this.$q.notify({
                type: "negative",
                message: "Please select meeting date & time and timezone"
              });
            return;
          }
          if (this.model.meetingdate && (this.meetingTimeZone.value === "" || this.meetingTimeZone.value === undefined)) {
            this.isSubmitting = false;
            this.$q.notify({
                type: "negative",
                message: "Please select Meeting timezone"
              });
            return;
          }
          if (this.$user.role === "customer" && (this.$user.memberType === "business" || this.$user.memberType === "agent")) {
            if (!this.selectedNotary) {
              this.isSubmitting = false;
              this.$q.notify({
                  type: "negative",
                  message: "Please select a Notary"
                });
              return;
            }
          }
          if (this.model.meetingdate && (this.meetingTimeZone.value !== "" || this.meetingTimeZone.value !== undefined)) {
            const currentTimeZoneOffset = parseFloat(String((new Date()).getTimezoneOffset() / 60)) * -1;
            const currentMeetingTimeZone = parseFloat(this.meetingTimeZone.value);
            const finalOffset = (currentMeetingTimeZone - currentTimeZoneOffset) * 60;
            const meetingDateTimeObj = moment(this.model.meetingdate, "YYYY-MM-DD hh:mm A").utcOffset(finalOffset, true);
            // console.log(this.model.meetingdate, this.meetingTimeZone.value, moment() - meetingDateTimeObj);
            console.log(this.model.meetingdate, this.meetingTimeZone.value, meetingDateTimeObj, moment().add(currentTimeZoneOffset * 60, "minutes") - meetingDateTimeObj);
            if (moment().add(currentTimeZoneOffset * 60, "minutes") - meetingDateTimeObj > -3600000) {
              this.isSubmitting = false;
              this.$q.notify({
                  type: "negative",
                  message: "Please select valid date and time"
                });
              return;
            }
          }
          const url = "/file/invite-signer";
          const templateId = this.selectedTemplate ? this.selectedTemplate.value : null;
          const formData = new FormData();
          console.log("this.$user", this.$user);
          formData.append("notary_user_id", this.$user._id);
          formData.append("name", this.model.signerName);
          formData.append("email", this.model.signerEmail);
          formData.append("meetingdate", this.model.meetingdate);
          formData.append("meetingTimeZone", this.meetingTimeZone.value);
          formData.append("currentTimeZone", String((new Date()).getTimezoneOffset() / -60));
          formData.append("sessionType", this.sessionType.value);
          if (this.multiSignerFlag) {
            formData.append("multiSignerList", JSON.stringify(this.multiSignerList));
          }
          if (this.$user.role === "customer") {
            formData.append("invitedByCustomer", true);
            formData.append("selectedNotary", this.selectedNotary && this.selectedNotary.value);
          }
          if (templateId) {
            formData.append("template", templateId);
          }
          if (this.skipCustomerKBACheck) {
            formData.append("skipCustomerKBACheck", this.skipCustomerKBACheck);
          }
          if (this.sessionChargeOnBusinessUser) {
            formData.append("sessionChargeOnBusinessUser", this.sessionChargeOnBusinessUser);
            formData.append("stripeIdentityDetails", JSON.stringify(this.stripeIdentityDetails));
          }

          if (this.notaryDocuments) {
            __.map(this.notaryDocuments, (tempDocument) => {
              formData.append("file", tempDocument);
            });
          }
          console.log(formData);
          const response = await $axios.post(url, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log(response);
          this.$q.notify({
            color: "primary",
            position: "bottom-right",
            message: "We have sent an invitation to signer.",
          });
          if (this.$user.role === "customer") {
            this.$router.replace("/business/business-sessions");
          } else {
            this.$router.replace("/notary/my-sessions/");
          }
        } catch (error) {
          console.log(error);
        }
      }
      this.isSubmitting = false;
    },
    timezoneFilterFn (val, update) {
      if (val === "") {
        update(() => {
          this.timezoneValues = window.allTimeZones;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.timezoneValues = window.allTimeZones.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
      });
    },
    onRejected () {
      this.$q.notify({
        type: "negative",
        message: "Selected document size is exceeding the maximum file size of 25MB."
      });
    },
    calculateTime(offset) {
        // create Date object for current location
        const d = new Date();
        // convert to msec
        // subtract local time zone offset
        // get UTC time in msec
        const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        // create new Date object for different city
        // using supplied offset
        const nd = new Date(utc + (3600000 * offset));
        // return time as a string
        return nd.toLocaleString();
    },
    addMoreSignerButton() {
      this.multiSignerList.push({
        id: `input${String(this.multiSignerList.length)}`,
        email: ""
      });
    },
    removeSignerEmail(signerId) {
      this.multiSignerList = __.filter(this.multiSignerList, (signerDoc) => signerDoc.id !== signerId);
    },
    removeDocument(tempDocument) {
      this.notaryDocuments = __.filter(this.notaryDocuments, (uploadedDocument) => uploadedDocument.name !== tempDocument.name);
    },
    async fetchAllSelectableNotaries() {
      const url = "/customer/fetchAllSelectableNotaries";
      const response = await $axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      this.allSelectableNotaries = (response && response.data && response.data.userNotaryRelations) || [];
    },
    closePaymentInfoModal() {
      this.showPaymentInfoModal = false;
      this.sessionChargeOnBusinessUser = false;
      this.$q.notify({
        color: "orange",
        position: "bottom",
        message: "Default session billing will be used since card details were not provided.",
      });
    },
    async paymentDetailsCaptured(cardToken) {
      console.log("called", cardToken);
      const url = "session/createCustomerForInviteSigner";
      const response = await $axios.post(url, { data: cardToken }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      this.stripeIdentityDetails = (response && response.data) || {};
      console.log(response);
      if (this.stripeIdentityDetails && this.stripeIdentityDetails.stripeCustomerID) {
        this.$q.notify({
          color: "primary",
          position: "bottom",
          message: "Your card information has been saved successfully.",
        });
      } else {
        this.$q.notify({
          color: "primary",
          position: "bottom",
          message: "There was some error in card details. Default session billing will be used.",
        });
      }
      this.showPaymentInfoModal = false;
    },
    kBAConsentGiven(consentResponse) {
      if (!consentResponse) {
        this.skipCustomerKBACheck = false;
        this.$q.notify({
          color: "orange",
          position: "bottom",
          message: "Revoking Customer KBA for the Session",
        });
      } else {
        this.$q.notify({
          color: "green",
          position: "bottom",
          message: "Granting Customer KBA for the Session",
        });
      }
    }
  },
};
</script>

<style>
.horizontalLine {
   width: 100%;
   text-align: center;
   border-bottom: 1px solid #000;
   line-height: 0.1em;
   margin: 10px 0 20px;
}

.horizontalLine span {
    background:#fff;
    padding:0 10px;
    font-weight: bold;
}
</style>
