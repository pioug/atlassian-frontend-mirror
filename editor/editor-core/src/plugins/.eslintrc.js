const fs = require('fs');

const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const pluginNames = getDirectories(__dirname);

module.exports = {
  rules: {
    'import/no-restricted-paths': [
      'warn',
      {
        zones: [
          ...pluginNames.map((pluginName) => ({
            target: `packages/editor/editor-core/src/plugins/!(${pluginName})/**/*`,
            from: `packages/editor/editor-core/src/plugins/${pluginName}/!(types)*`,
            message:
              '[ELR102] Avoid cross-dependencies between editor plugins. Type-only imports are an exception. Move shared code to a common location. https://hello.atlassian.net/wiki/spaces/AF/pages/2634573964/Editor+Lint#ELR002',
          })),
          ...pluginNames.map((pluginName) => ({
            target: `packages/editor/editor-core/src/plugins/!(${pluginName})/**/*`,
            from: `packages/editor/editor-core/src/plugins/${pluginName}/!(types)**/*`,
            message:
              '[ELR102] Avoid cross-dependencies between editor plugins. Type-only imports are an exception. Move shared code to a common location. https://hello.atlassian.net/wiki/spaces/AF/pages/2634573964/Editor+Lint#ELR002',
          })),
        ],
      },
    ],
  },
  overrides: [
    {
      files: [
        '**/__tests__/**/*.{js,ts,tsx}',
        'examples/**/*.{js,ts,tsx}',
        '**/*.{test,spec}.{js,ts,tsx}',
      ],
      rules: {
        'import/no-restricted-paths': ['off'],
      },
    },
  ],
};
