# @atlaskit/link-picker

## 1.4.0

### Minor Changes

- [`3b5e61f9b3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b5e61f9b3b) - [ux] Adds in TAB UI support for Link Picker

## 1.3.0

### Minor Changes

- [`0ddad39a369`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ddad39a369) - [ux] Lazy load the link-picker instead. The lazily loaded picker is now the default that's exported

## 1.2.1

### Patch Changes

- [`d17b35d4c20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d17b35d4c20) - Display validation message when submitting empty input

## 1.2.0

### Minor Changes

- [`21b0c90e0d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21b0c90e0d4) - Adds error boundary around the link picker to track errors and display an error message.

## 1.1.4

### Patch Changes

- [`97cfed0aa0d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/97cfed0aa0d) - Add tests around how the link picker handles editing links

## 1.1.3

### Patch Changes

- [`22e6401bf78`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22e6401bf78) - Inlines svg assets directly into the UI

## 1.1.2

### Patch Changes

- [`28f54174eaf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f54174eaf) - Removes example-helpers from built distribution. Fixes missing /dist from previous patch.

## 1.1.1

### Patch Changes

- [`780484d9518`](https://bitbucket.org/atlassian/atlassian-frontend/commits/780484d9518) - Fixes missing svg asset for no search results in version 1.1.0.

## 1.1.0

### Minor Changes

- [`ba5d8ed23cc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba5d8ed23cc) - Adds search error message

## 1.0.0

### Major Changes

- [`2e20b02bb2c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e20b02bb2c) - Initial major version release

## 0.11.0

### Minor Changes

- [`a2286b0746a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2286b0746a) - Added support for link picker plugins to resolve using a promise

## 0.10.0

### Minor Changes

- [`dbc82a03866`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dbc82a03866) - Removed styled-components as a peer dependency in favor of @emotion/react

## 0.9.0

### Minor Changes

- [`c1c010c8ada`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1c010c8ada) - Remove required container param

## 0.8.1

### Patch Changes

- [`eef8c2da75b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eef8c2da75b) - [ux] Remove link-picker background color as it conflicts with floatingToobar borders

## 0.8.0

### Minor Changes

- [`1e371fd8d23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e371fd8d23) - Updates link picker to support array of plugins. Removes intl prop from LinkPickerProps type.

## 0.7.0

### Minor Changes

- [`9cabbe5e920`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9cabbe5e920) - Convert to @atlaskit scope

## 0.6.2

### Patch Changes

- [`3fb9dbd9f4e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fb9dbd9f4e) - [ux] Add buttons at the bottom of the form

## 0.6.1

### Patch Changes

- [`93a77354b58`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93a77354b58) - Updated vr snapshots

## 0.6.0

### Minor Changes

- [`91f2d091cfd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/91f2d091cfd) - Change link picker props and onSubmit API to better reflect intended usage and make breaking changes less likely.

## 0.5.3

### Patch Changes

- [`3ef09836c04`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ef09836c04) - [ux] Validates links within search text are not inserted

## 0.5.2

### Patch Changes

- [`c1f3d82b994`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1f3d82b994) - Update to use the new V3 recents API in the Atlassian plugin

## 0.5.1

### Patch Changes

- [`d90f1f42589`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d90f1f42589) - [ux] Shows subtitle with recently viewed if there’s no search text and results otherwise

## 0.5.0

### Minor Changes

- [`7abf8824fec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7abf8824fec) - Migrate link picker atlassian plugin from picker package.

## 0.4.0

### Minor Changes

- [`c926a95160b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c926a95160b) - Removes onEscape prop from the link picker.

## 0.3.2

### Patch Changes

- [`08195fc6e43`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08195fc6e43) - [ux] Add field validation error message to link input field

## 0.3.1

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [`3b3a7800978`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b3a7800978) - Export picker state and list item data types from picker package.

## 0.2.4

### Patch Changes

- [`6d1dd7c5833`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d1dd7c5833) - Increase test coverage

## 0.2.3

### Patch Changes

- [`6f3a1f588e1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6f3a1f588e1) - Rewrites LinkSearchListItem as FC & Adds new Active state to support arrow navigation and Selected style

## 0.2.2

### Patch Changes

- [`9598e13788a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9598e13788a) - [ux] Update token usage for better contrast

## 0.2.1

### Patch Changes

- [`7fa34f27a1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7fa34f27a1f) - Displays a search icon inside link-picker search input when there is an active Plugin

## 0.2.0

### Minor Changes

- [`1cb59c97d35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1cb59c97d35) - Adds AtlassianLinkPicker plugin and changes LinkPicker API to use plugins

## 0.1.1

### Patch Changes

- [`df6e3bdd55f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df6e3bdd55f) - EDM-3088/Rewrite PanelTextInput as functional component and take advante of Atlaskit Textfield out-of-the-box features

## 0.1.0

### Minor Changes

- [`cb5997ed7af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb5997ed7af) - [ux] EDM-2977/change UI for link and title input fields

## 0.0.6

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4
- Updated dependencies

## 0.0.5

### Patch Changes

- Updated dependencies

## 0.0.4

### Patch Changes

- Updated dependencies

## 0.0.3

### Patch Changes

- [`7f49f72e074`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f49f72e074) - copy existing editor component into @atlassian/link-picker
- Updated dependencies

## 0.0.2

### Patch Changes

- [`3deb6f44dd6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3deb6f44dd6) - create @atlaskit/link-picker

## 0.0.0
