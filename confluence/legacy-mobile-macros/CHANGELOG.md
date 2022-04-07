# @atlaskit/legacy-mobile-macros

## 2.0.4

### Patch Changes

- Updated dependencies

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [`541edde8e78`](https://bitbucket.org/atlassian/atlassian-frontend/commits/541edde8e78) - [ux] Fixed a broken `text-color` CSS property inside `packages/confluence/legacy-mobile-macros/src/ui/ChartPlaceholder/index.tsx`

## 2.0.0

### Major Changes

- [`c45cdcd7dff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c45cdcd7dff) - [ux] Adds support for rendering macros inline on mobile using the contentRenderer query. This change is only enabled when appropriate values are provided in a rendering strategy map from the Confluence native mobile apps.
- [`e63d6997782`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e63d6997782) - Macros rendered by the legacy-mobile-macros package will now fire a macro viewed analytics event when rendered

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [`c17b3fd9e67`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c17b3fd9e67) - [ux] Adds support for rendering the chart extension through macro fallback on mobile

### Patch Changes

- [`f61c5b89050`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f61c5b89050) - Loads superbatch tags from mobile macro config promise
- Updated dependencies

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Switches Confluence mobile macros to use the extension provider API instead of extension handlers
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - [ux] Adds a placeholder for the chart extension in the mobile renderer

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - ED-13753 update editor-common import confluence
- Updated dependencies

## 1.0.4

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

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

### Patch Changes

- Updated dependencies

## 0.5.3

### Patch Changes

- Updated dependencies

## 0.5.2

### Patch Changes

- Updated dependencies

## 0.5.1

### Patch Changes

- Updated dependencies

## 0.5.0

### Minor Changes

- [`c12de6a20ae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c12de6a20ae) - [ux] Anchor links macro is now rendered inline and allows for scrolling to anchor

### Patch Changes

- Updated dependencies

## 0.4.0

### Minor Changes

- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Confluence legacy mobile macro fallback strings are now localized

### Patch Changes

- Updated dependencies

## 0.3.21

### Patch Changes

- Updated dependencies

## 0.3.20

### Patch Changes

- Updated dependencies

## 0.3.19

### Patch Changes

- [`b95863772be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b95863772be) - Support external observers.
  Use better naming for refNode (refNode => reference).
  In favor of further work (supporting multiple references) pass array of references to Extension component.
  Expand node with localId for extentions.
- Updated dependencies

## 0.3.18

### Patch Changes

- Updated dependencies

## 0.3.17

### Patch Changes

- Updated dependencies

## 0.3.16

### Patch Changes

- Updated dependencies

## 0.3.15

### Patch Changes

- Updated dependencies

## 0.3.14

### Patch Changes

- Updated dependencies

## 0.3.13

### Patch Changes

- Updated dependencies

## 0.3.12

### Patch Changes

- Updated dependencies

## 0.3.11

### Patch Changes

- Updated dependencies

## 0.3.10

### Patch Changes

- Updated dependencies

## 0.3.9

### Patch Changes

- Updated dependencies

## 0.3.8

### Patch Changes

- Updated dependencies

## 0.3.7

### Patch Changes

- Updated dependencies

## 0.3.6

### Patch Changes

- Updated dependencies

## 0.3.5

### Patch Changes

- Updated dependencies

## 0.3.4

### Patch Changes

- Updated dependencies

## 0.3.3

### Patch Changes

- Updated dependencies

## 0.3.2

### Patch Changes

- Updated dependencies

## 0.3.1

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [`b15bcd24496`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b15bcd24496) - [ux] Link presentation for mobile macros is being disabled due to issues with the approach to rendering those links. Macros that were intended to be rendered as links on mobile will revert to the previous macro fallback behavior until this issue is resolved.

### Patch Changes

- Updated dependencies

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [`5a657f8d9fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a657f8d9fb) - [ux] Google and Trello macros will now render as links on mobile instead of using the mobile macro fallback

### Patch Changes

- Updated dependencies

## 0.1.5

### Patch Changes

- Updated dependencies

## 0.1.4

### Patch Changes

- Updated dependencies

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [`8a93403847`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a93403847) - readability updated
- Updated dependencies

## 0.1.0

### Minor Changes

- [`622ae0dc66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/622ae0dc66) - [ux] added macros and dark theme support with query params configuration

### Patch Changes

- Updated dependencies
