# API References

## navigationPolicy

### `navigationPolicy` description

Both `ViewPage` and `EditPage` components accept `navigationPolicy` prop. This is the prop 3rd parties can provide their implementation of handling a navigation request based on URL.

### `navigationPolicy` definition

The navigation policy includes an optional `shimUrl` and a `navigate` function.

```ts
{
  shimUrl?: string;
  navigate?: (url, modifiers, defaultNavigate) => void
}
```

- `navigate`: (Optional) Function that 3rd parties provides. This allow 3rd parties to customize the navigation for URL. Through the `navigate`, 3rd parties will have access to:

  - `url`: The URL that navigation is targeting on.
  - `modifiers`: An object contains modifiers that 3rd parties may be interested.

    - `target`: `'_self' | '_blank'` - specify if the navigation should stay within the same window: `_self`, or should open a new tab: `_blank`.
    - `contentId`: `string | undefined` - the id of content from Confluence perspective parsed from the `url`.
    - `spaceKey`: `string | undefined` - the key of space the content belongs to from Confluence perspective parsed from the `url`.
    - `routeName`: `string | undefined` - the Embedded Confluence route name derived from the `url`. Currently only the following routes are supported:

      | RouteName       | Description                                                                                                  |
      | --------------- | ------------------------------------------------------------------------------------------------------------ |
      | EDIT_PAGE_EMBED | This route name specifies that the URL is for Embedded Editor. This editor uses Native Collab Service (NCS). |
      | VIEW_PAGE       | This route name specifies that the URL is for the View Page.                                                 |

  - `defaultNavigate`: A function that 3rd parties can optionally choose to proceed with as default navigation behaviors. This gives 3rd parties an option to opt in to handle the navigation of `url`, or choose to opt out and fallback to default navigation behaviors.

- `shimUrl`: (Optional) If provided, any URL that navigates to Confluence app will be converted to the URL of the 3rd party. <br>

  - Example:
    If 3rd party tenant is `https://domain1.com/` and it is linked to Confluence Cloud, here is a table explains how this link `https://domain1.com/wiki/a/b/c` would be converted based on different `shimUrl` values:

    | Provided `shimUrl` by 3rd party | URL in Embedded Confluence                  |
    | ------------------------------- | ------------------------------------------- |
    | `""` or `undefined`             | `https://domain1.com/wiki/a/b/c`            |
    | `/xyz`                          | `https://domain1.com/xyz/a/b/c`             |
    | `xyz`                           | `https://domain1.com/xyz/a/b/c`             |
    | `https://domain1.com/xyz`       | `https://domain1.com/xyz/a/b/c`             |
    | `https://domain1.com`           | `https://domain1.com/a/b/c`                 |
    | `domain1.com/xyz`               | `https://domain1.com/domain1.com/xyz/a/b/c` |
    | `domain1.com`                   | `https://domain1.com/domain1.com/a/b/c`     |

### `navigationPolicy` examples

1. Parent product chooses not to proceed with the default navigation under some conditions.

```jsx
import { EditPage } from '@atlaskit/embedded-confluence';

const MyComponent = props => {
  const navigationPolicy = {
    navigate(url, modifiers, defaultNavigate) {
      if (/* some conditions*/) {
        // Do something without calling `defaultNavigate`
        return doSomethingElse(url, modifiers)
      }

      return defaultNavigate(url, modifiers);
    },
  };

  return (
    <EditPage
      navigationPolicy={navigationPolicy}
      {...otherProps}
    />
  );
};
```

2. Parent product chooses to proceed with default navigation after making customization to the inputs under some conditions.

```jsx
import { EditPage } from '@atlaskit/embedded-confluence';

const MyComponent = props => {
  const navigationPolicy = {
    navigate(url, modifiers, defaultNavigate) {
      let targetUrl = url;

      if (/*some conditions*/) {
        // Customize url and let this customized url be the input to default navigation implementation.
        targetUrl = 'something-else';
      }

      return defaultNavigate(targetUrl, modifiers);
    },
  };

  return (
    <EditPage
      navigationPolicy={navigationPolicy}
      {...otherProps}
    />
  );
};
```

3. Parent product handling navigation for different routeName example

```jsx
import { EditPage } from '@atlaskit/embedded-confluence';

const MyComponent = props => {
  const navigationPolicy = {
    navigate(url, modifiers, defaultNavigate) {
      if (modifiers.contentId === props.contentId) {
        switch (modifiers.routeName) {
          case EDIT_PAGE_EMBED:
            // Navigate to the "edit page" experience for contentId supported by embedded-confluence
            break;

          case VIEW_PAGE:
            // Navigate to the "view page" experience of contentId supported by embedded-confluence
            break;
        }
      }
      return defaultNavigate(url, modifiers);
    },
  };

  return <EditPage navigationPolicy={navigationPolicy} {...otherProps} />;
};
```

## allowedFeatures

### `allowedFeatures` description

There are two different types of `allowedFeatures` depending on the components.

### `allowedFeatures` for `View`/`Edit` page

`allowedFeatures` provides a list of names of all EP features for 3rd parties. If provided, only features included in the list will be enabled, features not in the list will be disabled. `[]` will disable all features. `'all'` will enable all features. If not provided, default features will be enabled.

#### A list of features for `ViewPage`:

| Name                | Description                                                                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| byline-contributors | **(ON BY DEFAULT)** To show/hide the contributors information, this includes contributor name and avatars.                                                                                       |
| byline-extensions   | **(ON BY DEFAULT)** To show/hide the byline extension.                                                                                                                                           |
| page-comments       | **(ON BY DEFAULT)** To show/hide the page comments block.                                                                                                                                        |
| page-reactions      | **(ON BY DEFAULT)** To show/hide the page emoji reactions.                                                                                                                                       |
| delete              | To show/hide the "Delete" menu item within the "Ellipsis" icon. If set to true, the "Delete" menu item will only show if user has delete permission.                                             |
| edit                | To show/hide the "Edit" pencil icon. If set to true, the edit icon will show if user has edit permission. To handle navigation when user clicks on the edit icon, please use `navigationPolicy`. |
| inline-comments     | To show/hide inline comments and highlight button to create inline comments and Jira issues.                                                                                                     |
| sticky-header       | To show/hide sticky header.                                                                                                                                                                      |

#### A list of features for `EditPage`:

| Name             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| delete-draft     | To show/hide the "Delete unpublished draft" or "Revert to last published version" menu item within the "Ellipsis" icon depending on if a document has already been published or not. To handle navigation after a user deletes/reverts a page, please listen for the experience tracker event: `"taskSuccess"`of `"edit-page/revert-draft"`. If no navigation is defined by 3rd party, by default no navigation will occur and will remain on the same page after a page has been deleted/reverted. Thus please make sure some navigation is defined. |
| template-browser | To show/hide template browser in the edit page. If included, an empty edit page will show a template browser sidebar, and the ellipsis menu will include a dropdown option "Templates" to toggle the sidebar. To hide the space selector while still showing the templates browser, pass an object with the format `{"template-browser": {"space-picker-disabled": true}}` instead.                                                                                                                                                                   |

### `allowedFeatures` example

This following example will provide all the features for the `ViewPage` component:

```jsx
import { ViewPage } from '@atlaskit/embedded-confluence';

const MyComponent = props => {
  return (
    <ArticleWrapper>
      <ViewPage
        contentId={props.contentId}
        parentProductContentContainerId={props.parentProductContentContainerId}
        parentProduct={props.parentProduct}
        spaceKey={props.spaceKey}
        allowedFeatures={'all'}
      />
    </ArticleWrapper>
  );
};
```

This following example will provide none of the features for the `ViewPage` component:

```jsx
import { ViewPage } from '@atlaskit/embedded-confluence';

const MyComponent = props => {
  return (
    <ArticleWrapper>
      <ViewPage
        contentId={props.contentId}
        parentProductContentContainerId={props.parentProductContentContainerId}
        parentProduct={props.parentProduct}
        spaceKey={props.spaceKey}
        allowedFeatures={[]}
      />
    </ArticleWrapper>
  );
};
```

This following example will provide the Edit and Delete Buttons for the `ViewPage` component. The other features: `'inline-comments'`,`'sticky-header'`, `'byline-contributors'`,`'byline-extensions'`,`'page-comments'`,`'page-reactions'` will be disabled.

```jsx
import { ViewPage } from '@atlaskit/embedded-confluence';

const MyComponent = props => {
  return (
    <ArticleWrapper>
      <ViewPage
        contentId={props.contentId}
        parentProductContentContainerId={props.parentProductContentContainerId}
        parentProduct={props.parentProduct}
        spaceKey={props.spaceKey}
        allowedFeatures={['edit', 'delete']}
      />
    </ArticleWrapper>
  );
};
```

## `locale`

`@atlaskit/embedded-confluence` package currently can accept `locale` from parent products in two options:

1. Pass `locale` using `<IntlProvider>` by [`react-intl`](https://www.npmjs.com/package/react-intl).

   Please make sure `<IntlProvider>` exists in the React DOM and wraps `@atlaskit/embedded-confluence` components.

   `@atlaskit/embedded-confluence` use `react-intl@5.21.2`.

```jsx
import { IntlProvider } from 'react-intl';

import { ViewPage } from '@atlaskit/embedded-confluence';

const App = props => {
  return (
    <IntlProvider locale="en-US">
      <ViewPage
        contentId={props.contentId}
        parentProductContentContainerId={props.parentProductContentContainerId}
        parentProduct={props.parentProduct}
        spaceKey={props.spaceKey}
      />
    </IntlProvider>
  );
};
```

2. Pass `locale` as React prop

```jsx
import { ViewPage } from '@atlaskit/embedded-confluence';

const App = props => {
  return (
    <ViewPage
      contentId={props.contentId}
      locale={'en-US'}
      parentProductContentContainerId={props.parentProductContentContainerId}
      parentProduct={props.parentProduct}
      spaceKey={props.spaceKey}
    />
  );
};
```

Here are the supported locales for `@atlaskit/embedded-confluence`

| Language                 | Code                                                      |
| ------------------------ | --------------------------------------------------------- |
| Chinese (Simplified)     | "zh" or "zh-CN"                                           |
| Chinese (Traditional)    | "zh-TW"                                                   |
| Czech                    | "cs" or "cs-CZ"                                           |
| Danish                   | "da" or "da-DK"                                           |
| Dutch                    | "nl" or "nl-NL"                                           |
| English (United Kingdom) | "en-GB"                                                   |
| English (US)             | "en" or "en-US"                                           |
| Finnish                  | "fi" or "fi-FI"                                           |
| French                   | "fr" or "fr-FR"                                           |
| German                   | "de" or "de-DE"                                           |
| Hungarian                | "hu" or "hu-HU"                                           |
| Italian                  | "it" or "it-IT"                                           |
| Japanese                 | "ja" or "ja-JP"                                           |
| Korean                   | "ko" or "ko-KR"                                           |
| Norwegian                | "no" or "no-NO" (Norwegian) or "nb-NO" (Norwegian Bokmål) |
| Polish                   | "pl" or "pl-PL"                                           |
| Portuguese (Brazilian)   | "pt-BR"                                                   |
| Russian                  | "ru" or "ru-RU"                                           |
| Spanish                  | "es" or "es-ES"                                           |
| Swedish                  | "sv" or "sv-SE"                                           |
| Turkish                  | "tr" or "tr-TR"                                           |
| Thai                     | "th" or "th-TH"                                           |
| Ukrainian                | "uk" or "uk-UA"                                           |
| Vietnamese               | "vi" or "vi-VN"                                           |
