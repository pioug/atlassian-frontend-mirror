# @atlaskit/editor-plugin-limited-mode

## 15.0.10

### Patch Changes

- Updated dependencies

## 15.0.9

### Patch Changes

- Updated dependencies

## 15.0.8

### Patch Changes

- Updated dependencies

## 15.0.7

### Patch Changes

- Updated dependencies

## 15.0.6

### Patch Changes

- Updated dependencies

## 15.0.5

### Patch Changes

- Updated dependencies

## 15.0.4

### Patch Changes

- Updated dependencies

## 15.0.3

### Patch Changes

- Updated dependencies

## 15.0.2

### Patch Changes

- Updated dependencies

## 15.0.1

### Patch Changes

- Updated dependencies

## 15.0.0

### Patch Changes

- Updated dependencies

## 14.1.9

### Patch Changes

- Updated dependencies

## 14.1.8

### Patch Changes

- Updated dependencies

## 14.1.7

### Patch Changes

- Updated dependencies

## 14.1.6

### Patch Changes

- Updated dependencies

## 14.1.5

### Patch Changes

- Updated dependencies

## 14.1.4

### Patch Changes

- Updated dependencies

## 14.1.3

### Patch Changes

- Updated dependencies

## 14.1.2

### Patch Changes

- Updated dependencies

## 14.1.1

### Patch Changes

- Updated dependencies

## 14.1.0

### Minor Changes

- [`aec3fcfe13ff9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/aec3fcfe13ff9) -
  EDITOR-8303 Add runtime input-latency trigger for limited mode behind
  platform_editor_dynamic_limited_mode. Limited mode can now latch mid-session when sustained slow
  input or repeated browser freezes indicate the device is struggling, in addition to the existing
  document-size decision. The latch is one-way. Nothing is constructed when the experiment is off.

  How much evidence is needed is a single tunable, `requiredConfirmations`: that many qualifying
  windows, each separated from the last by `confirmationGapMs`. The hardware no longer feeds into
  the decision — `navigator.hardwareConcurrency` and `navigator.deviceMemory` are reported with the
  `limitedModeLatched` event instead, so which devices latch can be answered from the data rather
  than assumed up front.

  `LimitedModePluginState` gains a derived `enabled` flag, which is now the single thing consumers
  should branch on — the individual reasons (`documentSizeBreachesThreshold`, `latchPolicyBreached`)
  no longer need to be combined at each call site, so a future reason needs no change outside this
  plugin. `sharedState.enabled` reads from it.

  Under the experiment the document decision is also evaluated on load and on document replacement
  only, rather than on every transaction that changes the document. That check walks the whole
  document, so it was a full-document scan per keystroke on exactly the pages least able to afford
  one. The trade-off is that a document editing its way past the thresholds is not re-judged until
  it next loads.

  Consumers updated to react to a mid-session change: table sticky headers now subscribe instead of
  reading once at construction, block-controls resets rather than freezes its state on entry, and
  the expand, media and table nodeviews read the derived flag so they no longer miss a runtime
  latch.

### Patch Changes

- Updated dependencies

## 14.0.0

### Patch Changes

- Updated dependencies

## 13.0.18

### Patch Changes

- Updated dependencies

## 13.0.17

### Patch Changes

- Updated dependencies

## 13.0.16

### Patch Changes

- Updated dependencies

## 13.0.15

### Patch Changes

- Updated dependencies

## 13.0.14

### Patch Changes

- Updated dependencies

## 13.0.13

### Patch Changes

- Updated dependencies

## 13.0.12

### Patch Changes

- Updated dependencies

## 13.0.11

### Patch Changes

- Updated dependencies

## 13.0.10

### Patch Changes

- Updated dependencies

## 13.0.9

### Patch Changes

- Updated dependencies

## 13.0.8

### Patch Changes

- Updated dependencies

## 13.0.7

### Patch Changes

- Updated dependencies

## 13.0.6

### Patch Changes

- Updated dependencies

## 13.0.5

### Patch Changes

- Updated dependencies

## 13.0.4

### Patch Changes

- Updated dependencies

## 13.0.3

### Patch Changes

- Updated dependencies

## 13.0.2

### Patch Changes

- Updated dependencies

## 13.0.1

### Patch Changes

- Updated dependencies

## 13.0.0

### Patch Changes

- Updated dependencies

## 12.0.14

### Patch Changes

- [`df8065dfa9d59`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/df8065dfa9d59) -
  [EDITOR-8302] Behind the `platform_editor_limited_threshold_tweaks` experiment, limited mode
  retunes its document thresholds: the node-count threshold drops from 5,000 to 2,438 — the
  production p99 — so the guard lands on the largest ~1% of documents, and the `doc.nodeSize`
  threshold is raised from 30,000 to 750,000 so it acts as a backstop for pathologically huge
  documents rather than tripping on ordinary long-text pages. Control behaviour is unchanged.

  The decision now lives in a single shared `@atlaskit/editor-common/should-enable-limited-mode`
  module, used by both the limited-mode plugin and the node-anchor provider, instead of two
  hand-synced copies.

- Updated dependencies

## 12.0.13

### Patch Changes

- Updated dependencies

## 12.0.12

### Patch Changes

- Updated dependencies

## 12.0.11

### Patch Changes

- Updated dependencies

## 12.0.10

### Patch Changes

- Updated dependencies

## 12.0.9

### Patch Changes

- Updated dependencies

## 12.0.8

### Patch Changes

- Updated dependencies

## 12.0.7

### Patch Changes

- Updated dependencies

## 12.0.6

### Patch Changes

- Updated dependencies

## 12.0.5

### Patch Changes

- Updated dependencies

## 12.0.4

### Patch Changes

- Updated dependencies

## 12.0.3

### Patch Changes

- Updated dependencies

## 12.0.2

### Patch Changes

- Updated dependencies

## 12.0.1

### Patch Changes

- Updated dependencies

## 12.0.0

### Patch Changes

- Updated dependencies

## 11.0.5

### Patch Changes

- Updated dependencies

## 11.0.4

### Patch Changes

- Updated dependencies

## 11.0.3

### Patch Changes

- Updated dependencies

## 11.0.2

### Patch Changes

- Updated dependencies

## 11.0.1

### Patch Changes

- Updated dependencies

## 11.0.0

### Patch Changes

- Updated dependencies

## 10.0.4

### Patch Changes

- Updated dependencies

## 10.0.3

### Patch Changes

- Updated dependencies

## 10.0.2

### Patch Changes

- Updated dependencies

## 10.0.1

### Patch Changes

- Updated dependencies

## 10.0.0

### Patch Changes

- Updated dependencies

## 9.1.2

### Patch Changes

- Updated dependencies

## 9.1.1

### Patch Changes

- Updated dependencies

## 9.1.0

### Minor Changes

- [`51c33ef5349b6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/51c33ef5349b6) -
  Enable compatibility with React 19.2.0

### Patch Changes

- Updated dependencies

## 9.0.31

### Patch Changes

- Updated dependencies

## 9.0.30

### Patch Changes

- Updated dependencies

## 9.0.29

### Patch Changes

- Updated dependencies

## 9.0.28

### Patch Changes

- Updated dependencies

## 9.0.27

### Patch Changes

- Updated dependencies

## 9.0.26

### Patch Changes

- Updated dependencies

## 9.0.25

### Patch Changes

- Updated dependencies

## 9.0.24

### Patch Changes

- Updated dependencies

## 9.0.23

### Patch Changes

- Updated dependencies

## 9.0.22

### Patch Changes

- Updated dependencies

## 9.0.21

### Patch Changes

- Updated dependencies

## 9.0.20

### Patch Changes

- Updated dependencies

## 9.0.19

### Patch Changes

- Updated dependencies

## 9.0.18

### Patch Changes

- Updated dependencies

## 9.0.17

### Patch Changes

- Updated dependencies

## 9.0.16

### Patch Changes

- Updated dependencies

## 9.0.15

### Patch Changes

- Updated dependencies

## 9.0.14

### Patch Changes

- Updated dependencies

## 9.0.13

### Patch Changes

- Updated dependencies

## 9.0.12

### Patch Changes

- Updated dependencies

## 9.0.11

### Patch Changes

- Updated dependencies

## 9.0.10

### Patch Changes

- Updated dependencies

## 9.0.9

### Patch Changes

- Updated dependencies

## 9.0.8

### Patch Changes

- Updated dependencies

## 9.0.7

### Patch Changes

- Updated dependencies

## 9.0.6

### Patch Changes

- Updated dependencies

## 9.0.5

### Patch Changes

- Updated dependencies

## 9.0.4

### Patch Changes

- Updated dependencies

## 9.0.3

### Patch Changes

- Updated dependencies

## 9.0.2

### Patch Changes

- Updated dependencies

## 9.0.1

### Patch Changes

- Updated dependencies

## 9.0.0

### Major Changes

- [`f2dc9097319f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2dc9097319f0) - ###
  Dropped support for _legacy_ Typescript 4 types. **Typescript 5 is now the new minimum**.

  Removes the `typesVersions` property and `dist/types-ts4.5` directory from the dist.

  Types are now exclusively via the `"types": "dist/types/index.d.ts"` property.

  ```diff
  - "typesVersions": {
  -    ">=4.5 <4.9": {
  -        "*": [
  -            "dist/types-ts4.5/*",
  -            "dist/types-ts4.5/index.d.ts"
  -        ]
  -    }
  - },
  ```

### Patch Changes

- Updated dependencies

## 8.0.15

### Patch Changes

- Updated dependencies

## 8.0.14

### Patch Changes

- Updated dependencies

## 8.0.13

### Patch Changes

- Updated dependencies

## 8.0.12

### Patch Changes

- Updated dependencies

## 8.0.11

### Patch Changes

- Updated dependencies

## 8.0.10

### Patch Changes

- Updated dependencies

## 8.0.9

### Patch Changes

- Updated dependencies

## 8.0.8

### Patch Changes

- Updated dependencies

## 8.0.7

### Patch Changes

- Updated dependencies

## 8.0.6

### Patch Changes

- Updated dependencies

## 8.0.5

### Patch Changes

- Updated dependencies

## 8.0.4

### Patch Changes

- Updated dependencies

## 8.0.3

### Patch Changes

- Updated dependencies

## 8.0.2

### Patch Changes

- Updated dependencies

## 8.0.1

### Patch Changes

- Updated dependencies

## 8.0.0

### Patch Changes

- Updated dependencies

## 7.2.7

### Patch Changes

- Updated dependencies

## 7.2.6

### Patch Changes

- Updated dependencies

## 7.2.5

### Patch Changes

- Updated dependencies

## 7.2.4

### Patch Changes

- Updated dependencies

## 7.2.3

### Patch Changes

- Updated dependencies

## 7.2.2

### Patch Changes

- Updated dependencies

## 7.2.1

### Patch Changes

- Updated dependencies

## 7.2.0

### Minor Changes

- [`a94a013546f69`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a94a013546f69) -
  Autofix: add explicit package exports (barrel removal)

## 7.1.14

### Patch Changes

- Updated dependencies

## 7.1.13

### Patch Changes

- Updated dependencies

## 7.1.12

### Patch Changes

- Updated dependencies

## 7.1.11

### Patch Changes

- Updated dependencies

## 7.1.10

### Patch Changes

- Updated dependencies

## 7.1.9

### Patch Changes

- Updated dependencies

## 7.1.8

### Patch Changes

- Updated dependencies

## 7.1.7

### Patch Changes

- Updated dependencies

## 7.1.6

### Patch Changes

- Updated dependencies

## 7.1.5

### Patch Changes

- Updated dependencies

## 7.1.4

### Patch Changes

- Updated dependencies

## 7.1.3

### Patch Changes

- Updated dependencies

## 7.1.2

### Patch Changes

- Updated dependencies

## 7.1.1

### Patch Changes

- Updated dependencies

## 7.1.0

### Minor Changes

- [`f25ff7f70d948`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f25ff7f70d948) -
  FFCLEANUP-91667 Remove shipped limited-mode experiment from Statsig config; use fixed document
  thresholds in editor-common for limited-mode detection.

### Patch Changes

- Updated dependencies

## 7.0.3

### Patch Changes

- Updated dependencies

## 7.0.2

### Patch Changes

- Updated dependencies

## 7.0.1

### Patch Changes

- Updated dependencies

## 7.0.0

### Major Changes

- [`901c87a57486e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/901c87a57486e) -
  Removed `react-intl-next` alias and replaced all usages with `react-intl` directly.

  What changed: The `react-intl-next` npm alias (which resolved to `react-intl@^5`) has been
  removed. All imports now reference `react-intl` directly, and `peerDependencies` have been updated
  to `"^5.25.1 || ^6.0.0 || ^7.0.0"`.

  How consumer should update their code: Ensure `react-intl` is installed at a version satisfying
  `^5.25.1 || ^6.0.0 || ^7.0.0`. If your application was using `react-intl-next` as an npm alias, it
  can be safely removed. Replace any remaining `react-intl-next` imports with `react-intl`.

### Patch Changes

- Updated dependencies

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.0.30

### Patch Changes

- Updated dependencies

## 5.0.29

### Patch Changes

- Updated dependencies

## 5.0.28

### Patch Changes

- Updated dependencies

## 5.0.27

### Patch Changes

- Updated dependencies

## 5.0.26

### Patch Changes

- Updated dependencies

## 5.0.25

### Patch Changes

- Updated dependencies

## 5.0.24

### Patch Changes

- Updated dependencies

## 5.0.23

### Patch Changes

- [`14803a836f641`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/14803a836f641) -
  Update README.md and 0-intro.tsx

## 5.0.22

### Patch Changes

- [`d1a0ee6dbcefd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d1a0ee6dbcefd) -
  Clean up feature gate platform_editor_native_anchor_patch_2
- Updated dependencies

## 5.0.21

### Patch Changes

- Updated dependencies

## 5.0.20

### Patch Changes

- Updated dependencies

## 5.0.19

### Patch Changes

- Updated dependencies

## 5.0.18

### Patch Changes

- Updated dependencies

## 5.0.17

### Patch Changes

- Updated dependencies

## 5.0.16

### Patch Changes

- Updated dependencies

## 5.0.15

### Patch Changes

- Updated dependencies

## 5.0.14

### Patch Changes

- Updated dependencies

## 5.0.13

### Patch Changes

- Updated dependencies

## 5.0.12

### Patch Changes

- [`5892e575833a1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5892e575833a1) -
  Internal changes to remove unnecessary token fallbacks and imports from `@atlaskit/theme`
- Updated dependencies

## 5.0.11

### Patch Changes

- Updated dependencies

## 5.0.10

### Patch Changes

- Updated dependencies

## 5.0.9

### Patch Changes

- Updated dependencies

## 5.0.8

### Patch Changes

- Updated dependencies

## 5.0.7

### Patch Changes

- Updated dependencies

## 5.0.6

### Patch Changes

- Updated dependencies

## 5.0.5

### Patch Changes

- Updated dependencies

## 5.0.4

### Patch Changes

- Updated dependencies

## 5.0.3

### Patch Changes

- Updated dependencies

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- Updated dependencies

## 5.0.0

### Patch Changes

- Updated dependencies

## 4.0.21

### Patch Changes

- Updated dependencies

## 4.0.20

### Patch Changes

- Updated dependencies

## 4.0.19

### Patch Changes

- Updated dependencies

## 4.0.18

### Patch Changes

- Updated dependencies

## 4.0.17

### Patch Changes

- Updated dependencies

## 4.0.16

### Patch Changes

- Updated dependencies

## 4.0.15

### Patch Changes

- Updated dependencies

## 4.0.14

### Patch Changes

- Updated dependencies

## 4.0.13

### Patch Changes

- Updated dependencies

## 4.0.12

### Patch Changes

- Updated dependencies

## 4.0.11

### Patch Changes

- Updated dependencies

## 4.0.10

### Patch Changes

- Updated dependencies

## 4.0.9

### Patch Changes

- Updated dependencies

## 4.0.8

### Patch Changes

- Updated dependencies

## 4.0.7

### Patch Changes

- Updated dependencies

## 4.0.6

### Patch Changes

- [`49dad8567c387`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/49dad8567c387) -
  EDITOR-4948 - Change performance mode threshold condition to include doc size, node count, and LCM
  check.
- Updated dependencies

## 4.0.5

### Patch Changes

- Updated dependencies

## 4.0.4

### Patch Changes

- Updated dependencies

## 4.0.3

### Patch Changes

- [`256b4fc86bae0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/256b4fc86bae0) -
  [ux] EDITOR-4464 Limited Mode: Change threshold to activate limited mode to use the node count
  rather than the raw document size.
- Updated dependencies

## 4.0.2

### Patch Changes

- [`2c3c92548bb9c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2c3c92548bb9c) -
  EDITOR-4639 cleanup cc_editor_limited_mode, cc_editor_limited_mode_include_lcm and unshipped code.
- Updated dependencies

## 4.0.1

### Patch Changes

- [`e0bc30ca14a41`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e0bc30ca14a41) -
  EDITOR-4465 - Add killSwitchEnabled option to disable performance/limited mode via Statsig
  configuration.
- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.2.0

### Minor Changes

- [`6668fda9b38d7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6668fda9b38d7) -
  ED-29716 add limited mode support to native anchor

### Patch Changes

- Updated dependencies

## 3.1.6

### Patch Changes

- Updated dependencies

## 3.1.5

### Patch Changes

- Updated dependencies

## 3.1.4

### Patch Changes

- Updated dependencies

## 3.1.3

### Patch Changes

- [`55920a92e882a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/55920a92e882a) -
  tsignores added for help-center local consumpton removed
- Updated dependencies

## 3.1.2

### Patch Changes

- Updated dependencies

## 3.1.1

### Patch Changes

- [`4d676bbdb3ce6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4d676bbdb3ce6) -
  ts-ignore added temporarily to unblock local consumption for help-center, will be removed once
  project refs are setup
- Updated dependencies

## 3.1.0

### Minor Changes

- [`c6c113481c118`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c6c113481c118) -
  Updates limited mode to include lcm sizes in decision to engage.

### Patch Changes

- Updated dependencies

## 3.0.4

### Patch Changes

- Updated dependencies

## 3.0.3

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- [`c59b674ee234d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c59b674ee234d) -
  NOISSUE - Update limited mode messages and move to editor-common so they can be picked up for
  translation.
- Updated dependencies

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [`a471e1e42004e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a471e1e42004e) -
  [ux] ED-29329: Remove limited mode banner and replace with a limited mode flag, reusing
  confluence's flag setup.

### Patch Changes

- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [`f0664ee77d680`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0664ee77d680) -
  ED-29201 Limited Mode: Undefined error in our limited mode enabled getter when trying to get
  documentSizeBreachesThreshold from plugin state.
- Updated dependencies

## 1.0.1

### Patch Changes

- [`b6192b3a69e94`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b6192b3a69e94) -
  ED-29194 Limited mode banner: add handling for live-to-live page transitions where the editor is
  reused and has a transaction meta "replaceDocument"
- Updated dependencies

## 1.0.0

### Patch Changes

- Updated dependencies

## 0.0.3

### Patch Changes

- [`e33be5daddd2b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e33be5daddd2b) -
  ED-28892 Limited mode: adjust how we're triggering cleanup logic for block control plugin. Hook up
  banner. Other misc setup.
- Updated dependencies

## 0.0.2

### Patch Changes

- Updated dependencies

## 0.0.1

### Patch Changes

- Updated dependencies
