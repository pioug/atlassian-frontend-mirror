# @atlaskit/ads-mcp

## 0.8.4

### Patch Changes

- [`f0d92beae2f40`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0d92beae2f40) -
  Removes utility icons entrypoints from the '@atlaskit/icon' package. Migrates related packages to
  update their imports.
- Updated dependencies

## 0.8.3

### Patch Changes

- Updated dependencies

## 0.8.2

### Patch Changes

- [`64561aae4b705`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/64561aae4b705) -
  Enhance README.md with comprehensive updates including a new Table of Contents, detailed usage
  instructions for various tools, and FAQs for troubleshooting. Added sections on accessibility
  features and environment variables for better user guidance.

## 0.8.1

### Patch Changes

- [`1eb8946c72537`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1eb8946c72537) -
  Update README.md to clarify MCP configuration instructions

## 0.8.0

### Minor Changes

- [`307bb9ca6972b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/307bb9ca6972b) -
  Add analytics tracking for tool requests and errors

## 0.7.3

### Patch Changes

- [`1e36a2d0fe31e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1e36a2d0fe31e) -
  Tiny update to form component types

## 0.7.2

### Patch Changes

- [`113082182ce8f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/113082182ce8f) -
  Use pre-built distribution files when source files are unavailable, preventing module resolution
  failures.

## 0.7.1

### Patch Changes

- [`75ba0401c1743`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/75ba0401c1743) -
  Updated shape token reference.
- Updated dependencies

## 0.7.0

### Minor Changes

- [`b51ba8af7cc1a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b51ba8af7cc1a) -
  Switch ads-mcp to using esbuild-regsiter instead.
- [`b51ba8af7cc1a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b51ba8af7cc1a) -
  Greatly decrease the resting system prompt token usages by reducing tool descriptions.

## 0.6.5

### Patch Changes

- [`e3fc2f35e8191`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e3fc2f35e8191) - -
  Implemented a codegen that generates TypeScript code for the components list, which will be used
  by @atlaskit/ads-mcp.

## 0.6.4

### Patch Changes

- [`6660e1e7505e4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6660e1e7505e4) -
  Replace tool names containing "accessibility" with "a11y"

## 0.6.3

### Patch Changes

- [`248faa32d4835`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/248faa32d4835) -
  Internal changes to how borders are applied.
- Updated dependencies

## 0.6.2

### Patch Changes

- [`28e3bab9e4314`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/28e3bab9e4314) -
  Migrated old shape tokens to new tokens. No visual change.

## 0.6.1

### Patch Changes

- [`5d3c3001f9c72`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5d3c3001f9c72) -
  Namespacing tools to define clear boundaries in functionality

## 0.6.0

### Minor Changes

- [`c93f651e4d55f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c93f651e4d55f) - -
  Added `plan` tool, a grouped API tool call for `search_tokens`, `search_icons` and
  `get_components` combined
  - Remove duplicate results in search tools for `search-components`, `search-icons`, and
    `search-tokens`

## 0.5.0

### Minor Changes

- [`0276dc4a39d9d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0276dc4a39d9d) -
  Renamed `get_component_details` to `search_components` tool and adjusted related references in the
  codebase and improved querying of components.

## 0.4.1

### Patch Changes

- [`217beed112e9f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/217beed112e9f) -
  fix broken import

## 0.4.0

### Minor Changes

- [`b89521ec6e0ab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b89521ec6e0ab) -
  Replaced deprecated token and icon tools with new `get_all_tokens`, `search_tokens`,
  `get_all_icons`, and `search_icons` (supporting multiple search terms with improved search
  accuracy and optimised results), updated dependencies and instructions, refactored related files,
  and enhanced search functionality and result limits for both tokens and icons.

## 0.3.0

### Minor Changes

- [`e4500e5351ce1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e4500e5351ce1) -
  Added tooling to scan and fix a11y violations

### Patch Changes

- Updated dependencies

## 0.2.5

### Patch Changes

- [`098cfbb01dc36`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/098cfbb01dc36) -
  Add missing npmignore files to remove unnecessary files from published package

## 0.2.4

### Patch Changes

- Updated dependencies

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- [#185231](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185231)
  [`8cd7b52d423d1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8cd7b52d423d1) -
  Internal changes resulting from update to @atlaskit/navigation-system
- Updated dependencies

## 0.2.1

### Patch Changes

- [#174616](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/174616)
  [`ee906c44a058e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee906c44a058e) -
  Internal refactors to accomodate for platform package rename.

## 0.2.0

### Minor Changes

- [#172423](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/172423)
  [`ec1b840853a1d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ec1b840853a1d) -
  Adds contentGuidelines to multiple component details responses.

## 0.1.9

### Patch Changes

- Updated dependencies

## 0.1.8

### Patch Changes

- [#172151](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/172151)
  [`63b44a0ddaa2f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/63b44a0ddaa2f) -
  Rejoin the dev and main entrypoints together for a better local development experience.

## 0.1.7

### Patch Changes

- [#171542](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/171542)
  [`3dd57e3f43529`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3dd57e3f43529) -
  Fix ADS MCP when installing via npx by completely decoupling the tsconfig-related devloop
- Updated dependencies

## 0.1.6

### Patch Changes

- [#170901](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/170901)
  [`b3b427396eeea`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b3b427396eeea) -
  Fix npx execution by moving ts-node to dependencies

## 0.1.5

### Patch Changes

- [#169983](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/169983)
  [`c72e85f165c1b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c72e85f165c1b) -
  Internal refactors to accomodate for platform entrypoint changes and component renames.

## 0.1.4

### Patch Changes

- [#170150](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/170150)
  [`55295a0875e9c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/55295a0875e9c) -
  Fix @atlaskit/ads-mcp when consumed via NPX (again)

## 0.1.3

### Patch Changes

- [#169332](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/169332)
  [`d1551201c8a62`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d1551201c8a62) -
  Internal refactors to accomodate for platform entrypoint changes.
- Updated dependencies

## 0.1.2

### Patch Changes

- [#169451](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/169451)
  [`9476858e0b6f5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9476858e0b6f5) -
  Fixes @atlaskit/ads-mcp to work properly as the distribution doesn't work in node verbatim.

## 0.1.1

### Patch Changes

- [#167791](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/167791)
  [`635dd73b1e1d1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/635dd73b1e1d1) -
  Fix @atlaskit/ads-mcp to not require @atlassian/ts-loader (a private package)

## 0.1.0

### Minor Changes

- [#166633](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166633)
  [`a196e6778d295`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a196e6778d295) -
  Fixes ads-mcp to be executable properly with npx (adds a bin entry) and consumes a new
  `@atlaskit/tokens/token-metadata` entrypoint to better share raw metadata across packages for MCP
  server and similar code generation.

### Patch Changes

- Updated dependencies
