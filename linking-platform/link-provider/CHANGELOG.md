# @atlaskit/link-provider

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
