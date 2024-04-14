module.exports = [
  {
    context: ["/api"],
    target: "https://localhost:44312",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
];
