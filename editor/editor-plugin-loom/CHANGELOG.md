# @atlaskit/editor-plugin-loom

## 3.1.37

### Patch Changes

- Updated dependencies

## 3.1.36

### Patch Changes

- Updated dependencies

## 3.1.35

### Patch Changes

- Updated dependencies

## 3.1.34

### Patch Changes

- Updated dependencies

## 3.1.33

### Patch Changes

- Updated dependencies

## 3.1.32

### Patch Changes

- Updated dependencies

## 3.1.31

### Patch Changes

- Updated dependencies

## 3.1.30

### Patch Changes

- Updated dependencies

## 3.1.29

### Patch Changes

- Updated dependencies

## 3.1.28

### Patch Changes

- Updated dependencies

## 3.1.27

### Patch Changes

- Updated dependencies

## 3.1.26

### Patch Changes

- Updated dependencies

## 3.1.25

### Patch Changes

- Updated dependencies

## 3.1.24

### Patch Changes

- Updated dependencies

## 3.1.23

### Patch Changes

- [#174866](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174866)
  [`f942caa52a5dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f942caa52a5dd) -
  [ux] Disable the loom plugin while offline.
- Updated dependencies

## 3.1.22

### Patch Changes

- Updated dependencies

## 3.1.21

### Patch Changes

- Updated dependencies

## 3.1.20

### Patch Changes

- [#170473](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170473)
  [`2c463f9682286`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2c463f9682286) -
  ED-25813: refactors plugins to meet folder standards
- Updated dependencies

## 3.1.19

### Patch Changes

- Updated dependencies

## 3.1.18

### Patch Changes

- Updated dependencies

## 3.1.17

### Patch Changes

- Updated dependencies

## 3.1.16

### Patch Changes

- Updated dependencies

## 3.1.15

### Patch Changes

- Updated dependencies

## 3.1.14

### Patch Changes

- Updated dependencies

## 3.1.13

### Patch Changes

- Updated dependencies

## 3.1.12

### Patch Changes

- Updated dependencies

## 3.1.11

### Patch Changes

- Updated dependencies

## 3.1.10

### Patch Changes

- [#158883](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158883)
  [`f0e2b3da18c56`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f0e2b3da18c56) -
  ED-24719 Clean up platform.editor.plugin.loom.responsive-menu_4at4a FF

## 3.1.9

### Patch Changes

- Updated dependencies

## 3.1.8

### Patch Changes

- Updated dependencies

## 3.1.7

### Patch Changes

- [#157550](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157550)
  [`57749c4f9fd9f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57749c4f9fd9f) -
  Add disabled color to Loom icon in editor

## 3.1.6

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18
- Updated dependencies

## 3.1.5

### Patch Changes

- Updated dependencies

## 3.1.4

### Patch Changes

- Updated dependencies

## 3.1.3

### Patch Changes

- [#151581](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151581)
  [`84249bf0ae1c4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/84249bf0ae1c4) -
  Update Loom icon to generic video icon

## 3.1.2

### Patch Changes

- Updated dependencies

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#146891](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146891)
  [`de72f151473eb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/de72f151473eb) -
  [ED-25167] Allow ButtonComponent to accept `rel` prop

### Patch Changes

- Updated dependencies

## 3.0.4

### Patch Changes

- Updated dependencies

## 3.0.3

### Patch Changes

- [#146839](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146839)
  [`5150b3ba1d31d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5150b3ba1d31d) -
  Subscribe to plugin state changes within custom Loom editor toolbar button

## 3.0.2

### Patch Changes

- [#145206](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145206)
  [`cca8cc490ec20`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cca8cc490ec20) -
  [ED-25135] Fix: loom is not initialised correctly if `initLoom` is called when collab-edit plugin
  is not ready

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [#143146](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143146)
  [`8f698f1278514`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f698f1278514) -
  [ux] [ED-24905] Main change: make loom plugin config, loomProvider, optional, and add optional
  config, renderButton, to support customising loom button, e.g. adding pulse, spotlight. This
  change is required to support loom cross-sell flow. In this flow, loom SDK will not be initialised
  unless loomProvider is passed in. Once loomProvider is ready, `initLoom` action can be used to
  initialise SDK. This change should be backwards compatible and will not impact the existing flow.

### Patch Changes

- Updated dependencies

## 2.8.4

### Patch Changes

- Updated dependencies

## 2.8.3

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 2.8.2

### Patch Changes

- Updated dependencies

## 2.8.1

### Patch Changes

- Updated dependencies

## 2.8.0

### Minor Changes

- [#130825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130825)
  [`d8a00de5637ff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d8a00de5637ff) -
  ENGHEALTH-9890: Bumps React peer dependency for Lego editor plugins

### Patch Changes

- Updated dependencies

## 2.7.0

### Minor Changes

- [#129411](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129411)
  [`175fc1454a8a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/175fc1454a8a4) -
  [ux] Migrate typography with new ADS token and primitive and remove feature gate

### Patch Changes

- Updated dependencies

## 2.6.2

### Patch Changes

- Updated dependencies

## 2.6.1

### Patch Changes

- [#127640](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127640)
  [`ccefb817c754a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ccefb817c754a) -
  [ux] Migrate typography with new ADS token and primitive

## 2.6.0

### Minor Changes

- [#126478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126478)
  [`ca1665ebbfe4d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ca1665ebbfe4d) -
  [ED-23435] Store primary toolbar component registry in a plugin variable instead of in plugin
  state to avoid having to add effects to all plugins and enable SSR for the toolbar. [Breaking
  change] Converted registerComponent from the primary toolbar plugin into an action.

### Patch Changes

- Updated dependencies

## 2.5.1

### Patch Changes

- Updated dependencies

## 2.5.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [#121606](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121606)
  [`e06f32518241c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e06f32518241c) -
  Added new action to loom plugin "insertLoom" which allows the user to insert a loom video into the
  document.

### Patch Changes

- Updated dependencies

## 2.3.1

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [#120426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120426)
  [`1cb3869ab1a96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1cb3869ab1a96) -
  [ED-23436] Use editor primary toolbar plugin to structure the primary toolbar

### Patch Changes

- Updated dependencies

## 2.2.15

### Patch Changes

- Updated dependencies

## 2.2.14

### Patch Changes

- Updated dependencies

## 2.2.13

### Patch Changes

- Updated dependencies

## 2.2.12

### Patch Changes

- Updated dependencies

## 2.2.11

### Patch Changes

- Updated dependencies

## 2.2.10

### Patch Changes

- [#109923](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109923)
  [`ed20be4a6f5d5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ed20be4a6f5d5) -
  ED-23511 fix loom and it button responsive
- Updated dependencies

## 2.2.9

### Patch Changes

- Updated dependencies

## 2.2.8

### Patch Changes

- Updated dependencies

## 2.2.7

### Patch Changes

- [#107463](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107463)
  [`5c4e84045a40`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c4e84045a40) -
  [ux] Add responsive label to loom plugin toolbar

## 2.2.6

### Patch Changes

- Updated dependencies

## 2.2.5

### Patch Changes

- Updated dependencies

## 2.2.4

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 2.2.3

### Patch Changes

- Updated dependencies

## 2.2.2

### Patch Changes

- [#96234](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96234)
  [`d414d3e7503b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d414d3e7503b) -
  Update copy for Loom toolbar tooltip item and quickinsert description

## 2.2.1

### Patch Changes

- [#93654](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93654)
  [`19a2873de742`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/19a2873de742) -
  Export loom recordVideo action in loom plugin

## 2.2.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#90626](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90626)
  [`8efec4489602`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8efec4489602) -
  show/hide loom button in toolbar via editor plugin config

### Patch Changes

- [#90878](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90878)
  [`962275ee0910`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/962275ee0910) -
  [ux] [ED-22852] Update loom quick insert title, description and logo
- Updated dependencies

## 2.0.1

### Patch Changes

- [#90526](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90526)
  [`2f75eb73984f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f75eb73984f) -
  [ux] Update toolbar icon to Loom

## 2.0.0

### Major Changes

- [#85470](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/85470)
  [`32cb4d4ca34f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32cb4d4ca34f) -
  Update loom plugin to take in interface and remove SDK references

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386)
  [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) -
  This changeset exists to bump all editor plugins that currently don't have a major version. This
  is to address an issue with Jira plugin consumption.

### Patch Changes

- Updated dependencies

## 0.3.1

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.3.0

### Minor Changes

- [#68790](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68790)
  [`c6d8affc52d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d8affc52d1) -
  Support maybeAdd plugins in usePreset. Add typing support for universal preset.

  Now when using the editor API with the universal preset

### Patch Changes

- Updated dependencies

## 0.2.4

### Patch Changes

- Updated dependencies

## 0.2.3

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238)
  [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) -
  [ED-21835] Change EditorAPI type to always union with undefined

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#59421](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59421)
  [`3747754f8ab0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3747754f8ab0) -
  NO-ISSUE Added the capability to directly trigger an analytics event as an action to the editor
  analytics plugin

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).
