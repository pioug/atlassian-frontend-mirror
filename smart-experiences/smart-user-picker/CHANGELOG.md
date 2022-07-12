# @atlassian/smart-user-picker

## 5.1.2

### Patch Changes

- [`7536b86964b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7536b86964b) - Update context key for URS from orgId to organizationId

## 5.1.1

### Patch Changes

- [`ff97c74b6f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff97c74b6f0) - Add TeamMember as export from user-picker

## 5.1.0

### Minor Changes

- [`cc40ab95bd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc40ab95bd4) - Adds a list of team members under OptionData for Teams

### Patch Changes

- Updated dependencies

## 5.0.5

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 5.0.4

### Patch Changes

- [`f805f47c19a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f805f47c19a) - Smart User Picker now catches errors emitted from the optional `onError` fallback data source, and also now only sends a UFO failure event if the primary data source (URS) fails AND the `onError` prop either fails or is not provided.

## 5.0.3

### Patch Changes

- Updated dependencies

## 5.0.2

### Patch Changes

- [`6fc78303271`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6fc78303271) - UFO measurement of how long it takes the list of users to be shown

## 5.0.1

### Patch Changes

- [`0850fe46fc8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0850fe46fc8) - Track mount errors in Smart User Picker

## 5.0.0

### Major Changes

- [`67ca990e9cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/67ca990e9cf) - Changing the URL for default value hydration from /graphql to /api/gateway/graphql

## 4.0.1

### Patch Changes

- [`73bf59c717d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73bf59c717d) - update dependency on @atlaskit/user-picker to ensure defaultValue fix is applied

## 4.0.0

### Major Changes

- [`5df1ae17438`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5df1ae17438) - @atlassian/smart-user-picker will now be made public and renamed @atlaskit/smart-user-picker to provide a 1-1 replacement for @atlaskit/user-picker/smart-user-picker (UR-3417).

## 3.1.0

### Minor Changes

- [`d2a8de20d08`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2a8de20d08) - Add support in SmartUserPicker for org id for team search

### Patch Changes

- Updated dependencies

## 3.0.5

### Patch Changes

- [`e4109a66653`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4109a66653) - Smart user picker initial render performance is now measured using @atlassian/ufo

## 3.0.4

### Patch Changes

- [`7f48efc8487`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f48efc8487) - Use baseUrl prop in default user value hydration query

## 3.0.3

### Patch Changes

- [`405d07e48fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/405d07e48fa) - updating props doc

## 3.0.2

### Patch Changes

- [`9fd6117d5e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fd6117d5e4) - Fix behavior of base URL so that API calls use baseUrl as base url

## 3.0.1

### Patch Changes

- [`c55c736ecea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55c736ecea) - Patch VULN AFP-3486 AFP-3487 AFP-3488 AFP-3489

## 3.0.0

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

## 2.1.4

### Patch Changes

- [`b85e7ce12cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b85e7ce12cd) - Internal upgrade of memoize-one to 6.0.0

## 2.1.3

### Patch Changes

- [`a92e3bdb515`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a92e3bdb515) - Relaxed product enum typing to take in any string

## 2.1.2

### Patch Changes

- [`93c8a8f0bd5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93c8a8f0bd5) - Expose types from @atlaskit/user-picker from smart-user-picker

## 2.1.1

### Patch Changes

- [`4ac918aad80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ac918aad80) - Added helper documentation for easier onboarding onto Atlaskit Editor

## 2.1.0

### Minor Changes

- [`674d31d565e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/674d31d565e) - Added default value hydration for non-jira/conf products, team default value hydration, and changed default debounce time to 150ms

## 2.0.0

### Major Changes

- [`ccda387eede`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ccda387eede) - smart-user-picker extracted out from user-picker to smart-user-picker package. smart-user-picker in user-picker is now deprecated but still backwards compatible. Please use @atlassian/smart-user-picker for smart-user-picker.

### Patch Changes

- [`5ac7831fc59`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ac7831fc59) - updating UP dependency
- Updated dependencies

## 1.0.1

### Patch Changes

- [`869e1fdef2f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/869e1fdef2f) - [ux] Prioritize filterOptions prop over onEmpty. Now, filterOptions is called AFTER onEmpty is applied to URS suggestions. This means that SUP can show empty results if filterOptions filters out all results. This fixes a bug where updated filterOptions does not get applied to suggestions.
