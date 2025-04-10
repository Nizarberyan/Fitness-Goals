const path = require("path");

module.exports = {
  input: ["src/**/*.{js,jsx,ts,tsx}", "!**/node_modules/**", "!public/**"],
  output: "./src/utils/locales/",
  options: {
    debug: true,
    sort: true,
    removeUnusedKeys: true,
    func: {
      list: ["t", "i18next.t"],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    trans: {
      component: "Trans",
      i18nKey: "i18nKey",
      defaultsKey: "defaults",
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    lngs: ["en", "fr"],
    defaultLng: "en",
    defaultNs: "translation",
    ns: ["translation"],
  },
};
