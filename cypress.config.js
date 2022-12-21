const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://app.bluenotary.us",
    execTimeout: 10000,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 10000,
    chromeWebSecurity: false,
  },
  chromeWebSecurity: false,
});
