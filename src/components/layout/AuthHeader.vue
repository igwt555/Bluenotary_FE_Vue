<template>
  <q-header elevated class="bg-white text-grey-8 q-py-xs q-px-md" height-hint="58">
    <!-- <div v-if="browserIncompatibilityError" style="width: 100%; text-align: center; background: #f595af; color: white; margin-left: -16px; margin-top: -4px; width: 100vw">
      Please use <a href="https://www.google.com/chrome/"><u>Chrome browser</u></a> for notarization sessions.
    </div> -->
    <q-toolbar>
      <img style="width:35px;" src="https://bluenotary.us/assets/img/logo-a4-b.png" />
      <q-space />
      <div class="q-gutter-sm row items-center no-wrap q-pr-lg customer-nav mbhide">
        <router-link to="/business/" class="q-px-md">
          My Documents
        </router-link>
        <router-link
          v-if="$user.memberType !== 'free'"
          to="/business/business-sessions"
          class="q-px-md"
        >
          Sessions
        </router-link>
        <router-link
          v-if="$user.memberType !== 'free'"
          to="/business/templates"
          class="q-px-md"
        >
          Templates
        </router-link>
        <div
          v-else
          class="q-px-md"
          style="cursor: pointer"
          @click="showUpgradePopup"
        >
          Templates
        </div>
      </div>
      <div class="q-gutter-sm row items-center no-wrap">
        <q-btn dense flat no-wrap>
          <span class="q-pa-sm">{{ $user.name }}</span>
          <q-icon name="arrow_drop_down" size="xs" />
          <q-menu auto-close>
            <q-list dense style="min-width: 200px">
              <q-item clickable class="vmob">
                <router-link to="/business/">
                  <q-item-section>
                    My Documents
                  </q-item-section>
                </router-link>
              </q-item>
              <q-item clickable class="vmob">
                <router-link
                  v-if="$user.memberType !== 'free'"
                  to="/business/business-sessions"
                >
                  <q-item-section>
                    Sessions
                  </q-item-section>
                </router-link>
              </q-item>
              <q-item clickable class="vmob">
                  <router-link
                    v-if="$user.memberType === 'business' || $user.memberType === 'agent'"
                    to="/business/templates"
                    class=""
                  >
                    <q-item-section>
                      Templates
                    </q-item-section>
                  </router-link>
              </q-item>
              <q-separator />
              <q-item clickable>
                <router-link to="/business/account-settings" style="color:#333">
                  <q-item-section>
                    <!-- <q-icon name="settings" size="xs" color="none"/> -->
                    Account Settings
                  </q-item-section>
                </router-link>
              </q-item>
              <q-item clickable>
                <a href="https://bluenotary.freshdesk.com" target="_blank" style="color:#333">
                  <q-item-section>
                    <!-- <q-icon name="support" size="xs" /> -->
                    Help & Support
                  </q-item-section>
                </a>
              </q-item>
              <q-separator />
              <q-item clickable class="GL__menu-link" @click="signOut">
                <q-item-section>
                  Sign out
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-toolbar>
    <upgrade-account-popup-component :open-acc-pro-model="openUpgradePopup" />
  </q-header>
</template>
<script>
import UpgradeAccountPopupComponent from "../../pages/customer/upgradeCustomerAccount.vue";

export default {
  components: {
    UpgradeAccountPopupComponent
  },
  data() {
    return {
      count: 0,
      attachmentCount: 0,
      polling: null,
      openUpgradePopup: false,
      // browserIncompatibilityError: false
    };
  },
  mounted() {
    // this.browserIncompatibilityError = !(/chrome/i.test(navigator.userAgent));
  },
  methods: {
    async loadMessage() {
      const { data } = await this.axios.get("/messages/count");
      this.count = data?.count ?? 0;
      this.attachmentCount =
        (await this.axios.get("/attachments/count").data?.count) ?? 0;
    },
    clearPolling() {
      clearInterval(this.polling);
      this.polling = null;
    },
    showUpgradePopup() {
      this.openUpgradePopup = false;
      setTimeout(() => {
        this.openUpgradePopup = true;
      }, 200);
    },
  }
};
</script>
