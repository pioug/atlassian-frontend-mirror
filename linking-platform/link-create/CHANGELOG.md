# @atlaskit/link-create

## 1.9.4

### Patch Changes

- Updated dependencies

## 1.9.3

### Patch Changes

- [#43347](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43347) [`378d75bbaad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d75bbaad) - Clean up outer error boundary feature flag
- Updated dependencies

## 1.9.2

### Patch Changes

- Updated dependencies

## 1.9.1

### Patch Changes

- [#43170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43170) [`959e2b89af9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/959e2b89af9) - Change exit warning modal to show only when fields have been modified by user

## 1.9.0

### Minor Changes

- [#43068](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43068) [`76817bfbd5d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76817bfbd5d) - EDM-8402: under a FF platform.linking-platform.link-create.enable-edit internally refactor onCloseComplete hook to be conditionally called when active prop is false

### Patch Changes

- Updated dependencies

## 1.8.1

### Patch Changes

- [#43001](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43001) [`7eed2972d58`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7eed2972d58) - Internal refactor moving show exit warning modal conditions to React context

## 1.8.0

### Minor Changes

- [#42777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42777) [`fe571895d1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe571895d1f) - EDM-8401: Introduce the onComplete props to LinkCreateProps which is a callback function to be called when the link create experience is completed. This prop allows a post-create edit flow to be added into the link create experience before completion.

## 1.7.2

### Patch Changes

- Updated dependencies

## 1.7.1

### Patch Changes

- [#42758](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42758) [`67953559475`](https://bitbucket.org/atlassian/atlassian-frontend/commits/67953559475) - Updates error boundary to captureException to Sentry behind a feature flag.
- Updated dependencies

## 1.7.0

### Minor Changes

- [#42674](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42674) [`2fd5dd27ec2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2fd5dd27ec2) - EDM-8373: export editViewProps type

## 1.6.0

### Minor Changes

- [#42487](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42487) [`0b6245f9d18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b6245f9d18) - EDM-8376: Introduces a editView field to the LinkCreatePlugin interface which will allow plugins to register a screen to edit objects post-creation in a future release.

## 1.5.1

### Patch Changes

- [#42575](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42575) [`d7338b9229e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7338b9229e) - Updates exit warning dialog to fire analytics on open, and button clicks
- [#42553](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42553) [`76b95198067`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76b95198067) - Add error boundary to catch unhandled errors outside the link create modal
- Updated dependencies

## 1.5.0

### Minor Changes

- [#42436](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42436) [`08c8e861177`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08c8e861177) - EDM-8371: internal refactor under feature flag platform.linking-platform.link-create.enable-edit

## 1.4.0

### Minor Changes

- [#42119](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42119) [`fbb3d5ea801`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fbb3d5ea801) - Displays a confirm dismiss dialog when user clicks cancel and made changes to form

## 1.3.0

### Minor Changes

- [#41722](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41722) [`0bcdc0cc988`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0bcdc0cc988) - EDM-8055 Add ARI to link create callback

## 1.2.0

### Minor Changes

- [#42356](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42356) [`db060471faf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db060471faf) - EDM-7905: an internal refactor for a new experimental feature under a feature flag platform.linking-platform.link-create.enable-edit

## 1.1.2

### Patch Changes

- [#41867](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41867) [`2fb6074140b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2fb6074140b) - Add default value to environment variable

## 1.1.1

### Patch Changes

- [#40368](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40368) [`b77b38f55e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b77b38f55e3) - EDM-7921: fire ui analytics event for error component in jira-issue-form and add new error type and handling for NO_JIRA_SITE_FOUND_ERROR

## 1.1.0

### Minor Changes

- [#39079](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39079) [`d3b95d820f7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3b95d820f7) - EDM-7280 Add analytics for Jira link create

## 1.0.3

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162) [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete version.json
- Updated dependencies

## 1.0.2

### Patch Changes

- [#37925](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37925) [`f01deb5e6ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f01deb5e6ab) - Use injected env vars instead of version.json

## 1.0.1

### Patch Changes

- [#38070](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38070) [`572ea7d92bd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/572ea7d92bd) - revised form mutator types

## 1.0.0

### Major Changes

- [#37475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37475) [`687749df97a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/687749df97a) - Refactor form components to use react-final-form

## 0.10.0

### Minor Changes

- [#37341](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37341) [`dc546d1044a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc546d1044a) - Update failure handler in link-create API to take Error instead of string, and fire analytics on failure

## 0.9.1

### Patch Changes

- [#36913](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36913) [`84b33e5a4b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/84b33e5a4b6) - EDM-6544: minor internal refactors with no expected functional change

## 0.9.0

### Minor Changes

- [#36926](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36926) [`c209f670761`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c209f670761) - Improved testIds

## 0.8.2

### Patch Changes

- [#36843](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36843) [`90ad796d91c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/90ad796d91c) - Fix fetching hyphened locales to underscores

## 0.8.1

### Patch Changes

- [#36761](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36761) [`70b0f95345a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70b0f95345a) - Add support for i18n

## 0.8.0

### Minor Changes

- [#36304](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36304) [`f3acb380cb2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3acb380cb2) - EDM-7064: remove FormContextProvider export to prevent usage in external packages.

## 0.7.1

### Patch Changes

- [#35576](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35576) [`41d73aab05c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41d73aab05c) - EDM-6938: pass spaceName into onCreate submit for confluence-create and pass as optional meta data into link-create."

## 0.7.0

### Minor Changes

- [#35134](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35134) [`eb070266532`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb070266532) - Expose Modal callbacks and Add modalTitle to the linkCreate Props

## 0.6.0

### Minor Changes

- [#35035](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35035) [`ac3927f0650`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac3927f0650) - Make modal 480px wide, Update TextField to take isRequired prop w/o default browser validation, remove extra internal spacing in the create form

## 0.5.7

### Patch Changes

- [#34925](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34925) [`ffb87e553ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ffb87e553ea) - Hides the validation error when user edits the field

## 0.5.6

### Patch Changes

- [#34759](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34759) [`a02d619af5c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a02d619af5c) - Changed onCreate to return a possible Promise to hold the create button spinner while submitting

## 0.5.5

### Patch Changes

- [#34750](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34750) [`7b5fb18bb63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b5fb18bb63) - Update screen event to UI

## 0.5.4

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443) [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies

## 0.5.3

### Patch Changes

- [#34463](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34463) [`ae5ac36af00`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae5ac36af00) - Updates analytics codegen to support screen events.

## 0.5.2

### Patch Changes

- [#34207](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34207) [`7734ef0bdb4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7734ef0bdb4) - allowing default values in confluence creation form.

## 0.5.1

### Patch Changes

- [#33671](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33671) [`2d812255401`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d812255401) - EDM-6561: add an autofocus on title field in create modal and change cancel button labeling to close

## 0.5.0

### Minor Changes

- [#33735](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33735) [`ad753581e70`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad753581e70) - [ux] Moves the FormFooter out of CreateForm and provides a new CreateFormLoader component & now we handle the submitting state in the form context

## 0.4.4

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 0.4.3

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 0.4.2

### Patch Changes

- [#33372](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33372) [`93af54caca2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93af54caca2) - EDM-6553: no functionality change, just updating UI so that there is padding between the cancel and create button for link-create. Also updated the dropdown error message.

## 0.4.1

### Patch Changes

- [#33186](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33186) [`3c5946b6cdf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c5946b6cdf) - EDM-6524: remove isRequired prop from textfield in create component as browser validation will not be used, also spread AKTextfield props to stop exposure of testid and placeholder props.

## 0.4.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 0.3.3

### Patch Changes

- [#32602](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32602) [`5cbb3a0f20c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5cbb3a0f20c) - Fix tangerine lint warnings & fix SVG id not unique & add VR test for dropdowns in modal & handle plugin errors

## 0.3.2

### Patch Changes

- [#32501](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32501) [`1600a0d171f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1600a0d171f) - Adds various eslint-ignores for tokens-related warnings

## 0.3.1

### Patch Changes

- [#32659](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32659) [`9e1c1e92771`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e1c1e92771) - Fire analytics

## 0.3.0

### Minor Changes

- [#32457](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32457) [`29dfee4c540`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29dfee4c540) - Adds global error boundary and fixes footer padding

## 0.2.1

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424) [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils
- Updated dependencies

## 0.2.0

### Minor Changes

- [#30840](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30840) [`a765caedf71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a765caedf71) - EDM-5666 Implement Create Confluence Plugin

### Patch Changes

- [`430f0f27c63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/430f0f27c63) - Use FormSection instead of ModalSection

## 0.1.2

### Patch Changes

- [#31972](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31972) [`5da1c8f4422`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5da1c8f4422) - Integrate with link-create-presets

## 0.1.1

### Patch Changes

- [#31721](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31721) [`63acd1bc789`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63acd1bc789) - Update examples with presets

## 0.1.0

### Minor Changes

- [#30674](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30674) [`7e7ca45dbe4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e7ca45dbe4) - Exports LinkCreateProps and LinkCreatePlugin Types

## 0.0.4

### Patch Changes

- [#30194](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30194) [`09697a312bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09697a312bc) - EDM-5657 EDM-5661 Implement Select and Textfield components

## 0.0.3

### Patch Changes

- [#30122](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30122) [`4b8910b3460`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b8910b3460) - Add link-create-confluence package

## 0.0.2

### Patch Changes

- [#29757](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29757) [`d7724023d26`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7724023d26) - Initial version of Create component
