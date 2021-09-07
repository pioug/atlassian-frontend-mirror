# @atlaskit/user-picker

## 7.16.2

### Patch Changes

- [`8ea7c48af73`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8ea7c48af73) - [ux] Email options now only show email icon

## 7.16.1

### Patch Changes

- [`5fe6e21a9a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fe6e21a9a0) - [ux] Upgrade to the latest version of @atlaskit/modal-dialog. This change includes shifting the primary button in the footer of the modal to be on the right instead of the left.
- Updated dependencies

## 7.16.0

### Minor Changes

- [`b6fa102efa0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6fa102efa0) - [ux] Updated appearance of email options to use mail icon

## 7.15.2

### Patch Changes

- [`5c34064da77`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c34064da77) - Utilising useMemo hook to avoid re-merging i18n messages with parent provider on render

## 7.15.1

### Patch Changes

- [`7cc3a4c74a2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7cc3a4c74a2) - Pass on parent IntlProvider messages so components passed as props from the parent (such as a placeholder) will have i18n

## 7.15.0

### Minor Changes

- [`ccda387eede`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ccda387eede) - smart-user-picker extracted out from user-picker to smart-user-picker package. smart-user-picker in user-picker is now deprecated but still backwards compatible. Please use @atlassian/smart-user-picker for smart-user-picker.

## 7.14.3

### Patch Changes

- Updated dependencies

## 7.14.2

### Patch Changes

- [`7ca4b74ff54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ca4b74ff54) - [ux] Bugfix for removing a weird box blip that extends outside of the avatar for user picker in Safari.

## 7.14.1

### Patch Changes

- [`f8630220e88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f8630220e88) - Fix typing in MultiValueContainer

## 7.14.0

### Minor Changes

- [`de907e45ad1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de907e45ad1) - Removed the tag component to address accessibility isssues

## 7.13.1

### Patch Changes

- [`1648ac429ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1648ac429ee) - [ux] Updated to use the new `@atlaskit/select` design.
- Updated dependencies

## 7.13.0

### Minor Changes

- [`869e1fdef2f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/869e1fdef2f) - [ux] Prioritize filterOptions prop over onEmpty. Now, filterOptions is called AFTER onEmpty is applied to URS suggestions. This means that SUP can show empty results if filterOptions filters out all results. This fixes a bug where updated filterOptions does not get applied to suggestions.

## 7.12.0

### Minor Changes

- [`92f34fa25a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/92f34fa25a7) - Switching compass over to using its own user search index instead of jira's

## 7.11.0

### Minor Changes

- [`5dcf1001d62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5dcf1001d62) - [ux] Added tooltips for Confluence ExCo/Guest lozenges for Smart User Picker

## 7.10.7

### Patch Changes

- [`bdf81a467fd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdf81a467fd) - Translation bugfix for text within user picker

## 7.10.6

### Patch Changes

- Updated dependencies

## 7.10.5

### Patch Changes

- [`048fd26b847`](https://bitbucket.org/atlassian/atlassian-frontend/commits/048fd26b847) - Updating Smart User Picker atlaskit documentation

## 7.10.4

### Patch Changes

- [`f22daa70ff0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f22daa70ff0) - Unit test and some doco for defaultValue

## 7.10.3

### Patch Changes

- [`ac30a1340a2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac30a1340a2) - Groups with external collaborators will now have the Guest lozenge shown next to them on the smart user picker

## 7.10.2

### Patch Changes

- [`f310ccbe522`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f310ccbe522) - Updated AK examples to use new jdog cloudid

## 7.10.1

### Patch Changes

- [`772e15b76d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/772e15b76d2) - UR-1409 handle request races gracefully

## 7.10.0

### Minor Changes

- [`659f69d349a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/659f69d349a) - [ux] Added closeMenuOnScroll and menuShouldBlockScroll Select props which allows easier integrations inside modals

## 7.9.3

### Patch Changes

- [`40dc90330e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/40dc90330e4) - UR-2530 accept empty placeholder values

## 7.9.2

### Patch Changes

- [`78c54a8761f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78c54a8761f) - Rewording some comments/types/descriptions to remove unnecessarily gendered phrasing
- Updated dependencies

## 7.9.1

### Patch Changes

- [`2ed498a11d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ed498a11d4) - Export getUserRecommendations for external use and test mocking

## 7.9.0

### Minor Changes

- [`83812c6e1a6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83812c6e1a6) - Add productAttributes into SmartUserPicker usersRequest analytics event

## 7.8.0

### Minor Changes

- [`3f551db7bed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f551db7bed) - filterOptions will include the query as an optional import

## 7.7.0

### Minor Changes

- [`de8d3656da6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de8d3656da6) - Added user markes to user-picker/smart-user-picker. Confluence guests will now appear with a lozenge containing the text 'GUEST'. Updated tests to match this behaviour and updated the smart-user-picker example.

## 7.6.0

### Minor Changes

- [`0076cad2d37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0076cad2d37) - Added the prop bootstrapOptions for Smart User Picker. This allows to override the bootstrap options.

## 7.5.5

### Patch Changes

- [`12493bf342e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12493bf342e) - Add bugfix to make principalId actually optional. Backwards compatible.

## 7.5.4

### Patch Changes

- [`c50a63f9f72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c50a63f9f72) - Upgrade `@types/react-select` to `v3.1.2` and fix type breaks
- Updated dependencies

## 7.5.3

### Patch Changes

- [`5aa6e51ed2f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5aa6e51ed2f) - [ux] Add GitHub as an external source for the user-picker

## 7.5.2

### Patch Changes

- [`6bbba22c60b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6bbba22c60b) - Prevent PII from being fired for UP analytics events

## 7.5.1

### Patch Changes

- [`e55c8004986`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e55c8004986) - [ux] Add Team prefix to team option bylines to increase clarity.

## 7.5.0

### Minor Changes

- [`93adccb79a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93adccb79a4) - The Smart User Picker now has the ability to use menuPosition which can allow it to be displayed on top of a dialog box.

## 7.4.0

### Minor Changes

- [`4c7bc9847a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c7bc9847a4) - Added the Smart User Picker to Confluence quicksearch

## 7.3.3

### Patch Changes

- [`224d0251bd1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/224d0251bd1) - Update examples to function components for use in react storybook

## 7.3.2

### Patch Changes

- [`9a206f99b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a206f99b1) - [ux] Added 'MEMBER' lozenge to SUP is workspaceMember attribute exists (from bitbucket recommendations response)

## 7.3.1

### Patch Changes

- [`8af040a491`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8af040a491) - Reformating suggested emails if user inputs a space in the picker, aligning email suggestion avatar size with other options in the picker

## 7.3.0

### Minor Changes

- [`39055f3ac5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39055f3ac5) - ED-10694: Fix FieldComponent defaultValue behaviour losing value due to mutation

## 7.2.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 7.2.0

### Minor Changes

- [`70c3d3cab0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70c3d3cab0) - [ux] allow displaying a constant recommendation to invite users from a specific email domain, based on the users input value

## 7.1.0

### Minor Changes

- [`c9327fc11e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9327fc11e) - [ux] Add ability to user picker to display the external users along with the sources they come from.

## 7.0.0

### Major Changes

- [`2c148c9eb9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c148c9eb9) - Update the on Error prop to allow fail-over search client implementation for products.
  Confluence fail-over client.

## 6.9.3

### Patch Changes

- [`6e859f4e7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e859f4e7d) - Fix analytics to not expose email addresses as part of payload

## 6.9.2

### Patch Changes

- [`677744c680`](https://bitbucket.org/atlassian/atlassian-frontend/commits/677744c680) - Add UserSelect field for ConfigPanel, and expose types in SmartUserPicker

## 6.9.1

### Patch Changes

- [`d46c67b902`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d46c67b902) - [ux] Added further props to the PopupUserPicker for enabling offsets/shouldFlip/boundary settings. This change is backwards compatible. PopperProps have been updated to conform with Popper2.0 change

## 6.9.0

### Minor Changes

- [`c8061b65de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8061b65de) - Allow style passthrough to mergeStyles in atlaskit select

## 6.8.0

### Minor Changes

- [`57ef50f4d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/57ef50f4d4) - Retain requested order for defaultValue hydration.
  Hydrate an "Unknown" user if no result from hydration.
  Converted example to a function component.

## 6.7.2

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 6.7.1

### Patch Changes

- Updated dependencies

## 6.7.0

### Minor Changes

- [`fe292139a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe292139a7) - [ux] Added support for lozenge in the options dropdown

## 6.6.1

### Patch Changes

- [`8c68430770`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c68430770) - Added onValueError callback to handle hydration errors

## 6.6.0

### Minor Changes

- [`defe93e5fe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/defe93e5fe) - Added auto hydration for defaultValue user identifier types to SmartUserPicker

## 6.5.7

### Patch Changes

- Updated dependencies

## 6.5.6

### Patch Changes

- [`38cc5d88da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/38cc5d88da) - Update type of Target to match popup-select's

## 6.5.5

### Patch Changes

- [`46bb7d498e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/46bb7d498e) - [ux] Popup user picker styling bug fixed where the placeholder was placed in the wrong position

## 6.5.4

### Patch Changes

- [`4111de09de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4111de09de) - Allow emailLabel to be an empty string

## 6.5.3

### Patch Changes

- [`0ea18048ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ea18048ed) - Fix emailLabel not being passed in pickerProps

## 6.5.2

### Patch Changes

- Updated dependencies

## 6.5.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 6.5.0

### Minor Changes

- [`63715cc332`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63715cc332) - Add noBorder option to match confluence styling

### Patch Changes

- [`1685d02525`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1685d02525) - Fix styling issue for noBorder

## 6.4.2

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 6.4.1

### Patch Changes

- Updated dependencies

## 6.4.0

### Minor Changes

- [`0d5890d800`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d5890d800) - Added props for bitbucket support - isPublicRepo, workspaceIds, emailDomain

## 6.3.0

### Minor Changes

- [`d645e8d753`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d645e8d753) - Added includeUsers prop to allow results for team or groups only

## 6.2.4

### Patch Changes

- [`d03bff2147`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d03bff2147) - updated translations

## 6.2.3

### Patch Changes

- [`9ef8a85f82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ef8a85f82) - Reenable subtle and compact style flags

## 6.2.2

### Patch Changes

- [`37e5a70532`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37e5a70532) - Fix deselect bug when defaultValue props provided

## 6.2.1

### Patch Changes

- [`cfbae59ca9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfbae59ca9) - Map groups through to picker results

## 6.2.0

### Minor Changes

- [`51aca36965`](https://bitbucket.org/atlassian/atlassian-frontend/commits/51aca36965) - Added includeGroups prop for the retrieval of confluence groups in smart user picker

## 6.1.0

### Minor Changes

- [`d8aec9a0f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8aec9a0f8) - Fixed visual regression with Select dropdown caussing scrollbars to appears inside the PopUp, now using a portal element. For @atlaskit/user-picker ability to pass down `portalElement` has been added.

## 6.0.2

### Patch Changes

- [`cde426961a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cde426961a) - Bumps Avatar and AvatarGroup depenedencies
- Updated dependencies

## 6.0.1

### Patch Changes

- [`0c532edf6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c532edf6e) - Use the 'lodash' package instead of single-function 'lodash.\*' packages

## 6.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 5.1.4

### Patch Changes

- [`7f61836218`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f61836218) - Re-fire userPicker searched event after an option has been selected (allows mapping between userPicker clicked/enetered with userPicker searched for multiple pick case).

## 5.1.3

### Patch Changes

- [`f4fb91cf47`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4fb91cf47) - Fix blank space after deleting items in multi

## 5.1.2

### Patch Changes

- [`b6a673bb27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6a673bb27) - Add smart user picker prop for share dialog. Only works if enableSmartUserPicker is true and product = 'jira'.

  Fix maxPickerHeight prop in user-picker to work (previously was maxGrowHeight in styles but the prop was called maxPickerHeight).

  Fix alignment issues of tags inside user-picker.

  Enable deletion animation for user-picker.

## 5.1.1

### Patch Changes

- [`50d6079274`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50d6079274) - Fix analytics bug exposing PII for usersRequest succeeded

## 5.1.0

### Minor Changes

- [`4ee1ba1585`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ee1ba1585) - Add maxPickerHeight to the user picker which sets the maximum height that the user picker can grow up to because of the picked items. Modified subtle prop version of user picker. When subtle, the user picker's border will be removed. The background color will remain the same (Grey N10). These changes were spurred by recent style changes in user picker, which impacted the style of the shares dialog.
  Consumers need to be aware of whether an infinitely growing number of users in the user picker can affect their styling. If it does, they will need to provide a suitable maxPickerHeight. Consumers who also wish for a borderless user picker must set the subtle prop to true.

  Change the background color from N10 to N20 to align with other select background colors.

  In share dialog, set the maxPickerHeight prop to 102 for the user picker.

## 5.0.0

### Major Changes

- [`510b57c393`](https://bitbucket.org/atlassian/atlassian-frontend/commits/510b57c393) - SupportedProduct type changed from enum to a string union type of products. \n This change was a result of migration compatibility for smart-user-picker into ForgeUI. Enum types were forcing ForgeUI to eager load the whole package. Consumers should look to change their uses of SupportedProduct from enum to string identifiers. Possible values are listed in the package documentation.

## 4.6.4

### Patch Changes

- [`cdb9e0c4de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cdb9e0c4de) - UI bug fixes

## 4.6.3

### Patch Changes

- [`ac965ef48d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac965ef48d) - Fix selected user alignment issue in single user picker

## 4.6.2

### Patch Changes

- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies
- [`baaad91b65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/baaad91b65) - Updated to use the latest and more performant version of `@atlaskit/avatar`
- Updated dependencies

## 4.6.1

### Patch Changes

- [`649f69b6d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/649f69b6d7) - Patch all packages that are used by confluence that have a broken es2019 dist

## 4.6.0

### Minor Changes

- [`5e93392923`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e93392923) - filter out inactive users from suggestions

### Patch Changes

- [`131cee6d7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/131cee6d7a) - Add missing tslib dependency

## 4.5.1

### Patch Changes

- [`d8df7262f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8df7262f9) - expose a method to change env so confluence local development is easier

## 4.5.0

### Minor Changes

- [`a046c939c7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a046c939c7) - Fix wrong url bug, add onEmpty property

## 4.4.0

### Minor Changes

- [`a546558e20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a546558e20) - add prefetch prop to smart user picker

## 4.3.0

### Minor Changes

- [`650d5ece5b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/650d5ece5b) - add smart user picker

## 4.2.3

### Patch Changes

- [patch][845feddce2](https://bitbucket.org/atlassian/atlassian-frontend/commits/845feddce2):

  This fixes the multi user select bug in user picker- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10

## 4.2.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/avatar@17.1.7
  - @atlaskit/button@13.3.7
  - @atlaskit/field-base@14.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/lozenge@9.1.4
  - @atlaskit/select@11.0.7
  - @atlaskit/tag@9.0.13
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3
  - @atlaskit/analytics-viewer@0.3.9
  - @atlaskit/elements-test-helpers@0.6.7
  - @atlaskit/util-data-test@13.1.1

## 4.2.1

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/field-base@14.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/select@11.0.6
  - @atlaskit/tag@9.0.12
  - @atlaskit/tooltip@15.2.2

## 4.2.0

### Minor Changes

- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Fix some broken CSS layout in IE 11

### Patch Changes

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/tooltip@15.2.0
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/select@11.0.3
  - @atlaskit/avatar@17.1.5
  - @atlaskit/field-base@13.0.16

## 4.1.5

### Patch Changes

- [patch][3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  Make PopupSelect correctly pass props. Forcing update of @atlaskit/select for all other packages- Updated dependencies [3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  - @atlaskit/select@11.0.2

## 4.1.4

### Patch Changes

- [patch][30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):

  @atlaskit/select has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 4.1.3

- Updated dependencies [bd94b1d552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd94b1d552):
- Updated dependencies [ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):
  - @atlaskit/util-data-test@13.0.0
  - @atlaskit/i18n-tools@0.6.0

## 4.1.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 4.1.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 4.1.0

### Minor Changes

- [minor][c9fbef651f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c9fbef651f):

  Add Group as a new Option

## 4.0.23

### Patch Changes

- [patch][8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):

  @atlaskit/avatar has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 4.0.22

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 4.0.21

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 4.0.20

### Patch Changes

- [patch][abee1a5f4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abee1a5f4f):

  Bumping internal dependency (memoize-one) to latest version (5.1.0). memoize-one@5.1.0 has full typescript support so it is recommended that typescript consumers use it also.

## 4.0.19

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

## 4.0.18

- Updated dependencies [1adb8727e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1adb8727e3):
  - @atlaskit/tag@9.0.0

## 4.0.17

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 4.0.16

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 4.0.15

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 4.0.14

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

## 4.0.13

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/select@10.0.0

## 4.0.12

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/field-base@13.0.6
  - @atlaskit/select@9.1.8
  - @atlaskit/tag@8.0.5
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/icon@19.0.0

## 4.0.11

### Patch Changes

- [patch][40e6908409](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40e6908409):

  pass session id to on selection

## 4.0.10

### Patch Changes

- [patch][06f5bbf5a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06f5bbf5a9):

  start session onfocus

## 4.0.9

### Patch Changes

- [patch][c91e37e5f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c91e37e5f1):

  pass session id to onFocus, onBlur, onClose and onInputChange

## 4.0.8

### Patch Changes

- [patch][77ef850a35](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/77ef850a35):

  Fix click and hover behaviours of disabled single user picker

## 4.0.7

### Patch Changes

- [patch][25b3ec24af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25b3ec24af):

  add optional session id to async loadoption

## 4.0.6

### Patch Changes

- [patch][b029d82e8c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b029d82e8c):

  Handle scroll of box of user picker component

## 4.0.5

### Patch Changes

- [patch][9b0adb4ce7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b0adb4ce7):

  Fix scrolling behaviour when picking a user in the multi user picker

## 4.0.4

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/avatar@16.0.4
  - @atlaskit/icon@18.0.1
  - @atlaskit/select@9.1.6
  - @atlaskit/tooltip@15.0.0

## 4.0.3

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/field-base@13.0.4
  - @atlaskit/section-message@4.0.2
  - @atlaskit/select@9.1.5
  - @atlaskit/tag@8.0.3
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/icon@18.0.0

## 4.0.2

- Updated dependencies [ed41cac6ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed41cac6ac):
  - @atlaskit/theme@9.0.3
  - @atlaskit/lozenge@9.0.0

## 4.0.1

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/avatar@16.0.2
  - @atlaskit/icon@17.1.1
  - @atlaskit/tag@8.0.2
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 4.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 3.5.5

- [patch][87c47cd667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87c47cd667):

  - Getting updated styles from tag

## 3.5.4

- [patch][b8bc454675](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8bc454675):

  - Add inputId prop to allow label to open the user picker

## 3.5.3

- [patch][171feaa473](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/171feaa473):

  - FS-3792 clear results after selection

## 3.5.2

- [patch][7cb36f2603](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cb36f2603):

  - Fixed User Picker showing the spinner forever in some async use cases.

## 3.5.1

- [patch][3fbfd9d7f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3fbfd9d7f5):

  - updated byline message for EmailOption based on email validity in user-picker

## 3.5.0

- [minor][e1abf3f31a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1abf3f31a):

  - Prevent popup user picker from being dismissed on clear.

## 3.4.3

- [patch][2f8c041db5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f8c041db5):

  - Corrected asynchronous user picker behaviour

## 3.4.2

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/field-base@12.0.2
  - @atlaskit/icon@16.0.9
  - @atlaskit/lozenge@7.0.2
  - @atlaskit/section-message@2.0.3
  - @atlaskit/select@8.1.1
  - @atlaskit/tag@7.0.2
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 3.4.1

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 3.4.0

- [minor][4a8effc046](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a8effc046):

  - FS-3741 expose boundariesElement for integrators to pass in custom boundary

## 3.3.5

- [patch][0f4109e919](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f4109e919):

  - FS-3743 remove loading message from user picker

## 3.3.4

- [patch][93464f09e8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93464f09e8):

  - TEAMS-328 : Changing byline logic

## 3.3.3

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 3.3.2

- [patch][3718bdc361](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3718bdc361):

  - Updated InviteAvatorIcon in UserPicker to be not transparent

## 3.3.1

- [patch][83ad0552d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/83ad0552d4):

  - Workaround SSR avatar issue in user-picker ssr tests

## 3.3.0

- [minor][4526b178cb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4526b178cb):

  - Fixed uncaptured Enter key press on Input

## 3.2.0

- [minor][b0210d7ccc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0210d7ccc):

  - reset jest modules before hydration

## 3.1.1

- [patch][3161a93cdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3161a93cdb):

  - FS-3289 update share copy

## 3.1.0

- [minor][1da59f9d31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1da59f9d31):

  - added ssr tests to user-picker

## 3.0.0

- [major][3ea3f5ea55](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ea3f5ea55):

  - FS-3548 integrators must explicitly set the context prop in user-picker

## 2.0.3

- [patch][552843a739](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/552843a739):

  - FS-3639 fix analytics when no item is removed

## 2.0.2

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 2.0.1

- [patch][de8123519a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de8123519a):

  - FS-3675 add ability for integrator to add title to popup picker

## 2.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 1.1.1

- [patch][64c306c904](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64c306c904):

  - FS-3599 remove logic to hide add more placeholder

## 1.1.0

- [minor][14af4044ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14af4044ea):

  - FS-3354 introduce PopupUserPicker to package

## 1.0.25

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/icon@16.0.4
  - @atlaskit/util-data-test@10.2.3
  - @atlaskit/analytics-viewer@0.1.7
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/avatar@15.0.0
  - @atlaskit/lozenge@7.0.0
  - @atlaskit/section-message@2.0.0
  - @atlaskit/select@8.0.0
  - @atlaskit/tag@7.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/tooltip@13.0.0

## 1.0.24

- [patch][97307d9dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97307d9dd1):

  - FS-3618 add isValidEmail prop to UserPicker

## 1.0.23

- [patch][ad1bd2a92e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ad1bd2a92e):

  - FS-3605 expose prop to disable input

## 1.0.22

- [patch][46ffd45f21](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46ffd45f21):

  - Added ability to toggle animations in atlaskit/select, updated UserPicker to disable animations using this new behaviour

## 1.0.21

- [patch][b38b2098e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b38b2098e3):

  - FS-3417 export utils functions

## 1.0.20

- Updated dependencies [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - @atlaskit/select@7.0.0

## 1.0.19

- [patch][1050084e29](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1050084e29):

  - TEAMS-242 : Change user picker placeholder

## 1.0.18

- [patch][0809a67d7b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0809a67d7b):

  - FS-3591 hide selected users from multi picker

## 1.0.17

- [patch][67f0d11134](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f0d11134):

  - FS-3577 show selected options by default

## 1.0.16

- [patch][c51d1e2e51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c51d1e2e51):

  - FS-3573 show user avatar on focus

## 1.0.15

- [patch][1ce3a8812b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ce3a8812b):

  - FS-3458 call loadOptions if open prop is controlled
