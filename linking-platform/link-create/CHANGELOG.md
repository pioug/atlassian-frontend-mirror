# @atlaskit/link-create

## 0.9.0

### Minor Changes

- [`c209f670761`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c209f670761) - Improved testIds

## 0.8.2

### Patch Changes

- [`90ad796d91c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/90ad796d91c) - Fix fetching hyphened locales to underscores

## 0.8.1

### Patch Changes

- [`70b0f95345a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70b0f95345a) - Add support for i18n

## 0.8.0

### Minor Changes

- [`f3acb380cb2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3acb380cb2) - EDM-7064: remove FormContextProvider export to prevent usage in external packages.

## 0.7.1

### Patch Changes

- [`41d73aab05c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41d73aab05c) - EDM-6938: pass spaceName into onCreate submit for confluence-create and pass as optional meta data into link-create."

## 0.7.0

### Minor Changes

- [`eb070266532`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb070266532) - Expose Modal callbacks and Add modalTitle to the linkCreate Props

## 0.6.0

### Minor Changes

- [`ac3927f0650`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac3927f0650) - Make modal 480px wide, Update TextField to take isRequired prop w/o default browser validation, remove extra internal spacing in the create form

## 0.5.7

### Patch Changes

- [`ffb87e553ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ffb87e553ea) - Hides the validation error when user edits the field

## 0.5.6

### Patch Changes

- [`a02d619af5c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a02d619af5c) - Changed onCreate to return a possible Promise to hold the create button spinner while submitting

## 0.5.5

### Patch Changes

- [`7b5fb18bb63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b5fb18bb63) - Update screen event to UI

## 0.5.4

### Patch Changes

- [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies

## 0.5.3

### Patch Changes

- [`ae5ac36af00`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae5ac36af00) - Updates analytics codegen to support screen events.

## 0.5.2

### Patch Changes

- [`7734ef0bdb4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7734ef0bdb4) - allowing default values in confluence creation form.

## 0.5.1

### Patch Changes

- [`2d812255401`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d812255401) - EDM-6561: add an autofocus on title field in create modal and change cancel button labeling to close

## 0.5.0

### Minor Changes

- [`ad753581e70`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad753581e70) - [ux] Moves the FormFooter out of CreateForm and provides a new CreateFormLoader component & now we handle the submitting state in the form context

## 0.4.4

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 0.4.3

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 0.4.2

### Patch Changes

- [`93af54caca2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93af54caca2) - EDM-6553: no functionality change, just updating UI so that there is padding between the cancel and create button for link-create. Also updated the dropdown error message.

## 0.4.1

### Patch Changes

- [`3c5946b6cdf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c5946b6cdf) - EDM-6524: remove isRequired prop from textfield in create component as browser validation will not be used, also spread AKTextfield props to stop exposure of testid and placeholder props.

## 0.4.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 0.3.3

### Patch Changes

- [`5cbb3a0f20c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5cbb3a0f20c) - Fix tangerine lint warnings & fix SVG id not unique & add VR test for dropdowns in modal & handle plugin errors

## 0.3.2

### Patch Changes

- [`1600a0d171f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1600a0d171f) - Adds various eslint-ignores for tokens-related warnings

## 0.3.1

### Patch Changes

- [`9e1c1e92771`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e1c1e92771) - Fire analytics

## 0.3.0

### Minor Changes

- [`29dfee4c540`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29dfee4c540) - Adds global error boundary and fixes footer padding

## 0.2.1

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils
- Updated dependencies

## 0.2.0

### Minor Changes

- [`a765caedf71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a765caedf71) - EDM-5666 Implement Create Confluence Plugin

### Patch Changes

- [`430f0f27c63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/430f0f27c63) - Use FormSection instead of ModalSection

## 0.1.2

### Patch Changes

- [`5da1c8f4422`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5da1c8f4422) - Integrate with link-create-presets

## 0.1.1

### Patch Changes

- [`63acd1bc789`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63acd1bc789) - Update examples with presets

## 0.1.0

### Minor Changes

- [`7e7ca45dbe4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e7ca45dbe4) - Exports LinkCreateProps and LinkCreatePlugin Types

## 0.0.4

### Patch Changes

- [`09697a312bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09697a312bc) - EDM-5657 EDM-5661 Implement Select and Textfield components

## 0.0.3

### Patch Changes

- [`4b8910b3460`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b8910b3460) - Add link-create-confluence package

## 0.0.2

### Patch Changes

- [`d7724023d26`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7724023d26) - Initial version of Create component
