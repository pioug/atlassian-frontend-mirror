# @atlaskit/react-select

## 1.6.0

### Minor Changes

- [#177875](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/177875)
  [`d0c3d27216b7c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d0c3d27216b7c) -
  Remove theme prop and merge customized components for performance

## 1.5.2

### Patch Changes

- [#167291](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167291)
  [`4645a4d115b15`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4645a4d115b15) -
  Fix the calculation of scroll space below to place menu bottom as much as possible

## 1.5.1

### Patch Changes

- [#174296](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174296)
  [`b9f79083be192`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9f79083be192) -
  Adding extra semantics to listbox

## 1.5.0

### Minor Changes

- [#173737](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/173737)
  [`667640085e5c7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/667640085e5c7) -
  Update the font size for the textarea and select components at the `xs` breakpoint. The font size
  will be increased to 16px to prevent IOS Safari from zooming in on the text field when it is
  focused. Styles for larger breakpoints will remain unchanged.

  Apply a fix to the textfield component to ensure monospace is correctly applied to the input at
  the `media.above.xs` breakpoint.

  These changes are currently behind a feature gate and will be evaluated for effectiveness. If
  successful, they will be included in a future release.

## 1.4.2

### Patch Changes

- [#172260](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/172260)
  [`9934fe89f1e6a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9934fe89f1e6a) -
  Improving assisstive technology support by adding better semantics and reducing live region usage

## 1.4.1

### Patch Changes

- [#167336](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167336)
  [`ddb0846c39a88`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ddb0846c39a88) -
  Integrate styles of select and react-select in a single place

## 1.4.0

### Minor Changes

- [#166811](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166811)
  [`6bfa3f552b209`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6bfa3f552b209) -
  Remove unstyled prop

## 1.3.3

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 1.3.2

### Patch Changes

- [#163217](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163217)
  [`560d23ab4dfbe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/560d23ab4dfbe) -
  Add null check on safari for SSR

## 1.3.1

### Patch Changes

- [#162105](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162105)
  [`4edf9a851c491`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4edf9a851c491) -
  Improve the aria live for searching and reduce the live message when menu is open

## 1.3.0

### Minor Changes

- [#160447](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160447)
  [`515ed7a31a9fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/515ed7a31a9fb) -
  Make async select by default in select

## 1.2.0

### Minor Changes

- [#157818](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157818)
  [`87c14ad1a3efa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/87c14ad1a3efa) -
  Use semantic tags and arias for combobox and listbox and reduce aria-live

## 1.1.0

### Minor Changes

- [#156026](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156026)
  [`709b9c76673df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/709b9c76673df) -
  add clearControlLabel prop to pass aria-label to clear icon button

## 1.0.6

### Patch Changes

- [#154659](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154659)
  [`110ee6d55bdb1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/110ee6d55bdb1) -
  Remove ts-ignore comments

## 1.0.5

### Patch Changes

- [#150547](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150547)
  [`e26194391b9dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e26194391b9dd) -
  Add react18 support

## 1.0.4

### Patch Changes

- [#150410](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150410)
  [`010ae8c2986e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/010ae8c2986e6) -
  If select is within react-beatiful-dnd, don't prevent onMouseDown event to fix select is not
  clickable in dnd

## 1.0.3

### Patch Changes

- [#143559](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143559)
  [`56dfbfe361f96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/56dfbfe361f96) -
  Upgrade react-select from 5.4 to 5.8 and replace it with internal atlaskit/react-select

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [#140869](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140869)
  [`f08b672eb884b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f08b672eb884b) -
  Add back removed props as deprecated for easier migration

## 1.0.0

### Major Changes

- [#139777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139777)
  [`79c93576c6fff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/79c93576c6fff) -
  Delete/deprecate props that are unused, used incorrectly, or bad for accessibility.

## 0.0.2

### Patch Changes

- [#135374](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135374)
  [`c7db6f8caf0cd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c7db6f8caf0cd) -
  Export async creatable API

## 0.0.1

### Patch Changes

- [#132974](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132974)
  [`c515f82f96ef1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c515f82f96ef1) -
  Initial fork of react-select
