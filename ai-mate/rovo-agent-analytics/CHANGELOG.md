# @atlaskit/rovo-agent-analytics

## 1.4.0

### Minor Changes

- [`04fe400264167`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/04fe400264167) -
  RAGE-3507: Add versioned-agent analytics foundation

  ### `@atlaskit/rovo-agent-analytics`
  - Added `VersionedAgentAttributes` type (`agentIsPublished`, `agentVersionNumber`)
  - Added new `createFlow` event payloads:
    - `createAgentRecord` — fires when BE `agentStudio_createAgent` mutation succeeds
      (post-versioning, replaces `createFlowActivate`); minimal payload (registry/101157)
    - `published` — fires on every agent version publish; carries rich agent attrs + versioning
      envelope (registry/101158)
    - `createLandInAgentLandingWithSA` — fires when user lands on agents landing with SA modal
      auto-opened; v2/SA only (registry/99780)
  - Extended `editing.ts` `updated` event to carry `agentIsPublished` from mutation response
  - Updated `createFlow` JSDoc funnel table to v1 / v1+versioning / v2 / v2+versioning columns

  ### `@atlassian/agent-studio`
  - Three dedicated analytics helpers in `services/create-agent/utils.tsx`:
    - `getAgentLegacyCreateActivateAnalytics` — rich write-input shape for legacy
      `createFlowActivate` (deletion path RAGE-3459)
    - `getAgentCreateAnalytics` — minimal payload for `createAgentRecord` (`agentId`, `source`,
      `agentType`, `agentIsPublished`)
    - `getAgentPublishAnalytics` — fragment-read shape for `published`; computes `agentToolCount`,
      `agentMcpServerCount`, `agentToolsList` from agent-level tools and per-scenario `toolCount`,
      `toolsList`, `mcpServerCount`, `mcpToolCount`
  - `useCreateAgent`: new required `hasVersionCapability` param gates either-or between
    `createAgentRecord` and `createFlowActivate`
  - Publish-button: fires `published` event with rich attrs; fragment extended with `definitionId` +
    `definitionSource` on all tool fields
  - `update-agent-details` mutation: fires `updated` event with `agentIsPublished` from response
    (gated on `rovo_agent_versioning_enabled` FG via `@include`)
  - Landing: fires `createLandInAgentLandingWithSA` when SA modal auto-opens

  ### `@atlassian/studio-solution-architect-ui-components`
  - SA Manual Create Agent button: fires `createAgentRecord` analytics on successful create (gated
    on `rovo-agents-universal-analytics` FG)

## 1.3.0

### Minor Changes

- [`6f5f7728ba6d1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6f5f7728ba6d1) -
  [ux] Redirect deprecated `/create/<subpath>` URLs to the appropriate create entry point when agent
  versioning is enabled.

  When a user lands on a bookmarked or shared URL like `/create/details`, `/create/identity`,
  `/create/permissions`, `/create/overview`, `/create/surfaces`, or `/create/scenarios` (anything
  under `/create/...` except `/create/chat`), they're now automatically redirected:
  - **v1 studio** → NL create screen (`/create/chat`)
  - **v2 studio** → agents landing page with the Solutions Architect modal opened
    (`?openCreateAgentModal=true`)

  The Solutions Architect FE-draft escape hatch (`?draftBuildId=...`) is preserved until the SA
  migration is complete.

## 1.2.0

### Minor Changes

- [`17f2af77c77de`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/17f2af77c77de) -
  Add InsightsEventPayload for insights page date filter analytics

## 1.1.1

### Patch Changes

- [`47b02f048ca4a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/47b02f048ca4a) -
  Enrol search and ai-mate packages into the React Compiler with platform gating via
  isReactCompilerActivePlatform.

## 1.1.0

### Minor Changes

- [`cffd9dae547c3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cffd9dae547c3) -
  Update rovo agents analytics funnel

## 1.0.0

### Major Changes

- [`e4034958fc116`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e4034958fc116) -
  Adjust event tracking for agent analytics to use new trackAgentEvent() method. Remove deprecated
  trackAgentAction() export and exported action const enums

## 0.20.0

### Minor Changes

- [`30edbd0d978ea`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/30edbd0d978ea) -
  Deprecate trackAgentAction() and enums exports, introduce trackAgentEvent()

## 0.19.0

### Minor Changes

- [`2ccb8729cef96`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2ccb8729cef96) -
  Reorg agent action enums to different files, add the actionGroup to the analytics

## 0.18.0

### Minor Changes

- [`c2adfceefe4d2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c2adfceefe4d2) -
  Add scenarioId to chat; add more guardrail for rovo agent analytics; add single instrumentation id
  for rovoAgent toolsExecutionResult; add trackAIMauAction

## 0.17.0

### Minor Changes

- [`0f9bf8c0ac300`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0f9bf8c0ac300) -
  Add examplePromptKey attribute in analytics context for when example prompt is used. Add SA_DRAFT
  event for rovo agent analytics"

## 0.16.0

### Minor Changes

- [`1778d733b1d68`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1778d733b1d68) -
  Adding analytics to confirmed tools, including using the rovo agent analytics library

## 0.15.1

### Patch Changes

- Updated dependencies

## 0.15.0

### Minor Changes

- [`d4d7d91e006ac`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d4d7d91e006ac) -
  Update no skills modal analytics to use rovo agents analytics lib

## 0.14.0

### Minor Changes

- [`dd26e8d5e8e1b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dd26e8d5e8e1b) -
  Update rovo agent analytics track landing

## 0.13.0

### Minor Changes

- [`d6ab7edf41142`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d6ab7edf41142) -
  Update agent analytics types

## 0.12.1

### Patch Changes

- [`f2c0a49bc75c7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2c0a49bc75c7) -
  Add comments to data-portal registry

## 0.12.0

### Minor Changes

- [`0c769648243fc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0c769648243fc) -
  Update rovo agents analytics coverage
- [`442a9eacd5145`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/442a9eacd5145) -
  Fix rovo agent debug modal view analytics

## 0.11.0

### Minor Changes

- [`d701db2f15d73`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d701db2f15d73) -
  Rovo agents debug modal analytics

## 0.10.0

### Minor Changes

- [`e93d0946c0929`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e93d0946c0929) -
  Auto sort for export path for last remaining ai-mate packages. Part of de-barreling effort of
  TREX-67

## 0.9.0

### Minor Changes

- [`30b1a6e6f786c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/30b1a6e6f786c) -
  [ux] add verify agent in rovo agent landing page dropdown

## 0.8.0

### Minor Changes

- [`613e539d201d3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/613e539d201d3) -
  Update rovo agents overview page analytics

## 0.7.0

### Minor Changes

- [`a37925a8ebe53`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a37925a8ebe53) -
  Update rovo agents analytics & support NL create events

## 0.6.0

### Minor Changes

- [`83339258ea2e8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/83339258ea2e8) -
  Update rovo agent analytics context

## 0.5.0

### Minor Changes

- [`93bff15d188d5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/93bff15d188d5) -
  Update agent analytics create actions

## 0.4.0

### Minor Changes

- [`b0dd47d633912`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b0dd47d633912) -
  Add studio overview page actions analytics

## 0.3.0

### Minor Changes

- [`595e58d6cd596`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/595e58d6cd596) -
  Add rovo agents create analytics

## 0.2.0

### Minor Changes

- [`1998bf09cc49e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1998bf09cc49e) -
  Rovo agent analytics - actions
