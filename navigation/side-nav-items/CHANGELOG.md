# @atlaskit/side-nav-items

## 1.7.2

### Patch Changes

- [`a9815b8d729e0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a9815b8d729e0) -
  Fixes the nested popup trigger styling when `platform_dst_nav4_flyout_menu_slots_close_button` is
  enabled.

## 1.7.1

### Patch Changes

- Updated dependencies

## 1.7.0

### Minor Changes

- [`b9dcd2a2ed822`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b9dcd2a2ed822) -
  Internal refactor to change the imports of side nav item components from
  `@atlaskit/navigation-system` to the new package `@atlaskit/side-nav-items`.

  There are no functional changes - `@atlaskit/navigation-system` was already just re-exporting them
  from `@atlaskit/side-nav-items`.

## 1.6.0

### Minor Changes

- [`c44903f5844c2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c44903f5844c2) -
  Rounded cap height of side nav menu skeletons to the nearest pixel.

## 1.5.0

### Minor Changes

- [`57838cec99f29`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/57838cec99f29) -
  The `FlyoutMenuItemContent` popup's max height now factors in the top nav and banner, when the
  `platform-dst-side-nav-layering-fixes` feature flag is enabled. This ensures it does not get
  clipped below the top nav and banner.

## 1.4.2

### Patch Changes

- [`20e1df968ddc7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/20e1df968ddc7) -
  Clean up feature gate platform-dst-buttonmenuitem-selected-state-support

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [`ea028d2a58383`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ea028d2a58383) -
  Implemented the SkeletonMenuItem and SkeletonMenuSectionHeading components to match the
  corresponding components they represent.

## 1.3.0

### Minor Changes

- [`c50f9ea3221b7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c50f9ea3221b7) -
  The `description` of menu items will now use the selected state token when the menu item is
  selected.

  This change was previously behind the feature gate `platform-dst-menu-item-description-selected`,
  which has now been cleaned up.

## 1.2.0

### Minor Changes

- [`d06bf7b1c35dd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d06bf7b1c35dd) -
  Added back event firing analytics for flyout menu opening, and flyout menu closing upon trigger
  click. Added back tests for flyout menu open and close analytics.

## 1.1.0

### Minor Changes

- [`4b1149e96b0e1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4b1149e96b0e1) -
  Add five new entry points (/command, /command-creator, /singleton, /client-types, /bridge-api) to
  enable granular imports for better tree-shaking and performance. Existing barrel imports continue
  to work; this is a foundational change that enables future debarreling work.

## 1.0.1

### Patch Changes

- [`e4b717d8304e8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e4b717d8304e8) -
  Add @atlassian/a11y-jest-testing to devDependencies.
