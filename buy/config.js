/* Public Paddle.js configuration for sandbox testing. */
window.WTL_CHECKOUT = {
  enabled: new URLSearchParams(window.location.search).get("sandbox") === "1",
  environment: "sandbox",
  clientToken: "test_eef4bc3cdce0a13e900a92ce4f2",
  priceId: "pri_01m77n4bqdgxqc2m8b9zrfjp2y",
  apiBaseUrl: "https://tiny-world-sandbox-licenses.elrebelgamer.workers.dev",
  supportEmail: "aswanthsreeram@gmail.com"
};
