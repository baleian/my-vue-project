module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  "chainWebpack": config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Vue Tutorial';
      args[0].daumApiKey = '<DAUM_API_KEY>';
      return args;
    });
  },
  "devServer": {
    "proxy": {
      "/api": {
        "target": "http://localhost:3000/api",
        "changeOrigin": true,
        "pathRewrite": {
          "^/api": ""
        },
      },
    },
  },
};
