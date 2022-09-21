const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
});
module.exports = {
  chainWebpack: (config) => {
    config.module.rules.delete("eslint");
  },
};

/*
const path = require("path");

 module.exports = {
  css: {
    loaderOptions: {
      sass: {
        includePaths: [path.resolve(__dirname, "./src/scss")],
        prependData: `@import "@/scss/_colors.scss"`,
      },
    },
  },
};
 */
