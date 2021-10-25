# @atlaskit/share

## 0.31.1

### Patch Changes

- [`b85e7ce12cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b85e7ce12cd) - Internal upgrade of memoize-one to 6.0.0

## 0.31.0

### Minor Changes

- [`ac8d6861881`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac8d6861881) - [ux] expose copyTooltipText and onDialogClose props to share component

## 0.30.0

### Minor Changes

- [`bc36730eba5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc36730eba5) - remove disableInviteCapabilities prop for Share components

## 0.29.1

### Patch Changes

- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Internal changes to remove `@atlaskit/theme/math` usage.
- Updated dependencies

## 0.29.0

### Minor Changes

- [`75f940df1ce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/75f940df1ce) - Update ProductID list to accept more valid Jira subproducts

## 0.28.0

### Minor Changes

- [`93b425ba29d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93b425ba29d) - Accept "jira" as a ProductId to handle experiences that don't belong to a particular Jira Subproduct

## 0.27.1

### Patch Changes

- [`310c94eb3c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/310c94eb3c3) - [ux] Pass configuration to the ShareServiceClient when the component instantiates it

## 0.27.0

### Minor Changes

- [`adf513ae754`](https://bitbucket.org/atlassian/atlassian-frontend/commits/adf513ae754) - [ux] Removing invitation capabilities of the Share component

### Patch Changes

- Updated dependencies

## 0.26.13

### Patch Changes

- [`e178114aea5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e178114aea5) - Merging parent intl-provider messages with share intl-provider - to support i18n in components passed as props such as a custom footer

## 0.26.12

### Patch Changes

- [`5995bf12959`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5995bf12959) - Merging parent intl-provider messages with share intl-provider - to support i18n in components passed as props such as a custom footer

## 0.26.11

### Patch Changes

- [`524b20aff9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/524b20aff9a) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs
- [`3c0349f272a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c0349f272a) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs
- [`591d34f966f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/591d34f966f) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs

## 0.26.10

### Patch Changes

- Updated dependencies

## 0.26.9

### Patch Changes

- [`c74cf22db0e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c74cf22db0e) - Declarative entry points, removes auto-generated i18n entry point

## 0.26.8

### Patch Changes

- Updated dependencies

## 0.26.7

### Patch Changes

- [`d288a9efa56`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d288a9efa56) - Bumping user picker in shares for translation bugfix

## 0.26.6

### Patch Changes

- Updated dependencies

## 0.26.5

### Patch Changes

- [`be80d157d5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be80d157d5f) - Update internal component usage
- Updated dependencies

## 0.26.4

### Patch Changes

- [`f310ccbe522`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f310ccbe522) - Updated AK examples to use new jdog cloudid

## 0.26.3

### Patch Changes

- [`cc8196efa6f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc8196efa6f) - Add attribute for tests

## 0.26.2

### Patch Changes

- [`3093cc9c0e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3093cc9c0e4) - Update analytics for the split button experiment

## 0.26.1

### Patch Changes

- [`f4a6138b7aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4a6138b7aa) - Fix share button not rendering when integrations provided

## 0.26.0

### Minor Changes

- [`044fc424693`](https://bitbucket.org/atlassian/atlassian-frontend/commits/044fc424693) - [ux] Remove Share to slack and adds split button feature which allows for multiple integrations to be added to the share button

## 0.25.0

### Minor Changes

- [`b62dbfe883a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b62dbfe883a) - Add new optional attribute isDisabled which will disbale copy-link and share-button.

## 0.24.4

### Patch Changes

- [`b90bb8af61`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90bb8af61) - ED-11101 fix tab issue to set the focus straight to the Invite To Edit button
- Updated dependencies

## 0.24.3

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 0.24.2

### Patch Changes

- Updated dependencies

## 0.24.1

### Patch Changes

- [`da7bf820f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/da7bf820f4) - Bumping user picker in share to fix email PII exposure

## 0.24.0

### Minor Changes

- [`ada07884c2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ada07884c2) - Send ARI with CopyLink click event to analytics-system

## 0.23.5

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 0.23.4

### Patch Changes

- [`de40912b0a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de40912b0a) - Fix types not resolving correctly due to an incorrect types path in package.json

## 0.23.3

### Patch Changes

- Updated dependencies

## 0.23.2

### Patch Changes

- [`66481c4270`](https://bitbucket.org/atlassian/atlassian-frontend/commits/66481c4270) - Fixed public links analytics events and bugs

## 0.23.1

### Patch Changes

- [`c0533f4b35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0533f4b35) - Upgrade analytics-next to prevent event loss (https://hello.atlassian.net/wiki/spaces/AFP/blog/2020/08/26/828144759/ACTION+REQUIRED+-+upgrade+analytics-next+to+prevent+event+loss)
- Updated dependencies

## 0.23.0

### Minor Changes

- [`bc02807f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc02807f68) - In public link mode, invite related wording is omitted

## 0.22.5

### Patch Changes

- [`83b9759009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83b9759009) - Add public links analytics

## 0.22.4

### Patch Changes

- Updated dependencies

## 0.22.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 0.22.2

### Patch Changes

- Updated dependencies

## 0.22.1

### Patch Changes

- [`eeb82e0bd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eeb82e0bd4) - Set loadUserOptions optional so that consumers won't need to pass in loadUserOptions when smart user picker is enabled.

## 0.22.0

### Minor Changes

- [`b35e9baef6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b35e9baef6) - Add public link mode to share component which changes texts of Send and Copy buttons

## 0.21.2

### Patch Changes

- [`d03bff2147`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d03bff2147) - updated translations

## 0.21.1

### Patch Changes

- [`872628440c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/872628440c) - Map groups through to picker results

## 0.21.0

### Minor Changes

- [`51aca36965`](https://bitbucket.org/atlassian/atlassian-frontend/commits/51aca36965) - Added includeGroups prop for the retrieval of confluence groups in smart user picker

### Patch Changes

- Updated dependencies

## 0.20.0

### Minor Changes

- [`d8aec9a0f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8aec9a0f8) - Fixed visual regression with Select dropdown caussing scrollbars to appears inside the PopUp, now using a portal element. For @atlaskit/user-picker ability to pass down `portalElement` has been added.

### Patch Changes

- Updated dependencies

## 0.19.0

### Minor Changes

- [`6eeb86da1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eeb86da1e) - Swapping the use of @atlaskit/inline-dialog in favour of @atlaskit/popup and adding a "dialogBoundariesElement" prop that is passed down to the Popup.

## 0.18.1

### Patch Changes

- [`a821deced3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a821deced3) - Add debounce prop to share. Bump user picker version which introduces analytics fix.

## 0.18.0

### Minor Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 0.17.1

### Patch Changes

- [`957b3e95cb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/957b3e95cb) - Upgrade user picker version in share

## 0.17.0

### Minor Changes

- [`b6a673bb27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6a673bb27) - Add smart user picker prop for share dialog. Only works if enableSmartUserPicker is true and product = 'jira'.

  Fix maxPickerHeight prop in user-picker to work (previously was maxGrowHeight in styles but the prop was called maxPickerHeight).

  Fix alignment issues of tags inside user-picker.

  Enable deletion animation for user-picker.

## 0.16.0

### Minor Changes

- [`ea13555079`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea13555079) - Adding managing expanded and collapsed state from a11y perspective, adding unit tests

## 0.15.0

### Minor Changes

- [`26a1813cd9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/26a1813cd9) - Added the `shortLinkData` prop to use the new link shortening API

## 0.14.2

### Patch Changes

- [`4ee1ba1585`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ee1ba1585) - Add maxPickerHeight to the user picker which sets the maximum height that the user picker can grow up to because of the picked items. Modified subtle prop version of user picker. When subtle, the user picker's border will be removed. The background color will remain the same (Grey N10). These changes were spurred by recent style changes in user picker, which impacted the style of the shares dialog.
  Consumers need to be aware of whether an infinitely growing number of users in the user picker can affect their styling. If it does, they will need to provide a suitable maxPickerHeight. Consumers who also wish for a borderless user picker must set the subtle prop to true.

  Change the background color from N10 to N20 to align with other select background colors.

  In share dialog, set the maxPickerHeight prop to 102 for the user picker.

- Updated dependencies

## 0.14.1

### Patch Changes

- Updated dependencies

## 0.14.0

### Minor Changes

- [`70ed335404`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70ed335404) - Add onDialogOpen callback to share dialog

## 0.13.2

### Patch Changes

- [`0b17f23567`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b17f23567) - Fix text overflowing share to slack onboarding footer

## 0.13.1

### Patch Changes

- [`649f69b6d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/649f69b6d7) - Patch all packages that are used by confluence that have a broken es2019 dist

## 0.13.0

### Minor Changes

- [`a9ea8ed10e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a9ea8ed10e) - Add prop to display custom footer below share form fields, bubble up share form user picker onChange event

## 0.12.8

### Patch Changes

- [`131cee6d7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/131cee6d7a) - Add missing tslib dependency
- Updated dependencies

## 0.12.7

### Patch Changes

- [patch][9aa1ca1910](https://bitbucket.org/atlassian/atlassian-frontend/commits/9aa1ca1910):

  Fixes a jank caused by the race condition between bottomMessage and slack Onboarding

## 0.12.6

### Patch Changes

- [patch][34d796dd6f](https://bitbucket.org/atlassian/atlassian-frontend/commits/34d796dd6f):

  Allows share userpicker to overflow outside the modal

## 0.12.5

### Patch Changes

- [patch][ca2c9cb504](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca2c9cb504):

  Reduce workspace and person selectors height to fit inside of the share modal- [patch][38e8f5ea8b](https://bitbucket.org/atlassian/atlassian-frontend/commits/38e8f5ea8b):

  Fixed share to slack onboarding banner dismissal by changing focus from user selector- [patch][5998511485](https://bitbucket.org/atlassian/atlassian-frontend/commits/5998511485):

  Turn off accent filtering in share to slack person or channel select to speed up performance on large workspaces- [patch][12c341c2dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/12c341c2dd):

  Add source prop to analytics event generated by component

## 0.12.4

### Patch Changes

- [patch][4ed30fe37e](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ed30fe37e):

  Add form validation to share to slack- [patch][76cf5c71a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/76cf5c71a0):

  Block workspace selector in share when conversations are loading- [patch][c5dab3fdc8](https://bitbucket.org/atlassian/atlassian-frontend/commits/c5dab3fdc8):

  Fetch conversations for default slack team- [patch][442971a7f5](https://bitbucket.org/atlassian/atlassian-frontend/commits/442971a7f5):

  Bug fix for onboarding dismissed event firing multiple times on user name input- [patch][b8ec6bf433](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8ec6bf433):

## 0.12.3

### Patch Changes

- [patch][2ace4c0fa9](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ace4c0fa9):

  Fix header appearance in Jira- [patch][025d045d1a](https://bitbucket.org/atlassian/atlassian-frontend/commits/025d045d1a):

  Fix visual issues in Internet Explorer

## 0.12.2

### Patch Changes

- [patch][c135c07776](https://bitbucket.org/atlassian/atlassian-frontend/commits/c135c07776):

  Import type from @atlaskit/select instead of react-select

## 0.12.1

### Patch Changes

- [patch][94557f5015](https://bitbucket.org/atlassian/atlassian-frontend/commits/94557f5015):

  Slack onboarding will be dismissed on name input change- [patch][424ba3fbc4](https://bitbucket.org/atlassian/atlassian-frontend/commits/424ba3fbc4):

  Remember last selected Slack team

## 0.12.0

### Minor Changes

- [minor][62583b6292](https://bitbucket.org/atlassian/atlassian-frontend/commits/62583b6292):

  shareSlackModal back button analytics event bugfix, do no show dismiss banner if no slack teams found- [minor][cd56f6eb4d](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd56f6eb4d):

  Remove rounded border on share to slack dismiss banner- [minor][a5c52a584d](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5c52a584d):

  Copy, Design and minor bug fixes in share to slack, bottomMessage will be hidden while the Slack onboarding banner is showing- [minor][b269639f93](https://bitbucket.org/atlassian/atlassian-frontend/commits/b269639f93):

  Added analytics events for Share

### Patch Changes

- [patch][35910b842f](https://bitbucket.org/atlassian/atlassian-frontend/commits/35910b842f):

  New Share to Slack UI wired up to experiment api calls and mock data for share to slack- [patch][371ec60ce2](https://bitbucket.org/atlassian/atlassian-frontend/commits/371ec60ce2):

  Slack API bug fixes- Updated dependencies [35910b842f](https://bitbucket.org/atlassian/atlassian-frontend/commits/35910b842f):

  - @atlaskit/util-data-test@13.2.0

## 0.11.0

### Minor Changes

- [minor][0e5d6da3d0](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e5d6da3d0):

  New prop to enable share to slack

### Patch Changes

- [patch][b3813fa945](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3813fa945):

  Onboarding message for share to slack mode- [patch][0e0364181b](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e0364181b):

  made footer full-width- Updated dependencies [294c05bcdf](https://bitbucket.org/atlassian/atlassian-frontend/commits/294c05bcdf):

- Updated dependencies [4bec09aa74](https://bitbucket.org/atlassian/atlassian-frontend/commits/4bec09aa74):
- Updated dependencies [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies [bdf25b1c4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdf25b1c4c):
- Updated dependencies [645918eda6](https://bitbucket.org/atlassian/atlassian-frontend/commits/645918eda6):
- Updated dependencies [fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):
  - @atlaskit/form@7.2.0
  - @atlaskit/editor-test-helpers@11.0.0
  - @atlaskit/docs@8.5.0

## 0.10.0

### Minor Changes

- [minor][2a6727a5ad](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a6727a5ad):

  Prop to change the Share button icon

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [5e3aab8e77](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e3aab8e77):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/util-data-test@13.1.2
  - @atlaskit/editor-test-helpers@10.6.1
  - @atlaskit/button@13.3.9
  - @atlaskit/flag@12.3.10
  - @atlaskit/form@7.1.5
  - @atlaskit/inline-dialog@12.1.11
  - @atlaskit/section-message@4.1.7
  - @atlaskit/select@11.0.9
  - @atlaskit/toggle@8.1.6
  - @atlaskit/tooltip@15.2.5

## 0.9.2

### Patch Changes

- [patch][034ade712f](https://bitbucket.org/atlassian/atlassian-frontend/commits/034ade712f):

  Fix broken styles in the 0.7.x version because AK Form package introduced breaking styles- Updated dependencies [eaad41d56c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eaad41d56c):

- Updated dependencies [9d6b02c04f](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d6b02c04f):
- Updated dependencies [8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):
- Updated dependencies [5ecbbaadb3](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ecbbaadb3):
- Updated dependencies [c12ba5eb3e](https://bitbucket.org/atlassian/atlassian-frontend/commits/c12ba5eb3e):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
  - @atlaskit/form@7.1.3
  - @atlaskit/editor-test-helpers@10.6.0
  - @atlaskit/flag@12.3.8
  - @atlaskit/icon@20.0.2

## 0.9.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/field-text-area@7.0.1
  - @atlaskit/flag@12.3.7
  - @atlaskit/form@7.1.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/inline-dialog@12.1.9
  - @atlaskit/section-message@4.1.5
  - @atlaskit/select@11.0.7
  - @atlaskit/theme@9.5.1
  - @atlaskit/toggle@8.1.4
  - @atlaskit/tooltip@15.2.3
  - @atlaskit/editor-test-helpers@10.5.1
  - @atlaskit/user-picker@4.2.2
  - @atlaskit/util-data-test@13.1.1
  - @atlaskit/util-service-support@5.0.1

## 0.9.0

### Minor Changes

- [minor][cf39b8a2a9](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf39b8a2a9):

  Adds prop to allow to content perms to be displayed in Share dialog form

### Patch Changes

- Updated dependencies [3b19e30129](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b19e30129):
- Updated dependencies [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):
- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/editor-test-helpers@10.5.0
  - @atlaskit/field-text-area@7.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/form@7.1.1
  - @atlaskit/user-picker@4.2.1
  - @atlaskit/flag@12.3.6
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/inline-dialog@12.1.8
  - @atlaskit/select@11.0.6
  - @atlaskit/tooltip@15.2.2

## 0.8.0

### Minor Changes

- [minor][0aa121c69e](https://bitbucket.org/atlassian/atlassian-frontend/commits/0aa121c69e):

  Adds a prop to force open Share dialog- [minor][894aa4ea8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/894aa4ea8c):

  Prop to add footer for share dialog

### Patch Changes

- Updated dependencies [ff32b3db47](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff32b3db47):
- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
- Updated dependencies [cfcd27b2e4](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfcd27b2e4):
- Updated dependencies [ec929ab10e](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec929ab10e):
  - @atlaskit/form@7.1.0
  - @atlaskit/docs@8.3.0
  - @atlaskit/editor-test-helpers@10.4.3

## 0.7.3

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Pull in update to form to fix a bug which could cause the internal fieldId to be incorrectly set- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Form has been converted to Typescript. TypeScript consumers will now get static type safety. Flow types are no longer provided. No API changes.- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/user-picker@4.2.0
  - @atlaskit/tooltip@15.2.0
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/select@11.0.3
  - @atlaskit/form@7.0.0
  - @atlaskit/field-text-area@6.0.15
  - @atlaskit/inline-dialog@12.1.6

## 0.7.2

### Patch Changes

- [patch][ea75c17b3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea75c17b3a):

  internal typescript fixes

## 0.7.1

### Patch Changes

- [patch][30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):

  @atlaskit/select has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 0.7.0

### Minor Changes

- [minor][4e487b59a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e487b59a1):

  Add new optional prop "product" to control different messages between Jira and Confluence

## 0.6.15

### Patch Changes

- [patch][08bd743fa1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08bd743fa1):

  Show invite message for admins and trusted users sharing to an email

## 0.6.14

- Updated dependencies [42a92cad4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42a92cad4e):
  - @atlaskit/util-data-test@13.0.1
  - @atlaskit/util-service-support@5.0.0

## 0.6.13

### Patch Changes

- [patch][c714d73a8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c714d73a8b):

  Updated translations from Smartling- [patch][6441adad13](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6441adad13):

  Update translations for Share component

## 0.6.12

- Updated dependencies [bd94b1d552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd94b1d552):
- Updated dependencies [ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):
  - @atlaskit/user-picker@4.1.3
  - @atlaskit/util-data-test@13.0.0
  - @atlaskit/i18n-tools@0.6.0
  - @atlaskit/util-service-support@4.1.0
  - @atlaskit/editor-test-helpers@10.1.2

## 0.6.11

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 0.6.10

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 0.6.9

### Patch Changes

- [patch][5277ce70fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5277ce70fd):

  Updated placeholder and error text for groups

## 0.6.8

- Updated dependencies [80adfefba2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80adfefba2):
  - @atlaskit/editor-test-helpers@10.0.0

## 0.6.7

### Patch Changes

- [patch][c8bb1c7896](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8bb1c7896):

  Fix some packages having a 'modules' field in package.json rather than 'module'

## 0.6.6

### Patch Changes

- [patch][f69c99217c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f69c99217c):

  The tooltip is now closed when user clicks on the share button (so it does not remains forever visible)

## 0.6.5

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 0.6.4

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 0.6.3

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 0.6.2

### Patch Changes

- [patch][abee1a5f4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abee1a5f4f):

  Bumping internal dependency (memoize-one) to latest version (5.1.0). memoize-one@5.1.0 has full typescript support so it is recommended that typescript consumers use it also.

## 0.6.1

### Patch Changes

- [patch][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

  Analytics-next has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No behavioural changes.

  **Breaking changes**

  - `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
  - `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

  **Breaking changes to TypeScript annotations**

  - `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source code
  - Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match source code
  - Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match source code
  - Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
  - Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
  - Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
  - Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
  - Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
  - Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 0.6.0

### Minor Changes

- [minor][bc0d3bf0b2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bc0d3bf0b2):

  added tooltip support for elements/share

## 0.5.16

### Patch Changes

- [patch][ebfeb03eb7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebfeb03eb7):

  popper has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 0.5.15

- Updated dependencies [7e9d653278](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e9d653278):
  - @atlaskit/form@6.1.5
  - @atlaskit/toggle@8.0.0

## 0.5.14

### Patch Changes

- [patch][8fb78b50c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fb78b50c8):

  Error boundary added with analytics, various cleanups

## 0.5.13

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 0.5.12

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 0.5.11

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 0.5.10

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

  TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps of the returned component.

  Before:

  ```typescript
  withAnalyticsEvents()(Button) as ComponentClass<Props>;
  ```

  After:

  ```typescript
  withAnalyticsEvents<Props>()(Button);
  ```

## 0.5.9

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/button@13.0.11
  - @atlaskit/form@6.1.4
  - @atlaskit/inline-dialog@12.0.5
  - @atlaskit/user-picker@4.0.13
  - @atlaskit/select@10.0.0

## 0.5.8

### Patch Changes

- [patch][540b9336e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/540b9336e9):

  FS-4008 add shareeAction

## 0.5.7

### Patch Changes

- [patch][adcabaf0cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/adcabaf0cd):

  FS-4025 add contentType attribute to copyShareLink event

## 0.5.6

### Patch Changes

- [patch][469b504df8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/469b504df8):

  feat: better short url analytics

## 0.5.5

### Patch Changes

- [patch][d6d7086f3f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6d7086f3f):

  feat: intelligently default to current page URL, even if there is a PWA navigation

## 0.5.4

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/form@6.1.1
  - @atlaskit/flag@12.0.10
  - @atlaskit/inline-dialog@12.0.3
  - @atlaskit/select@9.1.8
  - @atlaskit/toggle@7.0.3
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/editor-test-helpers@9.5.2
  - @atlaskit/user-picker@4.0.12
  - @atlaskit/icon@19.0.0

## 0.5.3

### Patch Changes

- [patch][5212dd363e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5212dd363e):

  feat: new analytics around URL shortening (+internal refactors)

## 0.5.2

### Patch Changes

- [patch][db798d5186](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/db798d5186):

  fix: handle an "is mounted" path

## 0.5.1

### Patch Changes

- [patch][b53dd55ae8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b53dd55ae8):

  fix: invalid property being used in URL shortener client

## 0.5.0

### Minor Changes

- [minor][dc965edbe6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc965edbe6):

  BREAKING new optional URL shortening feature (prop change needed)

## 0.4.17

### Patch Changes

- [patch][86e8cc40b7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86e8cc40b7):

  FS-3948 add translations

## 0.4.16

### Patch Changes

- [patch][068e17f712](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/068e17f712):

  FS-3966 add bottomMessage property

## 0.4.15

### Patch Changes

- [patch][6fba3189dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6fba3189dd):

  internal refactor: remove getDerivedStateFromProps in favor of memoization

## 0.4.14

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/form@6.0.6
  - @atlaskit/icon@18.0.1
  - @atlaskit/select@9.1.6
  - @atlaskit/user-picker@4.0.4
  - @atlaskit/tooltip@15.0.0

## 0.4.13

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/flag@12.0.4
  - @atlaskit/form@6.0.5
  - @atlaskit/inline-dialog@12.0.1
  - @atlaskit/section-message@4.0.2
  - @atlaskit/select@9.1.5
  - @atlaskit/toggle@7.0.1
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/editor-test-helpers@9.3.9
  - @atlaskit/user-picker@4.0.3
  - @atlaskit/icon@18.0.0

## 0.4.12

### Patch Changes

- [patch][e6c0741a32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6c0741a32):

  fix incorrect origin tracing in analytics + small internal cleanups

## 0.4.11

- Updated dependencies [181209d135](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/181209d135):
  - @atlaskit/inline-dialog@12.0.0

## 0.4.10

- Updated dependencies [238b65171f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/238b65171f):
  - @atlaskit/flag@12.0.0

## 0.4.9

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/field-text-area@6.0.1
  - @atlaskit/form@6.0.2
  - @atlaskit/icon@17.1.1
  - @atlaskit/theme@9.0.2
  - @atlaskit/user-picker@4.0.1
  - @atlaskit/section-message@4.0.0

## 0.4.8

- [patch][466682024f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/466682024f):

  - TEAMS-480: Sending team member counts via share analytics

## 0.4.7

- [patch][cfc3d669d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3d669d8):

  - added share content type to submit share analytics event

## 0.4.6

- [patch][2a64153b7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a64153b7a):

  - fixed escape key press closes share dialog when user picker menu is open

## 0.4.5

- [patch][03957e8674](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/03957e8674):

  - deferred fetchConfig call until share dialog is triggered open

## 0.4.4

- [patch][c27888ddff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c27888ddff):

  - added blogpost shared message and improved on documentation

## 0.4.3

- [patch][c63137e1ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c63137e1ed):

  - fixed admin is notified flag shows up with no request access

## 0.4.2

- [patch][50cd881689](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50cd881689):

  - fixed escape key press closes share dialog when user picker menu is open

## 0.4.1

- [patch][b684bc706c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b684bc706c):

  - added and set default config when client.getConfig fails

## 0.4.0

- [minor][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 0.3.15

- [patch][7461d7df4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7461d7df4e):

  - added support to text-only Dialog Trigger Button

## 0.3.14

- [patch][ffd178d638](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ffd178d638):

  - exposed renderCustomTriggerButton prop in ShareDialogContainer

## 0.3.13

- [patch][f692c5e59c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f692c5e59c):

  - updated user picker field email validity check and ui copies for domain based user only invite in share component

## 0.3.12

- [patch][00c4559516](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/00c4559516):

  - updated copies for placeholder and no result message for user picker field in share and added localizations for icon labels

## 0.3.11

- [patch][131d76e6fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/131d76e6fc):

  - updated flag model in elements/share

## 0.3.10

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/field-text-area@5.0.4
  - @atlaskit/flag@10.0.6
  - @atlaskit/form@5.2.7
  - @atlaskit/icon@16.0.9
  - @atlaskit/inline-dialog@10.0.4
  - @atlaskit/section-message@2.0.3
  - @atlaskit/select@8.1.1
  - @atlaskit/toggle@6.0.4
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/user-picker@3.4.2
  - @atlaskit/theme@8.1.7

## 0.3.9

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 0.3.8

- [patch][95293c5550](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95293c5550):

  - Added documentation and consolidated example

## 0.3.7

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/field-text-area@5.0.3
  - @atlaskit/form@5.2.5
  - @atlaskit/icon@16.0.8
  - @atlaskit/inline-dialog@10.0.3
  - @atlaskit/section-message@2.0.2
  - @atlaskit/select@8.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/toggle@6.0.3
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/button@12.0.0

## 0.3.6

- [patch][e03dea5f5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e03dea5f5d):

  - FS-3792 do no call loadUser on empty query

## 0.3.5

- [patch][77c2d7bb2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/77c2d7bb2b):

  - Added flags for successful share

## 0.3.4

- [patch][0f4109e919](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f4109e919):

  - FS-3743 remove loading message from user picker

## 0.3.3

- [patch][66512e9026](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66512e9026):

  - FS-3764 move dependencies to peer dependencies

## 0.3.2

- [patch][c68b454ba9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c68b454ba9):

  - fixed unclear share panel state upon successful share

## 0.3.1

- [patch][ddfc158dfb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ddfc158dfb):

  - Removed unused buttonStyle prop

## 0.3.0

- [minor][b617f099aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b617f099aa):

  - Limited length of comment messages.

## 0.2.10

- [patch][69c72e07ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c72e07ba):

  - Fixed share button off position on IE11

## 0.2.9

- [patch][fcdae04b8c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fcdae04b8c):

  - FS-3620 add share analytics

## 0.2.8

- [patch][13d9986e40](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/13d9986e40):

  - fixed dialogue header font settings

## 0.2.7

- [patch][26a3d443e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/26a3d443e2):

  - fix warning when unmounting share doesn't cancel the async requests

## 0.2.6

- [patch][3161a93cdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3161a93cdb):

  - FS-3289 update share copy

## 0.2.5

- [patch][9babee9fc2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9babee9fc2):

  - Fix share modal padding

## 0.2.4

- [patch][8f56fe1259](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8f56fe1259):

  - Remove files from package.json to publish all the files in @atlaskit/share

## 0.2.3

- Updated dependencies [3ea3f5ea55](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ea3f5ea55):
  - @atlaskit/user-picker@3.0.0

## 0.2.2

- [patch][9ce45faaf8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ce45faaf8):

  - adjustments for design review

## 0.2.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 0.2.0

- [minor][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 0.1.18

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/user-picker@1.0.25
  - @atlaskit/util-data-test@10.2.3
  - @atlaskit/util-service-support@3.1.1
  - @atlaskit/docs@7.0.0
  - @atlaskit/field-text-area@5.0.0
  - @atlaskit/form@5.1.8
  - @atlaskit/inline-dialog@10.0.0
  - @atlaskit/section-message@2.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/tooltip@13.0.0

## 0.1.17

- [patch][af38e4649a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af38e4649a):

  - exposed shareContentType prop

## 0.1.16

- [patch][aca247a78b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aca247a78b):

  - Exposed shareFormTitle prop to customise Share Form title
  - Removed object type from Copy link button

## 0.1.15

- [patch][312572b5f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/312572b5f8):

  - FS-3618 consume configuration in the UserPickerField

## 0.1.14

- [patch][4d3226b06b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d3226b06b):

  - exposed trigger button appearance prop

## 0.1.13

- [patch][3f5be35333](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f5be35333):

  - Fixed errors and warnings in elements/share unit tests

## 0.1.12

- [patch][376926523b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/376926523b):

  - Explosed buttonStyle prop to ShareDialogContainer

## 0.1.11

- [patch][7e809344eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e809344eb):

  - Modified share web component to send a single atlOriginId

## 0.1.10

- Updated dependencies [4af5bd2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4af5bd2a58):
  - @atlaskit/editor-test-helpers@7.0.0

## 0.1.9

- [patch][7569356ab3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7569356ab3):

  - FS-3417 add email warning, save intermediate state if click outside

## 0.1.8

- [patch][d1fbdc3a35](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d1fbdc3a35):

  - enable noImplicitAny for share. fix related issues

## 0.1.7

- [patch][8e0ea83f02](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e0ea83f02):

  - Added ShareDialogContainer component

## 0.1.6

- [patch][1d284d2437](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d284d2437):

  - FS-3417 added ShareButton, ShareDialogTrigger components to @atlaskit/share

## 0.1.5

- [patch][2f73eeac57](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f73eeac57):

  - Added ShareServiceClient and unit test

- [patch][8c905d11b7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c905d11b7):

  - Added share service client

## 0.1.4

- [patch][b752299534](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b752299534):

  - Added capabilities info message in ShareForm

## 0.1.3

- [patch][42bfdcf8ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42bfdcf8ed):

  - Added CopyLinkButton component and integrated into ShareForm

## 0.1.2

- [patch][48856cfa79](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48856cfa79):

  - Added IdentityClient and unit tests

## 0.1.1

- [patch][64bf358](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64bf358):

  - FS-3416 add ShareForm component to @atlaskit/share

## 0.1.0

- [minor][891e116](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/891e116):

  - FS-3291 add share skeleton
