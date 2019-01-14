module.exports = {
  "plugins": [
    "react"
  ],
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "env": {
    "es6": true,
    "browser": true
  },
  "globals": {
    "React": true,
    "ReactDOM": true
  },
  "rules": {
    "no-console": "off"
  }
}