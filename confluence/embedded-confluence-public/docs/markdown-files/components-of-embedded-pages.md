# Components

## View Page

`@atlaskit/embedded-confluence` exports `ViewPage` component.

Within your React component, you can import the component from the package and then compose it.

```javascript
// Given a confluence page located at:
// https://acmeexample.atlassian.net/wiki/spaces/ABC/pages/1234
// and given parentProduct value = "PRODUCT"

import { ViewPage } from '@atlaskit/embedded-confluence';
import { useThemeObserver } from '@atlaskit/tokens';

const MyComponent = props => {
  //Get the themeState Object from useThemeObserver or you can create your own Object for 3rd party products
  const themeState = useThemeObserver();
  //For the latest list of supported fields in `themeState` Object please visit the design systems documentation : https://atlassian.design/components/tokens/code#setglobalthemethemestate-themeloader
  return (
    <ArticleWrapper>
      <ViewPage
        contentId={'1234'}
        locale={'en-US'}
        hostname={'acmeexample.atlassian.net'}
        parentProduct={'PRODUCT'}
        spaceKey={'ABC'}
        themeState={themeState}
      />
    </ArticleWrapper>
  );
};
```

#### Component API

| Property name             | Type                                                                                                                             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `allowedFeatures`         | string[]                                                                                                                         | **(Optional)** - If provided, only features included in the list will be enabled, features not in the list will be disabled. `[]` will disable all features. `'all'` will enable all features. If not provided, default features: byline-contributors, byline-extensions, page-comments, page-reactions, will be enabled. see [description](/packages/confluence/embedded-confluence-public/docs/API-References#allowedfeatures-description) for more. |
| `className`               | string                                                                                                                           | **(Optional)** - If provided, the custom class name will be added on the container element                                                                                                                                                                                                                                                                                                                                                             |
| `contentId`               | string                                                                                                                           | The Id of content from Confluence perspective                                                                                                                                                                                                                                                                                                                                                                                                          |
| `hostname`                | string                                                                                                                           | The Confluence Cloud tenant you want to connect to. This is required when 3rd party is on a different domain than Confluence                                                                                                                                                                                                                                                                                                                           |
| `isHeightSetFromContent ` | boolean                                                                                                                          | **(Optional)** - If provided, the height of the view component will be set to the height of the confluence content being rendered                                                                                                                                                                                                                                                                                                                      |
|                           |
| `locale`                  | string                                                                                                                           | **(Optional)** - Locale string for localization. The default locale is `"en-US"`. Please refer to API-References page for a list of other valid values.                                                                                                                                                                                                                                                                                                |
| `navigationPolicy`        | Object, see [definition](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-definition)        | **(Optional)** See [description](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-description) and [examples](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-examples)                                                                                                                                                                                                       |
| `parentProduct`           | string                                                                                                                           | Value that is associated with corresponding platform that is embedding Confluence pages. Required to properly embed. If unsure of what this string value is, please reach out to Atlassian/an Atlassian representative.                                                                                                                                                                                                                                |
| `spaceKey`                | string                                                                                                                           | The key of space the content belongs to, from Confluence perspective.                                                                                                                                                                                                                                                                                                                                                                                  |
| `themeState`              | `ThemeState`, see [definition](/packages/confluence/embedded-confluence-public/docs/markdown-files/api-references.md#themeState) | **(Optional)** An optional value that represents the theme preference of the platform that is embedding Confluence pages. For the latest list of supported fields in `themeState` Object please visit the design systems documentation [here](https://atlassian.design/components/tokens/code#setglobalthemethemestate-themeloader)                                                                                                                    |

## Edit Page

`@atlaskit/embedded-confluence` exports `EditPage` component.

Within your React component, you can import the component from the package and then compose it.

```jsx
// Given a confluence page located at:
// https://acmeexample.atlassian.net/wiki/spaces/ABC/pages/edit-v2/1234
// and given parentProduct value = "PRODUCT"

import { EditPage } from '@atlaskit/embedded-confluence';
import { useThemeObserver } from '@atlaskit/tokens';

const MyComponent = props => {
  //Get the themeState Object from useThemeObserver or you can create your own Object for 3rd party products
  const themeState = useThemeObserver();
  // For the latest list of supported fields in `themeState` Object please visit the design systems documentation : https://atlassian.design/components/tokens/code#setglobalthemethemestate-themeloader
  return (
    <ArticleWrapper>
      <EditPage
        contentId={'1234'}
        locale={'en-US'}
        hostname={'acmeexample.atlassian.net'}
        parentProduct={'PRODUCT'}
        spaceKey={'ABC'}
        themeState={themeState}
      />
    </ArticleWrapper>
  );
};
```

#### Component API

| Property name      | Type                                                                                                                             | Description                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowedFeatures`  | string[]                                                                                                                         | **(Optional)** - If provided, only features included in the list will be enabled, features not in the list will be disabled. `[]` will disable all features. `'all'` will enable all features. If not provided, default features (none so far in the editing mode) will be enabled. see [description](/packages/confluence/embedded-confluence-public/docs/API-References#allowedfeatures-description) for more. |
| `contentId`        | string                                                                                                                           | The Id of content from Confluence perspective                                                                                                                                                                                                                                                                                                                                                                    |
| `draftShareId`     | string                                                                                                                           | **(Optional)** - It is required only for **Unpublished Draft**. **Unpublished Draft** is a Confluence page that has not been published yet. Users (with exception the author) needs a valid `draftShareId` to have permission to view it. When a page is created, Confluence will generate a `draftShareId`.                                                                                                     |
| `hostname`         | string                                                                                                                           | The Confluence Cloud tenant you want to connect to. This is required when 3rd party is on a different domain than Confluence                                                                                                                                                                                                                                                                                     |
| `navigationPolicy` | Object, see [definition](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-definition)        | **(Optional)** - (See [description](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-description) and [examples](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-examples)                                                                                                                                                              |
| `locale`           | string                                                                                                                           | **(Optional)** - Locale string for localization. The default locale is `"en-US"`.                                                                                                                                                                                                                                                                                                                                |
| `parentProduct`    | string                                                                                                                           | Value that is associated with corresponding platform that is embedding Confluence pages. Required to properly embed. If unsure of what this string value is, please reach out to Atlassian/an Atlassian representative.                                                                                                                                                                                          |
| `themeState`       | `ThemeState`, see [definition](/packages/confluence/embedded-confluence-public/docs/markdown-files/api-references.md#themeState) | **(Optional)** An optional value that represents the theme preference of the platform that is embedding Confluence pages. For the latest list of supported fields in `themeState` Object please visit the design systems documentation [here](https://atlassian.design/components/tokens/code#setglobalthemethemestate-themeloader)                                                                              |

### Note

- To handle navigation when user click on the "Close" button, please subscribe to experience tracker event: `"taskSuccess"` of `"edit-page/close"` experience. Please refer to Experience Tracker section for more details.
- To handle navigation when publish is successful after user click on the "Publish" button, please subscribe to experience tracker event: `"taskSuccess"` of `"edit-page/publish"` experience. For failed publish, you can subscribe to `"taskFail"` of the `"edit-page/publish"` experience. Please refer to Experience Tracker section for more details.

## Page

`@atlaskit/embedded-confluence` exports `Page` component.

Within your React component, you can import the component from the package and then compose it.

Unlike `ViewPage`, the `Page` component renders the `ViewPage` component that can then be switched between `View` and `Edit` components. `url:string` is a highly recommended property to be passed in. `Page` parses this URL and extracts properties including protocol, hostname, content id, space key, parent product. If any of those URL-parsed properties are also explicitly passed in, then those passed-in properties will take priority over URL-parsed properties. The URL does not have to include a protocol or domain. Protocol by default will be "https:" and domain will be default be the same as `window.location`.

`Page` matches this URL against a predicate of routes that embedded Confluence will support. Currently we support the following routes:

- View Page: `/wiki/spaces/:spaceKey/pages/:contentId(\\d+)/:contentSlug?`
- View Blog: `/wiki/spaces/:spaceKey/blog/:contentId(\\d+)/:contentSlug?`
- View Blog Date Legacy: `/wiki/spaces/:spaceKey/blog/:year(\\d+)/:month(\\d+)/:day(\\d+)/:contentId(\\d+)/:contentSlug?`

If an unsupported URL is passed in, you should be able to see the corresponding error message in the console and `Page` will not render anything.

#### Note

In case of the unpublished draft page, `Page` component can't display a `ViewPage` because the actual page for `View` doesn't exist. For this case, Parent Product should use the `EditPage` component instead.

```jsx
// Given a confluence page located at:
// https://acmeexample.atlassian.net/wiki/spaces/ABC/pages/1234
// and given parentProduct value = "PRODUCT"

import { Page } from '@atlaskit/embedded-confluence';

const MyComponent = props => {
  return (
    <ArticleWrapper>
      <Page
        url={
          'https://acmeexample.atlassian.net/wiki/spaces/ABC/pages/123?parentProduct=PRODUCT'
        }
      />
    </ArticleWrapper>
  );
};
```

#### Component API

| Property name                     | Type                                                                                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowedFeatures`                 | object                                                                                                                    | **(Optional)** An object which has `view` and `edit` keys which provide `allowedFeatures` props for both `View` and `Edit` components. See [description](/packages/confluence/embedded-confluence-public/docs/API-References#allowedfeatures-description) for more.                                                                                                                                                                                                    |
| `className`                       | string                                                                                                                    | **(Optional)** If provided, the custom class name will be added on the container element                                                                                                                                                                                                                                                                                                                                                                               |
| `contentId`                       | string                                                                                                                    | **(Optional)** The Id of content from Confluence perspective                                                                                                                                                                                                                                                                                                                                                                                                           |
| `hash`                            | string                                                                                                                    | **(Optional)** Points a browser to a specific spot within a Confluence page.                                                                                                                                                                                                                                                                                                                                                                                           |
| `hostname`                        | string                                                                                                                    | **(Optional)** The Confluence Cloud tenant you want to connect to. This is required when parent product is on a different domain than Confluence                                                                                                                                                                                                                                                                                                                       |
| `locale`                          | string                                                                                                                    | **(Optional)** Locale string for localization. The default locale is `"en-US"`.                                                                                                                                                                                                                                                                                                                                                                                        |
| `navigationPolicy`                | Object, see [definition](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-definition) | **(Optional)** See [description](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-description) and [examples](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-examples)                                                                                                                                                                                                                       |
| `parentProduct`                   | string                                                                                                                    | **(Optional)** The parent product name string supported by Embedded Component                                                                                                                                                                                                                                                                                                                                                                                          |
| `parentProductContentContainerId` | string                                                                                                                    | **(Optional)** The Id of the parent product that have a mapping relationship with Confluence space. For example, for Jira, this could be the project Id. JSM can enable unlicensed user access by passing this prop.                                                                                                                                                                                                                                                   |
| `parentProductContentId`          | string                                                                                                                    | **(Optional)** The Id of content from parent product perspective. For example, for JSM, this could be the KB article Id.                                                                                                                                                                                                                                                                                                                                               |
| `spaceKey`                        | string                                                                                                                    | **(Optional)** The key of space the content belongs to, from Confluence perspective.                                                                                                                                                                                                                                                                                                                                                                                   |
| `themeState`                      | Object                                                                                                                    | **(Optional)** an optional prop that can be provided to the Embedded components to ensure that they apply the same theme preference as their parent product. For the latest list of supported fields in `themeState` Object please visit the design systems documentation [here](https://atlassian.design/components/tokens/code#setglobalthemethemestate-themeloader). If no `themeState` is provided, the Embedded component will display with it's original styles. |
| `url`                             | string                                                                                                                    | **(Optional)** If provided, `contentId`, `spaceKey`, `parentProduct`, `hostname`, `protocol`, `draftShareId` and queries will be parsed from the URL. If those properties are provided along with `url`, then those properties takes priority over parsed properties from the `url`                                                                                                                                                                                    |

\*\* Even though all properties are optional, the required properties for `Page` to render an embedded Confluence page are `contentId`, `spaceKey`, and `parentProduct`. They can be passed in either explicitly or via URL.

# Components

## View Page

`@atlaskit/embedded-confluence` exports `ViewPage` component.

Within your React component, you can import the component from the package and then compose it.

```javascript
// Given a confluence page located at:
// https://acmeexample.atlassian.net/wiki/spaces/ABC/pages/1234
// and given parentProduct value = "PRODUCT"

import { ViewPage } from '@atlaskit/embedded-confluence';
import { useThemeObserver } from '@atlaskit/tokens';

const MyComponent = props => {
  //Get the themeState Object from useThemeObserver or you can create your own Object for 3rd party products
  const themeState = useThemeObserver(); // For the latest list of supported fields in `themeState` Object please visit the design systems documentation : https://atlassian.design/components/tokens/code#setglobalthemethemestate-themeloader
  return (
    <ArticleWrapper>
      <ViewPage
        contentId={'1234'}
        locale={'en-US'}
        hostname={'acmeexample.atlassian.net'}
        parentProduct={'PRODUCT'}
        spaceKey={'ABC'}
        themeState={themeState}
      />
    </ArticleWrapper>
  );
};
```

#### Component API

| Property name             | Type                                                                                                                             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `allowedFeatures`         | string[]                                                                                                                         | **(Optional)** - If provided, only features included in the list will be enabled, features not in the list will be disabled. `[]` will disable all features. `'all'` will enable all features. If not provided, default features: byline-contributors, byline-extensions, page-comments, page-reactions, will be enabled. see [description](/packages/confluence/embedded-confluence-public/docs/API-References#allowedfeatures-description) for more. |
| `className`               | string                                                                                                                           | **(Optional)** - If provided, the custom class name will be added on the container element                                                                                                                                                                                                                                                                                                                                                             |
| `contentId`               | string                                                                                                                           | The Id of content from Confluence perspective                                                                                                                                                                                                                                                                                                                                                                                                          |
| `hostname`                | string                                                                                                                           | The Confluence Cloud tenant you want to connect to. This is required when 3rd party is on a different domain than Confluence                                                                                                                                                                                                                                                                                                                           |
| `isHeightSetFromContent ` | boolean                                                                                                                          | **(Optional)** - If provided, the height of the view component will be set to the height of the confluence content being rendered                                                                                                                                                                                                                                                                                                                      |
|                           |
| `locale`                  | string                                                                                                                           | **(Optional)** - Locale string for localization. The default locale is `"en-US"`. Please refer to API-References page for a list of other valid values.                                                                                                                                                                                                                                                                                                |
| `navigationPolicy`        | Object, see [definition](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-definition)        | **(Optional)** See [description](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-description) and [examples](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-examples)                                                                                                                                                                                                       |
| `parentProduct`           | string                                                                                                                           | Value that is associated with corresponding platform that is embedding Confluence pages. Required to properly embed. If unsure of what this string value is, please reach out to Atlassian/an Atlassian representative.                                                                                                                                                                                                                                |
| `spaceKey`                | string                                                                                                                           | The key of space the content belongs to, from Confluence perspective.                                                                                                                                                                                                                                                                                                                                                                                  |
| `themeState`              | `ThemeState`, see [definition](/packages/confluence/embedded-confluence-public/docs/markdown-files/api-references.md#themeState) | **(Optional)** An optional value that represents the theme preference of the platform that is embedding Confluence pages. For the latest list of supported fields in `themeState` Object please visit the design systems documentation [here](https://atlassian.design/components/tokens/code#setglobalthemethemestate-themeloader).                                                                                                                   |

## Edit Page

`@atlaskit/embedded-confluence` exports `EditPage` component.

Within your React component, you can import the component from the package and then compose it.

```jsx
// Given a confluence page located at:
// https://acmeexample.atlassian.net/wiki/spaces/ABC/pages/edit-v2/1234
// and given parentProduct value = "PRODUCT"

import { EditPage } from '@atlaskit/embedded-confluence';
import { useThemeObserver } from '@atlaskit/tokens';

const MyComponent = props => {
  //Get the themeState Object from useThemeObserver or you can create your own Object for 3rd party products
  const themeState = useThemeObserver();
  // For the latest list of supported fields in `themeState` Object please visit the design systems documentation : https://atlassian.design/components/tokens/code#setglobalthemethemestate-themeloader
  return (
    <ArticleWrapper>
      <EditPage
        contentId={'1234'}
        locale={'en-US'}
        hostname={'acmeexample.atlassian.net'}
        parentProduct={'PRODUCT'}
        spaceKey={'ABC'}
        themeState={themeState}
      />
    </ArticleWrapper>
  );
};
```

#### Component API

| Property name      | Type                                                                                                                             | Description                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowedFeatures`  | string[]                                                                                                                         | **(Optional)** - If provided, only features included in the list will be enabled, features not in the list will be disabled. `[]` will disable all features. `'all'` will enable all features. If not provided, default features (none so far in the editing mode) will be enabled. see [description](/packages/confluence/embedded-confluence-public/docs/API-References#allowedfeatures-description) for more. |
| `contentId`        | string                                                                                                                           | The Id of content from Confluence perspective                                                                                                                                                                                                                                                                                                                                                                    |
| `draftShareId`     | string                                                                                                                           | **(Optional)** - It is required only for **Unpublished Draft**. **Unpublished Draft** is a Confluence page that has not been published yet. Users (with exception the author) needs a valid `draftShareId` to have permission to view it. When a page is created, Confluence will generate a `draftShareId`.                                                                                                     |
| `hostname`         | string                                                                                                                           | The Confluence Cloud tenant you want to connect to. This is required when 3rd party is on a different domain than Confluence                                                                                                                                                                                                                                                                                     |
| `navigationPolicy` | Object, see [definition](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-definition)        | **(Optional)** - (See [description](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-description) and [examples](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-examples)                                                                                                                                                              |
| `locale`           | string                                                                                                                           | **(Optional)** - Locale string for localization. The default locale is `"en-US"`.                                                                                                                                                                                                                                                                                                                                |
| `parentProduct`    | string                                                                                                                           | Value that is associated with corresponding platform that is embedding Confluence pages. Required to properly embed. If unsure of what this string value is, please reach out to Atlassian/an Atlassian representative.                                                                                                                                                                                          |
| `themeState`       | `ThemeState`, see [definition](/packages/confluence/embedded-confluence-public/docs/markdown-files/api-references.md#themeState) | **(Optional)** An optional value that represents the theme preference of the platform that is embedding Confluence pages. For the latest list of supported fields in `themeState` Object please visit the design systems documentation [here](https://atlassian.design/components/tokens/code#setglobalthemethemestate-themeloader).                                                                             |

### Note

- To handle navigation when user click on the "Close" button, please subscribe to experience tracker event: `"taskSuccess"` of `"edit-page/close"` experience. Please refer to Experience Tracker section for more details.
- To handle navigation when publish is successful after user click on the "Publish" button, please subscribe to experience tracker event: `"taskSuccess"` of `"edit-page/publish"` experience. For failed publish, you can subscribe to `"taskFail"` of the `"edit-page/publish"` experience. Please refer to Experience Tracker section for more details.

## Page

`@atlaskit/embedded-confluence` exports `Page` component.

Within your React component, you can import the component from the package and then compose it.

Unlike `ViewPage`, the `Page` component renders the `ViewPage` component that can then be switched between `View` and `Edit` components. `url:string` is a highly recommended property to be passed in. `Page` parses this URL and extracts properties including protocol, hostname, content id, space key, parent product. If any of those URL-parsed properties are also explicitly passed in, then those passed-in properties will take priority over URL-parsed properties. The URL does not have to include a protocol or domain. Protocol by default will be "https:" and domain will be default be the same as `window.location`.

`Page` matches this URL against a predicate of routes that embedded Confluence will support. Currently we support the following routes:

- View Page: `/wiki/spaces/:spaceKey/pages/:contentId(\\d+)/:contentSlug?`
- View Blog: `/wiki/spaces/:spaceKey/blog/:contentId(\\d+)/:contentSlug?`
- View Blog Date Legacy: `/wiki/spaces/:spaceKey/blog/:year(\\d+)/:month(\\d+)/:day(\\d+)/:contentId(\\d+)/:contentSlug?`

If an unsupported URL is passed in, you should be able to see the corresponding error message in the console and `Page` will not render anything.

#### Note

In case of the unpublished draft page, `Page` component can't display a `ViewPage` because the actual page for `View` doesn't exist. For this case, Parent Product should use the `EditPage` component instead.

```jsx
// Given a confluence page located at:
// https://acmeexample.atlassian.net/wiki/spaces/ABC/pages/1234
// and given parentProduct value = "PRODUCT"

import { Page } from '@atlaskit/embedded-confluence';

const MyComponent = props => {
  return (
    <ArticleWrapper>
      <Page
        url={
          'https://acmeexample.atlassian.net/wiki/spaces/ABC/pages/123?parentProduct=PRODUCT'
        }
      />
    </ArticleWrapper>
  );
};
```

#### Component API

| Property name                     | Type                                                                                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowedFeatures`                 | object                                                                                                                    | **(Optional)** An object which has `view` and `edit` keys which provide `allowedFeatures` props for both `View` and `Edit` components. See [description](/packages/confluence/embedded-confluence-public/docs/API-References#allowedfeatures-description) for more.                                                                                                                                                                                                    |
| `className`                       | string                                                                                                                    | **(Optional)** If provided, the custom class name will be added on the container element                                                                                                                                                                                                                                                                                                                                                                               |
| `contentId`                       | string                                                                                                                    | **(Optional)** The Id of content from Confluence perspective                                                                                                                                                                                                                                                                                                                                                                                                           |
| `hash`                            | string                                                                                                                    | **(Optional)** Points a browser to a specific spot within a Confluence page.                                                                                                                                                                                                                                                                                                                                                                                           |
| `hostname`                        | string                                                                                                                    | **(Optional)** The Confluence Cloud tenant you want to connect to. This is required when parent product is on a different domain than Confluence                                                                                                                                                                                                                                                                                                                       |
| `locale`                          | string                                                                                                                    | **(Optional)** Locale string for localization. The default locale is `"en-US"`.                                                                                                                                                                                                                                                                                                                                                                                        |
| `navigationPolicy`                | Object, see [definition](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-definition) | **(Optional)** See [description](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-description) and [examples](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-examples)                                                                                                                                                                                                                       |
| `parentProduct`                   | string                                                                                                                    | **(Optional)** The parent product name string supported by Embedded Component                                                                                                                                                                                                                                                                                                                                                                                          |
| `parentProductContentContainerId` | string                                                                                                                    | **(Optional)** The Id of the parent product that have a mapping relationship with Confluence space. For example, for Jira, this could be the project Id. JSM can enable unlicensed user access by passing this prop.                                                                                                                                                                                                                                                   |
| `parentProductContentId`          | string                                                                                                                    | **(Optional)** The Id of content from parent product perspective. For example, for JSM, this could be the KB article Id.                                                                                                                                                                                                                                                                                                                                               |
| `spaceKey`                        | string                                                                                                                    | **(Optional)** The key of space the content belongs to, from Confluence perspective.                                                                                                                                                                                                                                                                                                                                                                                   |
| `themeState`                      | Object                                                                                                                    | **(Optional)** an optional prop that can be provided to the Embedded components to ensure that they apply the same theme preference as their parent product. For the latest list of supported fields in `themeState` Object please visit the design systems documentation [here](https://atlassian.design/components/tokens/code#setglobalthemethemestate-themeloader). If no `themeState` is provided, the Embedded component will display with it's original styles. |
| `url`                             | string                                                                                                                    | **(Optional)** If provided, `contentId`, `spaceKey`, `parentProduct`, `hostname`, `protocol`, `draftShareId` and queries will be parsed from the URL. If those properties are provided along with `url`, then those properties takes priority over parsed properties from the `url`                                                                                                                                                                                    |

\*\* Even though all properties are optional, the required properties for `Page` to render an embedded Confluence page are `contentId`, `spaceKey`, and `parentProduct`. They can be passed in either explicitly or via URL.
