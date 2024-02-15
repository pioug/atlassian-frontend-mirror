# Atlassian UI Styling Standard ESLint Plugin

The UI Styling Standard plugin utilizes rules from across Atlassian, Open Source, and more, to define what the standard for writing styles at Atlassian should look like.

## Installation

Not intended for use outside the Atlassian frontend repository.

## Rules

| Rule                                                                                                                                    | Description                                                                                                                                               | Recommended | Fixable | Suggestions |
| --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------- | ----------- |
| <a href="../eslint-plugin/src/rules/local-cx-xcss/README.md">local-cx-xcss</a>                                                          | Ensures the cx() function, which is part of the XCSS API, is only used within the xcss prop. This aids tracking what styles are applied to a jsx element. | Yes         |         |             |
| <a href="https://github.com/atlassian-labs/compiled/tree/master/packages/eslint-plugin/src/rules/no-suppress-xcss">no-suppress-xcss</a> | Disallows supressing type violations when using the xcss prop                                                                                             | Yes         |         |             |
| <a href="https://github.com/atlassian-labs/compiled/tree/master/packages/eslint-plugin/src/rules/no-js-xcss">no-js-xcss</a>             | Disallows using xcss prop inside JavaScript files                                                                                                         | Yes         |         |             |
