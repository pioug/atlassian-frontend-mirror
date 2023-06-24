# @atlaskit/embedded-confluence

## 2.4.0

### Minor Changes

- [`5cd96271a12`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5cd96271a12) - Adding ability to disable the new Share button via allowedFeatures.

## 2.3.0

### Minor Changes

- [`ea29cc6a723`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea29cc6a723) - [ux] Add new themeState prop to EP components to enable theming

## 2.2.3

### Patch Changes

- [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies

## 2.2.2

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 2.2.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 2.2.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

## 2.1.0

### Minor Changes

- [`a1691c43c75`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1691c43c75) - Add a new prop for navigationPolicy to include A list of domain names that should be replaced with the current base URL for EP before applying any URL shimming.

## 2.0.1

### Patch Changes

- [`6c2f04ad9f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c2f04ad9f2) - [ux] Remove the 'edit' allowed feature for ViewPage and Page component's initialAllowedFeatures to avoid SSR related errors. ('edit' will be reapplied after initial SSR components are replaced)

## 2.0.0

### Major Changes

- [`2f6fdbc8560`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f6fdbc8560) - Login Flow for cross-domain parent products

### Enabling the Login/Authentication flow for EP:

1. **What's changed:**

   - Embedded Pages now allow users to authenticate within it and also request for its first-party storage.
     - Embedded Pages is using `Document.hasStorageAccess()` to check if it has access to its first-party storage and it will prompt users to `“Allow”` access by calling `Document.requestStorageAccess()`. Depending on the user agent implementation, the user agent might show user prompts (More details can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API)).
     - Once the first-party storage access is granted, users can login or sign up. The Login/Sign Up page is opened in a new window which will take users through the Login/Sign up flow.

2. **Why it's changed:**

   - With the Login flow the end user is taken through an authentication process within EP which doesn't require them to navigate out of the parent products to Login to Confluence. This also mitigates the problem of having to enable 3rd party cookies in the browser settings before loading EP for a cross-domain context (3rd party parent products).

3. **Upgrade guide:**
   - Partner products that have subscribed to `"Unable to display page content"` `taskAbort` event to display their own login page should also subscribe to the `embedded-confluence/login-page` `taskStart` experience tracker event.
   - No upgrade changes required for partner products that have not subscribed to `"Unable to display page content"` `taskAbort`.
   - For partner products who wish to display their own authentication flow, please subscribe to `embedded-confluence/login-page` `taskStart` and `"Unable to display page content"` `taskAbort` event (Refer the [Atlaskit documentation](https://atlaskit.atlassian.com/packages/confluence/embedded-confluence-public/docs/Experience-Tracker) for more information on these events).

## 1.9.0

### Minor Changes

- [`51d55d1c0d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/51d55d1c0d8) - [ux] Add Page component to allow simple implementation of in place switching between ViewPage and EditPage components.

## 1.8.0

### Minor Changes

- [`418447c456d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/418447c456d) - [ux] Add new themeMode prop to EP components to enable theming

## 1.7.0

### Minor Changes

- [`db2e7822839`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db2e7822839) - [ux] Added toggle for space selector in templates browser

## 1.6.3

### Patch Changes

- [`99ab0322881`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99ab0322881) - [ux] Set default value of hasFooterLogo to true, so that when getting hasFooterLogo as undefined from JSM it still shows the footer container

## 1.6.2

### Patch Changes

- [`df6307e601e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df6307e601e) - Revert "Powered by Confluence" footer display order change to fix a UI regression bug happening on Project Pages

## 1.6.1

### Patch Changes

- [`e7023873ce8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7023873ce8) - [ux] Fix to not overflow content outside Embedded page for parent products not using the default height set content feature.

## 1.6.0

### Minor Changes

- [`5335d7264c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5335d7264c1) - This change introduces a hash property to the edit, view, and page component so that Embedded Confluence recognizes the appended anchor link parameter when linking to a selected portion of a Confluence page.

## 1.5.1

### Patch Changes

- [`eab6a3a2f4d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eab6a3a2f4d) - package size optimization

## 1.5.0

### Minor Changes

- [`6b184b6ecdd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b184b6ecdd) - State management for Storage access and Login flow for EP. This feature is gated by the login-dev-only allow feature

## 1.4.1

### Patch Changes

- [`3387a13de43`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3387a13de43) - removed typo from edit component

## 1.4.0

### Minor Changes

- [`9e5a4003c80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e5a4003c80) - Update the error screen when embedded confluence iframe failed to load

## 1.3.4

### Patch Changes

- [`0bd0e835ff7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0bd0e835ff7) - Fix footer logo misalignment

## 1.3.3

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 1.3.2

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 1.3.1

### Patch Changes

- [`c6d5f628b85`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6d5f628b85) - Remove the temporary patch for fixing SSR issue caused by dasherized locale

## 1.3.0

### Minor Changes

- [`fef6f1ffea6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fef6f1ffea6) - Add 'template-browser' in the allowedFeatures, if included, the embedded confluence URL should contain query param `?inEditorTemplatesPanel=auto_closed`

## 1.2.1

### Patch Changes

- [`4a4c40be7b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a4c40be7b4) - Fix SSR (server-side rendering) stopped working with the dash in locale query param

## 1.2.0

### Minor Changes

- [`bfe9ff99aea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bfe9ff99aea) - Accept `locale` as an optional React prop for React components

## 1.1.0

### Minor Changes

- [`163e573186e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/163e573186e) - Support localization based on locale info provided by parent product

## 1.0.1

### Patch Changes

- [`4d30d4a0b8f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d30d4a0b8f) - Updating user documentation for @atlaskit/embedded-confluence

## 1.0.0

### Major Changes

- [`eb3d79230ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb3d79230ea) - First release of Confluence Embeddable Pages package!

## 0.1.1

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [`1e1848e5689`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e1848e5689) - [ux] Instrumented '@atlaskit/embedded-confluence' with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).
  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

## 0.0.9

### Patch Changes

- [`884191bbb30`](https://bitbucket.org/atlassian/atlassian-frontend/commits/884191bbb30) - Update Copyright 2022 Atlassian Pty Ltd

## 0.0.8

### Patch Changes

- [`12c6ef62cb6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12c6ef62cb6) - Fix build/tsconfig.json to exclude examples folder in `src`.

## 0.0.7

### Patch Changes

- Updated dependencies

## 0.0.6

### Patch Changes

- [`63369507489`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63369507489) - Update build/tsconfig.json to exclude tests and examples.

## 0.0.5

### Patch Changes

- [`524b20aff9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/524b20aff9a) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs
- [`3c0349f272a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c0349f272a) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs
- [`591d34f966f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/591d34f966f) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs

## 0.0.4

### Patch Changes

- [`229b32842b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/229b32842b5) - Fix .npmignore and tsconfig.json for **tests**

## 0.0.3

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 0.0.2

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 0.0.1

### Patch Changes

- [`b443b5a60f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b443b5a60f) - Renamed template package
