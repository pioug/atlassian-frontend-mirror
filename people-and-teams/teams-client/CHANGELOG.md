# @atlaskit/teams-client

## 4.29.1

### Patch Changes

- [`8dadb76e44cfb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8dadb76e44cfb) -
  Clean up enable_x_query_context_header

## 4.29.0

### Minor Changes

- [`c64239609fe7a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c64239609fe7a) -
  Use agg-client exported from teams-client in teams-public

## 4.28.0

### Minor Changes

- [`1834a38494182`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1834a38494182) -
  Enable search teams by type id

## 4.27.0

### Minor Changes

- [`0df25f7dfb6a2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0df25f7dfb6a2) -
  Add X-Query-Context to UGS requests

## 4.26.0

### Minor Changes

- [`8b220c96bc0d3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8b220c96bc0d3) -
  Added optional cloudId param to getTeamById in legion client

## 4.25.0

### Minor Changes

- [`58a9f3b29f99d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/58a9f3b29f99d) -
  Remove temporary implementation of type ARI, use the official one

### Patch Changes

- [`da4bb4ac09df1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/da4bb4ac09df1) -
  Update some type related permissions

## 4.24.1

### Patch Changes

- [`16637112d793a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/16637112d793a) -
  Team creation accepts both team type ID and team type ARI

## 4.24.0

### Minor Changes

- [`0f5306d6607ab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0f5306d6607ab) -
  Add ORG_ADMIN_MANAGED to membership settings

## 4.23.0

### Minor Changes

- [`c49c45398b080`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c49c45398b080) -
  [ux] Add types to the team create

## 4.22.0

### Minor Changes

- [`351add7ec8607`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/351add7ec8607) -
  [ux] Add team types field and permission handlers

## 4.21.0

### Minor Changes

- [`c40c12b0fcf46`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c40c12b0fcf46) -
  Added a new API "getTeamStatesInBulk" to fetch team states in bulk in an org

### Patch Changes

- [`151750f891a85`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/151750f891a85) -
  Updated unassigned teams response type to include null for cursor

## 4.20.0

### Minor Changes

- [`ad907b3b5b89e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ad907b3b5b89e) -
  Added Archive team functionality

## 4.19.0

### Minor Changes

- [`cfa1ef120b213`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cfa1ef120b213) -
  Integrated atlassian/reporting-lines into atlassian/ptc-embeddable-directory

## 4.18.0

### Minor Changes

- [`c6370cfc98b38`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c6370cfc98b38) -
  Added API to get teams to be cloned to JSM sites

## 4.17.0

### Minor Changes

- [`072ec290dfbf2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/072ec290dfbf2) -
  Added cutoff date in TeamEnabledSitesResponse

## 4.16.0

### Minor Changes

- [`41573b4757009`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/41573b4757009) -
  Added new API "checkOrgFullAlignmentStatus" to check the full scope alignment status of an org

## 4.15.1

### Patch Changes

- Updated dependencies

## 4.15.0

### Minor Changes

- [`1479c40dd71d7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1479c40dd71d7) -
  Added getTeamSiteAssignmentOrgDetails

## 4.14.0

### Minor Changes

- [`9dd1cc0756413`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9dd1cc0756413) -
  Created agents tab for the new profile page

## 4.13.1

### Patch Changes

- [`21d91ec75d514`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21d91ec75d514) -
  Fix for race condition

## 4.13.0

### Minor Changes

- [`baa31419d9a48`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/baa31419d9a48) -
  Added accountDisplayName in assignedTeam type

## 4.12.0

### Minor Changes

- [`c9a85d9cf0d53`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c9a85d9cf0d53) -
  Added new API to get unaligned teams

### Patch Changes

- Updated dependencies

## 4.11.1

### Patch Changes

- [`13c698778e3c6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/13c698778e3c6) -
  [ux] Atlaspack version bump

## 4.11.0

### Minor Changes

- [`6bbb35d7aa724`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6bbb35d7aa724) -
  Added API to get assigned teams and set team site assignment permission

## 4.10.0

### Minor Changes

- [#195513](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195513)
  [`22eeb98d28d35`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/22eeb98d28d35) -
  Added APIs and state stores for mixscoped team and site assignment

## 4.9.1

### Patch Changes

- [#193849](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193849)
  [`4a8c4dffd99ef`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4a8c4dffd99ef) -
  Fix the context setting issue in the query setting query

## 4.9.0

### Minor Changes

- [#193026](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193026)
  [`602d16d569c4f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/602d16d569c4f) -
  Implemented the logic to remove agents associated with the team

## 4.8.2

### Patch Changes

- Updated dependencies

## 4.8.1

### Patch Changes

- [`f3d7777b4d9c3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f3d7777b4d9c3) -
  Added isverified filter

## 4.8.0

### Minor Changes

- [#188281](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188281)
  [`6ae2a10ea13be`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6ae2a10ea13be) -
  Implemented the client to add agents to the new connection pattern

## 4.7.0

### Minor Changes

- [#186624](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/186624)
  [`dd17d7a4e9bf5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dd17d7a4e9bf5) -
  Fetch agents associated with the team from UGS

## 4.6.4

### Patch Changes

- [#187179](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187179)
  [`50dbbc97b636b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/50dbbc97b636b) -
  Exported 'ApiTeamContainerCreationPayload' from '/types' entrypoint

## 4.6.3

### Patch Changes

- [#183439](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/183439)
  [`e038f5e3cbe30`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e038f5e3cbe30) -
  Export container types

## 4.6.2

### Patch Changes

- [#182966](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/182966)
  [`5ef269b09ac45`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5ef269b09ac45) -
  PTC-12475 Add test cases for 200 and 404 HTTP status codes in is5xx function tests

## 4.6.1

### Patch Changes

- [#181599](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/181599)
  [`4b25fc013bfe5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4b25fc013bfe5) -
  [ux] [PTC-12440]: Stop HRIS managed teams to be renamed

## 4.6.0

### Minor Changes

- [#179534](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/179534)
  [`a9ea980ec4a3c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a9ea980ec4a3c) -
  Auto fill web link title when creating/updating web link in team profile page

## 4.5.2

### Patch Changes

- [#177738](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/177738)
  [`b53656178cdff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b53656178cdff) -
  Update legion response for container creation to match changes in BE

## 4.5.1

### Patch Changes

- Updated dependencies

## 4.5.0

### Minor Changes

- [#166837](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166837)
  [`07f3669fe013f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/07f3669fe013f) -
  [ux] [PTC-12044]: Show connected group name in the teams settings dialog to org admins

## 4.4.0

### Minor Changes

- [#165980](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/165980)
  [`e7a1371658ecc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e7a1371658ecc) -
  Loom ARI

## 4.3.0

### Minor Changes

- [#159073](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159073)
  [`e4bb0c8422102`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e4bb0c8422102) -
  [ux] Implemented tenure information to the user profile

## 4.2.0

### Minor Changes

- [#154460](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154460)
  [`0fe18096b12c4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0fe18096b12c4) -
  [PTC-11909]: Restrict renaming managed teams to org admin only

## 4.1.0

### Minor Changes

- [#150686](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150686)
  [`81860cdd074fd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/81860cdd074fd) -
  Migrate team central client to move away from Apollo

## 4.0.0

### Major Changes

- [#146954](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/146954)
  [`6f753103c5c01`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6f753103c5c01) -
  BREAKING CHANGE: Migration from private @atlassian/teams-client to public @atlaskit/teams-client
  package

  WHAT:
  - Migrated teams-client from private package (@atlassian/teams-client) to public package
    (@atlaskit/teams-client)
  - All functionality remains the same, only the package name has changed.

  WHY:
  - To make teams-client functionality available to a wider range of public packages

  Note: All local consumer changes within this repository have already been included in this PR. HOW
  TO UPDATE:
  1. Update your package.json to use the new dependency:
     ```diff
     - "@atlassian/teams-client": "^x.x.x"
     + "@atlaskit/teams-client": "^x.x.x"
     ```
  2. Update your imports:
     ```diff
     - import { ... } from '@atlassian/teams-client'
     + import { ... } from '@atlaskit/teams-client'
     ```

## 3.6.2

### Patch Changes

- [#144134](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144134)
  [`ed3d9c8ffe716`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ed3d9c8ffe716) -
  This package is moving to public scope, after this version it will be @atlaskit/teams-client

## 3.6.1

### Patch Changes

- [#144083](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144083)
  [`670cded76c9cc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/670cded76c9cc) -
  PTC-11477 removed all usages of ApolloError

## 3.6.0

### Minor Changes

- [#140126](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140126)
  [`7c0516188c0ac`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7c0516188c0ac) -
  Updating useTeamPermission hook to encapsulate more of the check & less in UI

## 3.5.0

### Minor Changes

- [#138366](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/138366)
  [`baf6d68aa3a81`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/baf6d68aa3a81) -
  PTC-11576 Migrate private dependencies @atlassian/ufo and @atlassian/atl-context to public
  alternatives

## 3.4.2

### Patch Changes

- [#138832](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/138832)
  [`cc40eeddc1b3b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cc40eeddc1b3b) -
  PTC-11150 Update SENTRY_FEDRAMP_DSN to use updated PUBLIC_KEY and ID

## 3.4.1

### Patch Changes

- [#131518](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131518)
  [`4cd7eb9b3d67b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4cd7eb9b3d67b) -
  PTC-10858: Migrated usage of update team in slack mutation resolver to teams client

## 3.4.0

### Minor Changes

- [#130586](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130586)
  [`b322fbf915b63`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b322fbf915b63) -
  PTC-10859 Migrated disconnect slack team apollo mutation to REST
- [#129296](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129296)
  [`deec85f688794`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/deec85f688794) -
  [ux] move the team connection data to team container store

## 3.3.0

### Minor Changes

- [#129533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129533)
  [`47669fb21aff4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/47669fb21aff4) -
  Clean up feature flag enable_external_type_teams

### Patch Changes

- Updated dependencies

## 3.2.0

### Minor Changes

- [#128931](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128931)
  [`03ef4796eea4e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/03ef4796eea4e) -
  Exclude 403 responses from errors

## 3.1.0

### Minor Changes

- [#123369](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/123369)
  [`9ca9a8f5307a3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9ca9a8f5307a3) -
  Connected teams changes

## 3.0.1

### Patch Changes

- [#120031](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120031)
  [`857f4b3788690`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/857f4b3788690) -
  Fix error handler for UseQueryLight

## 3.0.0

### Major Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

### Patch Changes

- Updated dependencies

## 2.55.2

### Patch Changes

- [#110215](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110215)
  [`cbcdf31731c95`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cbcdf31731c95) -
  Dont use apollo for user profile edits

## 2.55.1

### Patch Changes

- Updated dependencies

## 2.55.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 2.54.0

### Minor Changes

- [#105842](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105842)
  [`f5da8b3595208`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f5da8b3595208) -
  Added getOrgEligibilityForManagedTeams

## 2.53.0

### Minor Changes

- [#103492](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103492)
  [`2379814aab441`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2379814aab441) -
  fetchAvatarInfo

## 2.52.0

### Minor Changes

- [#102556](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102556)
  [`242ed6702f399`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/242ed6702f399) -
  Pass site id in the restoreTeamToSyncedGroup request

## 2.51.2

### Patch Changes

- [#182378](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/182378)
  [`ac135171a8137`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ac135171a8137) -
  Cleanup enable_teams_for_agents feature gate

## 2.51.1

### Patch Changes

- [#177277](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/177277)
  [`92b2646e78617`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/92b2646e78617) -
  Added siteId to the request body of linkExistingTeamToGroup

## 2.51.0

### Minor Changes

- [#170790](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170790)
  [`dd8b41529bfa9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dd8b41529bfa9) -
  Added two APIs for linking an existing team to a group: 1: getTeamAndGroupDiff 2:
  linkExistingTeamToGroup

## 2.50.0

### Minor Changes

- [#170094](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170094)
  [`88aedbc573323`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/88aedbc573323) -
  PTC-10108 Add API for restore and link to group

## 2.49.0

### Minor Changes

- [#163566](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163566)
  [`0e3d1303ffeb8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0e3d1303ffeb8) -
  [ux] PTC-10089 Wrap verified team icon with conditional tooltip & fix isVerified mapping

## 2.48.0

### Minor Changes

- [#165202](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165202)
  [`1bfa467507a4d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1bfa467507a4d) -
  Export LinkedTeam and Scope type

## 2.47.1

### Patch Changes

- [#164553](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/164553)
  [`6904538543027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6904538543027) -
  Add passed in site id to origin cloudId in createExternalTeams

## 2.47.0

### Minor Changes

- [#163452](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163452)
  [`513072a109347`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/513072a109347) -
  Allow pass in site id when creating external team

## 2.46.0

### Minor Changes

- [#163159](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163159)
  [`feadb71b2fd6c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/feadb71b2fd6c) -
  PTC-10056 add org scope API to the team client

## 2.45.1

### Patch Changes

- [#156454](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156454)
  [`4fcce9ceb056c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4fcce9ceb056c) -
  Improve usage on sentries

## 2.45.0

### Minor Changes

- [#159728](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159728)
  [`6b9b7e1d060cc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b9b7e1d060cc) -
  Enable overriding team name for external teams

## 2.44.1

### Patch Changes

- [#158827](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158827)
  [`3c42f748980d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3c42f748980d0) -
  Removed ff pf-directory-settings-query-migration
- Updated dependencies

## 2.44.0

### Minor Changes

- [#154067](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154067)
  [`62367c8fec2b7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/62367c8fec2b7) -
  Update the external teams bulk API endpoint URL

### Patch Changes

- [#154149](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154149)
  [`cc82c0612ae26`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cc82c0612ae26) -
  React 18 compatibility

## 2.43.2

### Patch Changes

- [#150939](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150939)
  [`05f5a551eb162`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/05f5a551eb162) -
  PTC-9629 Migrate Team in Slack resolver and Team link icon resolver away from Apollo

## 2.43.1

### Patch Changes

- [#151808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151808)
  [`93955ad55ff49`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93955ad55ff49) -
  Add a new FG to exernal type teams

## 2.43.0

### Minor Changes

- [#142176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142176)
  [`c721eb80a6aa7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c721eb80a6aa7) -
  Use useQueryWrapper for HelpPointers

## 2.42.0

### Minor Changes

- [#150410](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150410)
  [`3d87418b93202`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3d87418b93202) -
  PTC-9629 migrate user profile mutability resolver and avatar uploaded status resolver to REST
- [#145909](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145909)
  [`78e4ac20b1f36`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/78e4ac20b1f36) -
  Remove the team health monitors from the PTC embeddable directory

## 2.41.1

### Patch Changes

- [#149596](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149596)
  [`25c2e3c8f23a8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/25c2e3c8f23a8) -
  [ux] PTC-10099 Add tooltip for scim sync read-only team name

## 2.41.0

### Minor Changes

- [#148074](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/148074)
  [`81cbd3fdbed74`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/81cbd3fdbed74) -
  Caching settings query based with userId

## 2.40.1

### Patch Changes

- [#148114](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/148114)
  [`3d88afb0d5237`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3d88afb0d5237) -
  PTC-9629 migrate Container query to REST endpoint

## 2.40.0

### Minor Changes

- [#147206](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147206)
  [`f28bd9e4b1353`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f28bd9e4b1353) -
  Added app name -> product mapping for legion product, and removed cache for getSettings

## 2.39.0

### Minor Changes

- [#144443](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144443)
  [`8e1afd419b5e4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8e1afd419b5e4) -
  Add flagged behaviour to call Atlassian Home APIs via sharded routes, and centralise the
  configuration of Stargate routes so that we can appropriately shard the calls

## 2.38.1

### Patch Changes

- [#142568](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142568)
  [`4ff8bab8a7da4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4ff8bab8a7da4) -
  Fix payload property name in getLinkedTeamsBulk

## 2.38.0

### Minor Changes

- [#132833](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132833)
  [`0ce000904d43f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0ce000904d43f) -
  Add new function to get synced team profile details

## 2.37.0

### Minor Changes

- [#142281](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142281)
  [`d91bd47f6418b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d91bd47f6418b) -
  Add method to fetch linked teams in bulk

## 2.36.0

### Minor Changes

- [#140632](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140632)
  [`5e7572f52189d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e7572f52189d) -
  Add userCan export for permissions

### Patch Changes

- [#140530](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140530)
  [`d5b0e25092fd8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d5b0e25092fd8) -
  Update directory settings query

## 2.35.1

### Patch Changes

- [#139983](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139983)
  [`d3efb249055fd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d3efb249055fd) -
  PTC-9568 In teams-client createExternalTeam fn, consume siteId from context

## 2.35.0

### Minor Changes

- [#139538](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139538)
  [`d7adf4da01c6e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d7adf4da01c6e) -
  Use useTeamsUser to fetch user data in profile page

## 2.34.0

### Minor Changes

- [#135893](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135893)
  [`089338b763495`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/089338b763495) -
  Show agents in team profile

## 2.33.0

### Minor Changes

- [#135020](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135020)
  [`9e7f985feb95d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9e7f985feb95d) -
  PTC-9911 Add createExternalTeam in teams client

## 2.32.0

### Minor Changes

- [#135460](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135460)
  [`21a199e623e3d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/21a199e623e3d) -
  PTC-9888 Make org admin same permission as scim sync team member

## 2.31.2

### Patch Changes

- [#134540](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134540)
  [`e93952c292aec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e93952c292aec) -
  Update queries to remove apollo

## 2.31.1

### Patch Changes

- [#133158](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133158)
  [`5a497b496b1f3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5a497b496b1f3) -
  PTC-9886 Pass externalReference to teams-client create team method'

## 2.31.0

### Minor Changes

- [#131064](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131064)
  [`5cda12ef1579c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5cda12ef1579c) -
  [ux] Allowing people directory to search for and show zero member teams. Updates the clients with
  backwards compatible settings to add these to serach results

## 2.30.0

### Minor Changes

- [#130587](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130587)
  [`ef126a5b40bb0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ef126a5b40bb0) -
  [ux] PTC-9637 Pass isVerified from legion, and render verified icon and label in team profile page

## 2.29.1

### Patch Changes

- Updated dependencies

## 2.29.0

### Minor Changes

- [#128238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128238)
  [`f476c923e6237`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f476c923e6237) -
  Add hasPermissionForAction

## 2.28.0

### Minor Changes

- [`94f875b672dd5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/94f875b672dd5) -
  PTC-8898 add AGG User query, add site user base check, add user controller

## 2.27.0

### Minor Changes

- [#120529](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120529)
  [`9fc770d6b3baf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9fc770d6b3baf) -
  [ux] PTC-9462 updating TeamMemberSettings, updates to logic for team profile updates and removing
  unused code

## 2.26.0

### Minor Changes

- [#120626](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120626)
  [`49bc9a91d58ca`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49bc9a91d58ca) -
  [ux] PTC-9449 Constrain user permission and display icons when team is scim sync

## 2.25.0

### Minor Changes

- [#102914](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102914)
  [`05588e46af1c6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/05588e46af1c6) -
  First step to attemp to migrate away from Apollo, with new hook useQueryLight

## 2.24.1

### Patch Changes

- Updated dependencies

## 2.24.0

### Minor Changes

- [#107925](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107925)
  [`70857daad8430`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/70857daad8430) -
  [ux] PTC-9214 Team restore page

## 2.23.0

### Minor Changes

- [#97635](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97635)
  [`e56063a84d8b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e56063a84d8b) -
  PTC-8928 Replace cover photo references with user preferences api

## 2.22.0

### Minor Changes

- [#89534](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89534)
  [`fe0778b80237`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fe0778b80237) -
  Add FedRamp env for Sentry

## 2.21.1

### Patch Changes

- [#92585](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92585)
  [`3885bce1e840`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3885bce1e840) -
  Upgrade `swagger-typescript-api` from `^12` to `^13` to leverage Typescript 5.

## 2.21.0

### Minor Changes

- [#90381](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90381)
  [`ac8798288ec6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ac8798288ec6) -
  PTC-9074 Deprecate DirectoryClient and remove references to FeatureFlags query

## 2.20.2

### Patch Changes

- [#88375](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88375)
  [`ddb3faf141b7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ddb3faf141b7) -
  Bugfix team health monitor query syntax for teams profile

## 2.20.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 2.20.0

### Minor Changes

- [#75315](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75315)
  [`6d0895feffe5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6d0895feffe5) -
  [ux] Changed Popup to Tooltip, standardise tooltips

## 2.19.1

### Patch Changes

- [#71158](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71158)
  [`a3c2541b1e5e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3c2541b1e5e) -
  Pass cloudId to health monitor queries as it is required

## 2.19.0

### Minor Changes

- [#67540](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67540)
  [`71caf3c0a9b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/71caf3c0a9b6) -
  Better handling of team member lists for large teams

## 2.18.9

### Patch Changes

- [#64926](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64926)
  [`112f80356389`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/112f80356389) -
  Remove SST FF

## 2.18.8

### Patch Changes

- [#59676](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59676)
  [`f05b9435798a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f05b9435798a) -
  Fixed decline join request url - added memberId

## 2.18.7

### Patch Changes

- [#41972](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41972)
  [`cbae7a5b720`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cbae7a5b720) -
  Performance metrics for TeamsClient

## 2.18.6

### Patch Changes

- [#41204](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41204)
  [`1681218cf54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1681218cf54) -
  TeamsClient docs

## 2.18.5

### Patch Changes

- [#41267](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41267)
  [`221a4a8c816`](https://bitbucket.org/atlassian/atlassian-frontend/commits/221a4a8c816) - Fixed
  productBuild condition in initialiseSentry

## 2.18.4

### Patch Changes

- [#41140](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41140)
  [`e54969bc4d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e54969bc4d1) - PTC-7540
  as a PIR, add unit tests for graphql queries

## 2.18.3

### Patch Changes

- [#41016](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41016)
  [`9cc8cb9b42c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9cc8cb9b42c) - Don't
  send empty add/remove user to team requests
- [#41086](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41086)
  [`abffcd7b205`](https://bitbucket.org/atlassian/atlassian-frontend/commits/abffcd7b205) - disable
  sentry dedupe integration

## 2.18.2

### Patch Changes

- [#40990](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40990)
  [`13e02dedb7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/13e02dedb7d) - Brute
  force setting orgId for teams invite dialog

## 2.18.1

### Patch Changes

- [#40922](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40922)
  [`f3a3e1742a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3a3e1742a7) - Remove
  trailing / from create teams URL & better error logging

## 2.18.0

### Minor Changes

- [#40881](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40881)
  [`95c7b14257c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95c7b14257c) - Add
  package context to Sentry logs

## 2.17.0

### Minor Changes

- [#40011](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40011)
  [`611b58fade8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/611b58fade8) - Accept
  membership settings in createTeam

## 2.16.0

### Minor Changes

- [#39625](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39625)
  [`99380a87ef4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99380a87ef4) - [ux]
  PTC-7677 change team visibility tooltip content based on scope mode

## 2.15.2

### Patch Changes

- [#40561](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40561)
  [`298ba01f549`](https://bitbucket.org/atlassian/atlassian-frontend/commits/298ba01f549) - Sentry
  improvments

## 2.15.1

### Patch Changes

- [#40360](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40360)
  [`4d5f96b8a2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d5f96b8a2e) - Check
  for missing accountIds in public client

## 2.15.0

### Minor Changes

- [#40227](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40227)
  [`1a6b8c84b01`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a6b8c84b01) - Add
  public getTeams info endpoints

## 2.14.2

### Patch Changes

- [#40140](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40140)
  [`d583ce88d51`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d583ce88d51) - Better
  logging in teams clients

## 2.14.1

### Patch Changes

- [#39981](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39981)
  [`412b0f71ee0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/412b0f71ee0) - Check if
  team member has extended profile

## 2.14.0

### Minor Changes

- [#39919](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39919)
  [`2cd6c1b48f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cd6c1b48f3) - Move all
  Sentry related code to teams-client

## 2.13.3

### Patch Changes

- [#39832](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39832)
  [`ca4c01c5256`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca4c01c5256) - [ux]
  Only show "Leave team" button on team profile for members of the team

## 2.13.2

### Patch Changes

- [#39915](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39915)
  [`81faabc2489`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81faabc2489) - Fix for
  origin params generation

## 2.13.1

### Patch Changes

- [#39789](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39789)
  [`58c5de9f23d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58c5de9f23d) -
  deduplicate recommended products in team product access

## 2.13.0

### Minor Changes

- [#37977](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37977)
  [`9f46ede9360`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f46ede9360) - Mark
  props returned by api not optional

## 2.12.0

### Minor Changes

- [#39034](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39034)
  [`61e046ce3a9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61e046ce3a9) -
  introduce invitations client

## 2.11.2

### Patch Changes

- [#38243](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38243)
  [`25bf460cfa2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/25bf460cfa2) - Fix for
  getMyTeamMembership

## 2.11.1

### Patch Changes

- [#37882](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37882)
  [`0bd8e4f2040`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0bd8e4f2040) - PTC-7536
  adding proper mocks for legion client

## 2.11.0

### Minor Changes

- [#37227](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37227)
  [`ffff2d78709`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ffff2d78709) - [ux] Add
  support for team health monitors on team profiles

## 2.10.0

### Minor Changes

- [#36997](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36997)
  [`eb36fada66f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb36fada66f) - We have
  introduced compatibility to Legion V4 to Teams Client

## 2.9.3

### Patch Changes

- [#36411](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36411)
  [`cda847fde18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cda847fde18) - Added
  members to create team

## 2.9.2

### Patch Changes

- [#36503](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36503)
  [`aa9b2e326a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa9b2e326a1) - Update
  LegionClient to handle team creation response

## 2.9.1

### Patch Changes

- [#36476](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36476)
  [`ae1fa6ceb53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae1fa6ceb53) - Added in
  missing team header urls to v3 map

## 2.9.0

### Minor Changes

- [#36305](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36305)
  [`62fde57793c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62fde57793c) - Added
  support for Legion V4 to Team Client for GetAllTeams

## 2.8.0

### Minor Changes

- [#36274](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36274)
  [`a6d9ed26c0c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a6d9ed26c0c) - Adds
  support for Legion V4 to updateTeamById on Team Client

## 2.7.0

### Minor Changes

- [#36136](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36136)
  [`2a15bfa2ff7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a15bfa2ff7) - Adds
  Legion V4 support to Team Client for GetTeamById

## 2.6.1

### Patch Changes

- [#36260](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36260)
  [`b6908d8f9d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6908d8f9d2) - Update
  create team response

## 2.6.0

### Minor Changes

- [#36111](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36111)
  [`f0d9fe54815`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f0d9fe54815) - Adds
  support to V4 for Team Delete

## 2.5.0

### Minor Changes

- [#36073](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36073)
  [`0bcd129d40c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0bcd129d40c) - Added
  Legion V4 support to Team Client for Team Create

## 2.4.0

### Minor Changes

- [#36048](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36048)
  [`9210c656379`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9210c656379) - PTC-6859
  add missing trace ids into clients

## 2.3.0

### Minor Changes

- [#36024](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36024)
  [`b4fc4121db5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4fc4121db5) - Hook for
  setting up the teams-client

## 2.2.1

### Patch Changes

- [#35908](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35908)
  [`a3da22674b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a3da22674b8) - Replace
  calls to pf-directory `Team` and `TeamMembership` with AGG `teamV2` in Directory app

## 2.2.0

### Minor Changes

- [#35855](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35855)
  [`904b8905d64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/904b8905d64) - Make
  changes to the error handling and search filtering in the all team search endpoint in teams client

## 2.1.3

### Patch Changes

- [#34118](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34118)
  [`2eb438477ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2eb438477ab) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 2.1.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 2.1.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 2.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [#31833](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31833)
  [`e6ea12e81d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6ea12e81d0) - Removing
  V2-V3 related features from teams-client before adoption in products

## 1.0.0

### Major Changes

- [#31229](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31229)
  [`df2108f3366`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df2108f3366) - Release
  initial versions of teams packages

## 0.6.1

### Patch Changes

- [#31074](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31074)
  [`38bc6aa93d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/38bc6aa93d7) - Fixes
  for app config

## 0.6.0

### Minor Changes

- [#30986](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30986)
  [`50a5f0b8f7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50a5f0b8f7d) - Cleaned
  up the entry points and exports of the teams packages

## 0.5.0

### Minor Changes

- [#30890](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30890)
  [`c3170ec4cc0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3170ec4cc0) - Fix some
  routing & nav

## 0.4.0

### Minor Changes

- [#30705](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30705)
  [`0e79795f9d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e79795f9d9) - Abstract
  all clients behind teamsClient

## 0.3.1

### Patch Changes

- [#30321](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30321)
  [`9044c865825`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9044c865825) - Moved
  the teams profile card wrapper and connect to the profile card context

## 0.3.0

### Minor Changes

- [#30078](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30078)
  [`1b10c7b3c04`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b10c7b3c04) - Export
  teams state actions and fix some types

## 0.2.0

### Minor Changes

- [#29767](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29767)
  [`a1149da635c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1149da635c) - Enable
  V3 teams API by default
