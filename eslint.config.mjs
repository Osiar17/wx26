// Dev-only. Lints the Node tooling (ES modules). The site's browser JS is
// validated behaviourally by the Playwright smoke tests (0 runtime errors).
export default [
  {
    files: ["tools/**/*.mjs"],
    languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    rules: { "no-unused-vars": "warn", "no-undef": "off" },
  },
];
