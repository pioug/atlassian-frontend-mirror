# @atlaskit/ads-mcp

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
