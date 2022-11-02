# @atlaskit/link-provider

## 1.3.3

### Patch Changes

- [`f21edecaac4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f21edecaac4) - Don't initiate a fetch for a url if there is already another request in progress for the same url

## 1.3.2

### Patch Changes

- [`6af519d2a17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6af519d2a17) - Upgrade json-ld-types from 3.0.2 to 3.1.0

## 1.3.1

### Patch Changes

- [`fd4495cc938`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd4495cc938) - [ux] Jira Work Management (JWM) Summary view links will be converted into smart link embed by default

## 1.3.0

### Minor Changes

- [`3d99b313302`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3d99b313302) - `CardClient` and `EditorCardProvider` members now accept second optional argument called `baseUrlOverride`.
  When provided, first argument `envKey` is ignored and provided override url is used as a base for object-resolver-service calls.
  For example, if `https://api-gateway.trellis.coffee/gateway/api` is provided, final fetching url would be `https://api-gateway.trellis.coffee/gateway/api/object-resolver`.

## 1.2.9

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 1.2.8

### Patch Changes

- [`86c47a3f711`](https://bitbucket.org/atlassian/atlassian-frontend/commits/86c47a3f711) - Added search ratelimit error
- Updated dependencies

## 1.2.7

### Patch Changes

- [`90ceb732d6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/90ceb732d6d) - Improved speed of resolving links due to single /resolve call and no more /check calls before that

## 1.2.6

### Patch Changes

- [`61acd5bc2d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61acd5bc2d0) - Added more search errors
- Updated dependencies

## 1.2.5

### Patch Changes

- [`534ebc3f2da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/534ebc3f2da) - This changes fatal errors to return an APIError with a message that has been piped through `JSON.stringify()` instead of `.toString()` to gain more visibility into the underlying error.

## 1.2.4

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 1.2.3

### Patch Changes

- [`d043517e947`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d043517e947) - [ux] Adds avatarUrl and unauthorised description to Forge Plugin

## 1.2.2

### Patch Changes

- [`779661fb6b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/779661fb6b9) - Fix matching logic to support non letter characters at start or end of urlSegment

## 1.2.1

### Patch Changes

- [`0c7b099146e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c7b099146e) - Improve path matching of user link preferences

## 1.2.0

### Minor Changes

- [`3b5e61f9b3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b5e61f9b3b) - [ux] Adds in TAB UI support for Link Picker

### Patch Changes

- Updated dependencies

## 1.1.5

### Patch Changes

- [`e15410365b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e15410365b2) - - export types/functions in linking common to be used in smart card

  - add flag to card action to override re-using previous 'resolved' state

  - add prop to cardState which reflects the metadata state, can be pending, resolved or errored

  - modified reducer and dispatchers to handle these new props

- Updated dependencies

## 1.1.4

### Patch Changes

- [`0377d53f311`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0377d53f311) - Properly process case when old editor uses new component AND we have user preferences coming from /providers

## 1.1.3

### Patch Changes

- [`263ef1e543b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/263ef1e543b) - Change data structure of lpup data we get

## 1.1.2

### Patch Changes

- [`4c73e4d0cfa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c73e4d0cfa) - Add optional argument to CardProvider.resolve method identifying if it's a manual request or not

## 1.1.1

### Patch Changes

- [`74fdf4bb16b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/74fdf4bb16b) - Fix problem when for public links one can't go back to smart-link via dropdown after switching to URL

## 1.1.0

### Minor Changes

- [`896bfc34e67`](https://bitbucket.org/atlassian/atlassian-frontend/commits/896bfc34e67) - Added search API to the client

## 1.0.8

### Patch Changes

- [`cd5e63258cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd5e63258cd) - Moved extractors to linking-common/extractors
- Updated dependencies

## 1.0.7

### Patch Changes

- [`d45fd532d5e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d45fd532d5e) - [ux] Make form smart link view as embed view by default

## 1.0.6

### Patch Changes

- [`b2032a5f6e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2032a5f6e3) - Add FF support to <LinkProvider />

  ```
  import { SmartCardProvider, useFeatureFlag } from '@atlaskit/link-provider';

  const MyComponent = () => {
    const showHoverPreview = useFeatureFlag('showHoverPreview')

    return (
      <>
        {showHoverPreview}
      </>
    )
  }

  <SmartCardProvider featureFlags={{showHoverPreview: true}}>
    <MyComponent />
  </SmartCardProvider>
  ```

## 1.0.5

### Patch Changes

- [`e09ea69c384`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e09ea69c384) - Introduce argument shouldForceAppearance to EditorCardProvider.resolve signature

## 1.0.4

### Patch Changes

- [`f538640e3a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f538640e3a5) - fix: Previously the .reload() action would not propagate changes through to the smart-card state in some scenarios. This has been amended by making it an explicit Redux action.

## 1.0.3

### Patch Changes

- [`50b81e07a35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50b81e07a35) - Version of package 'json-ld-types' was upgraded to 2.4.2

## 1.0.2

### Patch Changes

- [`06df1d75255`](https://bitbucket.org/atlassian/atlassian-frontend/commits/06df1d75255) - Use new defaultView property of /providers endpoint to decide what view link should be render as

## 1.0.1

### Patch Changes

- [`28410ec919d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/28410ec919d) - Flexible UI: Passing JsonLD response on authFlow disabled

## 1.0.0

### Major Changes

- [`99fa7e54884`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99fa7e54884) - Move non critical things into linking-common & release first stable version

### Patch Changes

- Updated dependencies

## 0.1.3

### Patch Changes

- [`8b9f08cbc1c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b9f08cbc1c) - [ux] Default representation for Slack links was changed from 'block' to 'inline'

## 0.1.2

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 0.1.1

### Patch Changes

- [`eaa0b52d49e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eaa0b52d49e) - Introduce @atlaskit/link-provider
