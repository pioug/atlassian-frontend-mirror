# @atlaskit/agent-color

## 1.0.0

### Major Changes

- [`b378d1dd86483`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b378d1dd86483) -
  Brand ChatGPT contributor tags with the ChatGPT icon and a fixed colour.

  Centralised agent brand metadata in `@atlaskit/agent-color`: added `agent-brand-claude`,
  `agent-brand-chatgpt` and `agent-brand-rovo` colour schemes, and extended
  `getThirdPartyAgentColor` (`./get-third-party-agent-color`) to also resolve the
  `claude`/`chatgpt`/`rovo`/`rovo_chat` aliases and return a canonical display `name`. Removed the
  now-redundant `./chatgpt-brand-color` export (`CHATGPT_BRAND_COLOR`) — its value is now the
  `agent-brand-chatgpt` scheme's `bold`/`boldText` fields, reachable through
  `getThirdPartyAgentColor`.

  `editor-shared-styles` and `editor-plugin-show-diff` now resolve their brand colours and
  contributor-tag names through this shared lookup instead of maintaining their own per-package
  brand tables, with no behaviour change.

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [`b2a2413928cac`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2a2413928cac) -
  Add shared Studio and third-party agent palettes with theme-responsive colour roles.

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [`a8b0726ce1e34`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a8b0726ce1e34) -
  Adds shared semantic agent colour resolution and aligns diff history with agent telepointers
  behind `confluence_ncs_step_diffing_version_history`.

## 0.1.0

### Minor Changes

- Adds stable colour selection for agents.
