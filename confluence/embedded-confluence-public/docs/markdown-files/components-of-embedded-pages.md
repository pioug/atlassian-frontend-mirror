# Components

## View Page

`@atlaskit/embedded-confluence` exports `ViewPage` component.

Within your React component, you can import the component from the package and then compose it.

```javascript
import { ViewPage } from '@atlaskit/embedded-confluence';

const MyComponent = props => {
  return (
    <ArticleWrapper>
      <ViewPage
        contentId={props.contentId}
        locale={'en-US'}
        parentProductContentContainerId={props.parentProductContentContainerId}
        parentProduct={'JSM'}
        spaceKey={props.spaceKey}
      />
    </ArticleWrapper>
  );
};
```

#### Component API

| Property name                     | Type                                                                                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `allowedFeatures`                 | string[]                                                                                                                  | (Optional) If provided, only features included in the list will be enabled, features not in the list will be disabled. `[]` will disable all features. `'all'` will enable all features. If not provided, default features: byline-contributors, byline-extensions, page-comments, page-reactions, will be enabled. see [description](/packages/confluence/embedded-confluence-public/docs/API-References#allowedfeatures-description) for more. |
| `className`                       | string                                                                                                                    | (Optional) If provided, the custom class name will be added on the container element                                                                                                                                                                                                                                                                                                                                                             |
| `contentId`                       | string                                                                                                                    | The Id of content from Confluence perspective                                                                                                                                                                                                                                                                                                                                                                                                    |
| `hostname`                        | string                                                                                                                    | (Optional) The Confluence Cloud tenant you want to connect to. This is required when 3rd party is on a different domain than Confluence                                                                                                                                                                                                                                                                                                          |
| `isHeightSetFromContent `         | boolean                                                                                                                   | (Optional) If provided, the height of the view component will be set to the height of the confluence content being rendered                                                                                                                                                                                                                                                                                                                      |
|                                   |
| `locale`                          | string                                                                                                                    | (Optional) Locale string for localization. The default locale is `"en-US"`.                                                                                                                                                                                                                                                                                                                                                                      |
| `navigationPolicy`                | Object, see [definition](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-definition) | (Optional) See [description](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-description) and [examples](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-examples)                                                                                                                                                                                                     |
| `parentProduct`                   | string                                                                                                                    | The 3rd party name string supported by Embedded Component                                                                                                                                                                                                                                                                                                                                                                                        |
| `parentProductContentContainerId` | string                                                                                                                    | (Optional) The Id of the 3rd party that have a mapping relationship with Confluence space. For example, for Jira, this could be the project Id. JSM can enable unlicensed user access by passing this prop.                                                                                                                                                                                                                                      |
| `parentProductContentId`          | string                                                                                                                    | (Optional) The Id of content from 3rd party perspective. For example, for JSM, this could be the KB article Id.                                                                                                                                                                                                                                                                                                                                  |
| `spaceKey`                        | string                                                                                                                    | The key of space the content belongs to, from Confluence perspective.                                                                                                                                                                                                                                                                                                                                                                            |

## Edit Page

`@atlaskit/embedded-confluence` exports `EditPage` component.

Within your React component, you can import the component from the package and then compose it.

```jsx
import { EditPage } from '@atlaskit/embedded-confluence';

const MyComponent = props => {
  return (
    <ArticleWrapper>
      <EditPage
        contentId={props.contentId}
        locale={'en-US'}
        parentProductContentContainerId={props.parentProductContentContainerId}
        parentProduct={'JSM'}
        spaceKey={props.spaceKey}
      />
    </ArticleWrapper>
  );
};
```

#### Component API

| Property name                     | Type                                                                                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowedFeatures`                 | string[]                                                                                                                  | (Optional) If provided, only features included in the list will be enabled, features not in the list will be disabled. `[]` will disable all features. `'all'` will enable all features. If not provided, default features (none so far in the editing mode) will be enabled. see [description](/packages/confluence/embedded-confluence-public/docs/API-References#allowedfeatures-description) for more. |
| `contentId`                       | string                                                                                                                    | The Id of content from Confluence perspective                                                                                                                                                                                                                                                                                                                                                              |
| `draftShareId`                    | string                                                                                                                    | (Optional) - it is required only for **Unpublished Draft**. **Unpublished Draft** is a Confluence page that has not been published yet. Users (with exception the author) needs a valid `draftShareId` to have permission to view it. When a page is created, Confluence will generate a `draftShareId`.                                                                                                   |
| `hostname`                        | string                                                                                                                    | (Optional) The Confluence Cloud tenant you want to connect to. This is required when 3rd party is on a different domain than Confluence                                                                                                                                                                                                                                                                    |
| `navigationPolicy`                | Object, see [definition](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-definition) | (Optional) See [description](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-description) and [examples](/packages/confluence/embedded-confluence-public/docs/API-References#navigationpolicy-examples)                                                                                                                                                               |
| `locale`                          | string                                                                                                                    | (Optional) Locale string for localization. The default locale is `"en-US"`.                                                                                                                                                                                                                                                                                                                                |
| `parentProduct`                   | string                                                                                                                    | The 3rd party name string supported by Embedded Component                                                                                                                                                                                                                                                                                                                                                  |
| `parentProductContentContainerId` | string                                                                                                                    | (Optional) The Id of the 3rd party that have a mapping relationship with Confluence space. For example, for Jira, this could be the project Id. JSM can enable unlicensed user access by passing this prop.                                                                                                                                                                                                |
| `parentProductContentId`          | string                                                                                                                    | (Optional) The Id of content from 3rd party perspective. For example, for JSM, this could be the KB article Id.                                                                                                                                                                                                                                                                                            |

### Note

- To handle navigation when user click on the "Close" button, please subscribe to experience tracker event: `"taskSuccess"` of `"edit-page/close"` experience. Please refer to Experience Tracker section for more details.
- To handle navigation when publish is successful after user click on the "Publish" button, please subscribe to experience tracker event: `"taskSuccess"` of `"edit-page/publish"` experience. For failed publish, you can subscribe to `"taskFail"` of the `"edit-page/publish"` experience. Please refer to Experience Tracker section for more details.
