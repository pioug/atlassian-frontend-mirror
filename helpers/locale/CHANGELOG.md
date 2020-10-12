# @atlaskit/locale

## 2.1.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 2.1.0

### Minor Changes

- [`f3416b3fb4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3416b3fb4) - LocalizationProvider implements formatToParts method

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 1.0.6

### Patch Changes

- [patch][296a8b114b](https://bitbucket.org/atlassian/atlassian-frontend/commits/296a8b114b):

  FIXED: Intl.DateTimeFormat returns March instead of April in Safari- Updated dependencies [91a1eb05db](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a1eb05db):

  - @atlaskit/textfield@3.1.7

## 1.0.5

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/field-base@14.0.1
  - @atlaskit/select@11.0.7
  - @atlaskit/textfield@3.1.6

## 1.0.4

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/field-base@14.0.0
  - @atlaskit/docs@8.3.1
  - @atlaskit/select@11.0.6
  - @atlaskit/textfield@3.1.5

## 1.0.3

### Patch Changes

- [patch][3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  Make PopupSelect correctly pass props. Forcing update of @atlaskit/select for all other packages- Updated dependencies [3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  - @atlaskit/select@11.0.2

## 1.0.2

### Patch Changes

- [patch][30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):

  @atlaskit/select has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 1.0.1

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 1.0.0

### Major Changes

- [major][d02e7d6018](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02e7d6018):

  Initial release of @atlaskit/locale

  This is a new package, providing utility functions that are an abstraction on top of
  [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)
