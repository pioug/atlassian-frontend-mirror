# @atlaskit/help-layout

## 4.1.4

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4
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

- [`b03b488246c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b03b488246c) - [ux] Added new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).

  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

## 4.0.1

### Patch Changes

- [`78c9f070230`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78c9f070230) - Bump algoliasearch version from ^3.33.0 to ^3.35.1. In @atlaskit/help we updated the example 3 and moved Algolia API related code to it's own react hook

## 4.0.0

### Major Changes

- [`47f58da5946`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47f58da5946) - ED-13322, ED-13324, ED-13326, ED-13323, ED-13204: Upgrade and support react-intl@^5.18.1 including breaking API changes, types and tests in atlassian-frontend packages

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

- [`df9dc928897`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df9dc928897) - Update the team information in the packages maintained by the In Product Help team

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [`cbed2edbd0c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cbed2edbd0c) - [ux] Ranamed prop "title" to "headerTitle". Added the prop "headerContent" where we can pass a React.node to render underneath the header title

## 2.0.7

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 2.0.6

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 2.0.5

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo analytics-next file restructure to allow external ts definitions to continue working

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 2.0.0

### Major Changes

- [`3f24892368`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f24892368) - Added help-layout component to the atlaskit library
