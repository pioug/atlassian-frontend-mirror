# @atlaskit/help-layout

## 4.2.9

### Patch Changes

- Updated dependencies

## 4.2.8

### Patch Changes

- Updated dependencies

## 4.2.7

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162) [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete version.json
- Updated dependencies

## 4.2.6

### Patch Changes

- [#37925](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37925) [`f01deb5e6ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f01deb5e6ab) - Use injected env vars instead of version.json

## 4.2.5

### Patch Changes

- [#35450](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35450) [`7bdb050c04e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7bdb050c04e) - Internal change to use space tokens for spacing properties. There is no visual change.

## 4.2.4

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443) [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies

## 4.2.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 4.2.2

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 4.2.1

### Patch Changes

- [#33218](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33218) [`7e051bad115`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e051bad115) - Internal change to enforce token usage for spacing properties. There is no expected visual or behaviour change.

## 4.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 4.1.15

### Patch Changes

- [#31643](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31643) [`ad5cbfa5a71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad5cbfa5a71) - Migrated use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 4.1.14

### Patch Changes

- Updated dependencies

## 4.1.13

### Patch Changes

- Updated dependencies

## 4.1.12

### Patch Changes

- [#28324](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28324) [`6455cf006b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6455cf006b3) - Builds for this package now pass through a tokens babel plugin, removing runtime invocations of the tokens() function and improving performance.

## 4.1.11

### Patch Changes

- Updated dependencies

## 4.1.10

### Patch Changes

- Updated dependencies

## 4.1.9

### Patch Changes

- Updated dependencies

## 4.1.8

### Patch Changes

- [#26424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26424) [`0c19f354255`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c19f354255) - Consolidate In Product Help & Self-Help Experiences ownership

## 4.1.7

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874) [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 4.1.6

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492) [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 4.1.5

### Patch Changes

- Updated dependencies

## 4.1.4

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650) [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4
- Updated dependencies

## 4.1.3

### Patch Changes

- Updated dependencies

## 4.1.2

### Patch Changes

- Updated dependencies

## 4.1.1

### Patch Changes

- Updated dependencies

## 4.1.0

### Minor Changes

- [#19089](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19089) [`b03b488246c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b03b488246c) - [ux] Added new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).

  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

## 4.0.1

### Patch Changes

- [#16511](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16511) [`78c9f070230`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78c9f070230) - Bump algoliasearch version from ^3.33.0 to ^3.35.1. In @atlaskit/help we updated the example 3 and moved Algolia API related code to it's own react hook

## 4.0.0

### Major Changes

- [#14810](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14810) [`47f58da5946`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47f58da5946) - ED-13322, ED-13324, ED-13326, ED-13323, ED-13204: Upgrade and support react-intl@^5.18.1 including breaking API changes, types and tests in atlassian-frontend packages

  What changed: Upgraded our react-intl support from ^2.6.0 to ^5.18.1. This means editor packages now rely on consumers installing ^5.18.1, otherwise editor usage of react-intl will mismatch with actual installed react-intl APIs.
  Why change was made: As part of a coordinated upgrade effort across AF packages, as react-intl v2 is quite dated.
  How consumer should update their code: Ensure react-intl ^5.18.1 is installed in consuming applications.

  Upgrade guide: To consume atlassian-frontend packages that use react-intl5 setup a second provider for the new version, using an npm alias

  ```js
  "react-intl": "^2.6.0",
  "react-intl-next": "npm:react-intl@^5.18.1",
  ```

  ```js
  import { IntlProvider } from 'react-intl';
  import { IntlProvider as IntlNextProvider } from 'react-intl-next';

  return (
    <IntlProvider
      key={locale}
      data-test-language={locale}
      locale={locale}
      defaultLocale={DEFAULT_LOCALE}
      messages={messages}
    >
      <IntlNextProvider
        key={locale}
        data-test-language={locale}
        locale={locale}
        defaultLocale={DEFAULT_LOCALE}
        messages={messages}
      >
        {children}
      </IntlNextProvider>
    </IntlProvider>
  );
  ```

## 3.0.3

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- [#13328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13328) [`df9dc928897`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df9dc928897) - Update the team information in the packages maintained by the In Product Help team

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [#10051](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10051) [`cbed2edbd0c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cbed2edbd0c) - [ux] Ranamed prop "title" to "headerTitle". Added the prop "headerContent" where we can pass a React.node to render underneath the header title

## 2.0.7

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857) [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 2.0.6

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497) [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 2.0.5

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- [#5164](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5164) [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo analytics-next file restructure to allow external ts definitions to continue working

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885) [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 2.0.0

### Major Changes

- [#3711](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3711) [`3f24892368`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f24892368) - Added help-layout component to the atlaskit library
