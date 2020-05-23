const withSourceMaps = require("@zeit/next-source-maps")();

// config for sentry
module.exports = withSourceMaps({
  webpack(config) {
    return config;
  },
});
