# @atlaskit/media-table

## 15.0.7

### Patch Changes

- [`b9355830504`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9355830504) - Opt out of peer dependency enforcement

## 15.0.6

### Patch Changes

- [`3fb20c4aeba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fb20c4aeba) - Add postinstall check to enforce internal peer dependencies

## 15.0.5

### Patch Changes

- [`48e4a655534`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48e4a655534) - Internal change to enforce token usage for spacing properties. There is no expected visual or behaviour change.

## 15.0.4

### Patch Changes

- Updated dependencies

## 15.0.3

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8
- Updated dependencies

## 15.0.2

### Patch Changes

- Updated dependencies

## 15.0.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`
- Updated dependencies

## 15.0.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 14.1.7

### Patch Changes

- Updated dependencies

## 14.1.6

### Patch Changes

- [`c3eba8c788d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3eba8c788d) - Updates Media Viewer input data object
- Updated dependencies

## 14.1.5

### Patch Changes

- Updated dependencies

## 14.1.4

### Patch Changes

- Updated dependencies

## 14.1.3

### Patch Changes

- Updated dependencies

## 14.1.2

### Patch Changes

- Updated dependencies

## 14.1.1

### Patch Changes

- Updated dependencies

## 14.1.0

### Minor Changes

- [`2c1a0c45a0b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c1a0c45a0b) - [ux] Instrumented `@atlaskit/media-table` with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).
  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- [`7fc3932cc78`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7fc3932cc78) - [ux] Removed hover and focus state styling as the base component applies those already.
- Updated dependencies

## 14.0.0

### Major Changes

- [`64a9be7d742`](https://bitbucket.org/atlassian/atlassian-frontend/commits/64a9be7d742) - [ux] Add a preconfiguration for columns with the key 'preview' to display a media preview button

### Minor Changes

- [`692477d9854`](https://bitbucket.org/atlassian/atlassian-frontend/commits/692477d9854) - [ux] Adds row selection & row highlighting to media table component

### Patch Changes

- [`153829bfcb3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/153829bfcb3) - Upgrade caching algorithm library lru-fast to lru_map.
- Updated dependencies

## 13.0.2

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`
- Updated dependencies

## 13.0.1

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.
- Updated dependencies

## 13.0.0

### Major Changes

- [`af775dcb785`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af775dcb785) - [MEX-1034] Migrated from styled-components library to @emotion/react in @atlaskit/media-table

### Patch Changes

- Updated dependencies

## 12.0.1

### Patch Changes

- Updated dependencies

## 12.0.0

### Patch Changes

- Updated dependencies

## 11.0.1

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4
- Updated dependencies

## 11.0.0

### Minor Changes

- [`f862d5ae7aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f862d5ae7aa) - remove RxJs peer dependency
- [`118f3af101f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/118f3af101f) - Media Client APIs has been updated to use MediaSubscribable which provides subscription functionality (similar to RxJs observables).
  It exposes subscribe method that is called with MediaObserver as an argument and returns MediaSubscription.
  MediaSubscription exposes unsubscribe method.

  getFileState:
  The returned type of this function has changed from RxJs ReplaySubject to MediaSubscribable.

  ```
  import { MediaClient, MediaObserver, MediaSubscribable, MediaSubscription } from '@atlaskit/media-client';

  const mediaClient = new MediaClient({ authProvider });

  const fileStateSubscribable: MediaSubscribable<FileState> = mediaClient.file.getFileState(id);

  const mediaObserver: MediaObserver<FileState> = {
    next: (fileState) => {
      nextCallback(fileState)
    },
    error: (error) => {
      errorCallback(error)
    },
  };

  const subscription: MediaSubscription = fileStateSubscribable.subscribe(mediaObserver);

  subscription.unsubscribe();
  ```

  upload:
  The returned type of this function has changed from RxJs ReplaySubject to MediaSubscribable.

  ```
  import { MediaClient, MediaObserver, MediaSubscribable, MediaSubscription } from '@atlaskit/media-client';

  const mediaClient = new MediaClient({ authProvider });

  const uploadFileSubscribable: MediaSubscribable<FileState> = mediaClient.file.upload(uploadableFile);

  const mediaObserver: MediaObserver<FileState> = {
    next: (fileState) => {
      nextCallback(fileState)
    },
    error: (error) => {
      errorCallback(error)
    },
  };

  const subscription: MediaSubscription = uploadFileSubscribable.subscribe(mediaObserver);

  subscription.unsubscribe();
  ```

  getItems:
  The returned type of this function has changed from RxJs ReplaySubject to MediaSubscribable.

  ```
  import { MediaClient, MediaObserver, MediaSubscribable, MediaSubscription } from '@atlaskit/media-client';

  const mediaClient = new MediaClient({ authProvider });

  const collectionItemsSubscribable: MediaSubscribable<MediaCollectionItem[]> = mediaClient.collection.getItems(collectionName);

  const mediaObserver: MediaObserver<MediaCollectionItem[]> = {
    next: (items) => {
      nextCallback(items)
    },
    error: (error) => {
      errorCallback(error)
    },
  };

  const subscription: MediaSubscription = collectionItemsSubscribable.subscribe(mediaObserver);

  subscription.unsubscribe();
  ```

### Patch Changes

- Updated dependencies

## 10.0.3

### Patch Changes

- Updated dependencies

## 10.0.2

### Patch Changes

- [`6a5dc78b511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a5dc78b511) - Remove dateformat from media packages

## 10.0.1

### Patch Changes

- Updated dependencies

## 10.0.0

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

## 9.0.3

### Patch Changes

- [`b85e7ce12cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b85e7ce12cd) - Internal upgrade of memoize-one to 6.0.0

## 9.0.2

### Patch Changes

- Updated dependencies

## 9.0.1

### Patch Changes

- [`b90c0237824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90c0237824) - Update package.jsons to remove unused dependencies.
- Updated dependencies

## 9.0.0

### Patch Changes

- Updated dependencies

## 8.0.7

### Patch Changes

- [`3cd9ee2d15b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cd9ee2d15b) - Added RxJS compatiblity notice in Media docs
- Updated dependencies

## 8.0.6

### Patch Changes

- [`153f5588cab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/153f5588cab) - VULN-328572 - Upgrade dateformat to address security vuln

## 8.0.5

### Patch Changes

- Updated dependencies

## 8.0.4

### Patch Changes

- Updated dependencies

## 8.0.3

### Patch Changes

- Updated dependencies

## 8.0.2

### Patch Changes

- [`6d0d354481`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d0d354481) - BENTO-7803 Prevent download button from opening the media preview
- Updated dependencies

## 8.0.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc
- Updated dependencies

## 8.0.0

### Patch Changes

- Updated dependencies

## 7.0.0

### Major Changes

- [`4fe0ee2c04`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4fe0ee2c04) - API change: Move rowProps prop to each individual row item to allow different props to be applied to each table row

### Patch Changes

- [`0135387fdd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0135387fdd) - BENTO-7391 Add eventType in media-table DownloadButton analytics call
- Updated dependencies

## 6.0.2

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.
- Updated dependencies

## 6.0.1

### Patch Changes

- Updated dependencies

## 6.0.0

### Minor Changes

- [`7d831363d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d831363d9) - Migrated to declarative entry points

### Patch Changes

- Updated dependencies

## 5.2.3

### Patch Changes

- Updated dependencies

## 5.2.2

### Patch Changes

- [`a7eb47bc69`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a7eb47bc69) - Add analytic channel to download button analyticsEvent
- [`92094dd855`](https://bitbucket.org/atlassian/atlassian-frontend/commits/92094dd855) - Remove faulty import in mediaTable
- [`9254b203f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9254b203f9) - Removing unused code to be published
- Updated dependencies

## 5.2.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 5.2.0

### Minor Changes

- [`c026e59e68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c026e59e68) - Move truncateText helper from media-card to media-ui and expose entry point. Export optional NameCell component from MediaTable.
- [`89a1c63251`](https://bitbucket.org/atlassian/atlassian-frontend/commits/89a1c63251) - Add the rowProps property, which enables consumers to apply properties to the underlying row component. Move truncateText helper from media-card to media-ui and expose entry point. Export optional NameCell component from MediaTable.
- [`6c3c26f10c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c3c26f10c) - Add fixed width to download button column in media-table

### Patch Changes

- [`fa6fb5dfbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa6fb5dfbb) - Removing unused code to be published
- [`dff687b37a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dff687b37a) - Expose onKeyPress prop for dynamic-table and use it to show mediaViewer
- Updated dependencies

## 5.1.1

### Patch Changes

- [`ff9c75810c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff9c75810c) - Remove faulty import in mediaTable

## 5.1.0

### Minor Changes

- [`0934ad8798`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0934ad8798) - Add onPreviewOpen and onPreviewClose props
- [`6cf40e50ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6cf40e50ea) - Add UI analyticsEvent to individual row download button and table row click
- [`6c554b874b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c554b874b) - Remove obsolete collectionName from RowData type. The collectionName should be included in the item identifier if it is required.

## 5.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 4.0.0

### Major Changes

- [`198b19dcc7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/198b19dcc7) - Refactor items to take a FileIdentifier instead of string id

### Minor Changes

- [`f4b74d89c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4b74d89c1) - Add i18n support to media-table
- [`e44e4959b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e44e4959b3) - Expose sortKey and sortOrder as props. Add props documentation

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- [`51aa5587ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/51aa5587ef) - bump media-client: Remove stack traces from media analytic events
- Updated dependencies

## 3.0.0

### Major Changes

- [`4af9cf854d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4af9cf854d) - Refactor items to take a FileIdentifier instead of string id
  Add i18n support to media-table
  Expose sortKey and sortOrder as props. Add props documentation
  Add isFixedSize to DynamicTableStateless prop
  Add temporary workaround for FileIdentifier type

## 2.0.0

### Major Changes

- [`07952b96f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07952b96f8) - - New implementation of MediaTable with upgraded API

  **New API Requirements**

  - `items`: The content of items we want to display on each row

  ```
      RowData {
          [key: string]: React.ReactNode | string;
          collectionName?: string;
      }

      MediaTableItem {
        id: string;
        data: RowData;
      }[]
  ```

  - `columns`: The columns that we want to display for the table. If download button is required, need to have the 'download' key defined in columns (MediaTable will override whats in content for download).

  ```
   HeadType = {
   	cells: [
   		{
   			key: string | 'download';
   			width?: number;
   			content: React.ReactNode | string;
   			isSortable: boolean;
   		}
   	]
   }
  ```

  NOTE: Objecty property key in RowData must match with the key in the columns for it to be displayed in the table.
  E.g. Below would only render `file` data in the table, as the columns do not have the `trial` key defined within the cells array.

  ```
      const items: MediaTableItem[] = [
           {
             data: {
               file: 'test1',
               trial: 'hi',
             },
             id: 'e558199f-f982-4d23-93eb-313be5998d1b',
           },
      ];

      const columns: HeadType = {
           cells: [
             {
               key: 'file',
               width: 50,
               content: 'File name',
               isSortable: true,
             },
           ],
      };
  ```

  **Example Usage**

  ```
     const items: MediaTableItem[] = [
       {
         data: {
           file: 'test1',
         },
         id: 'e558199f-f982-4d23-93eb-313be5998d1b',
       },
     ]

     const columns: HeadType = {
       cells: [
         {
           key: 'file',
           width: 50,
           content: 'File name',
           isSortable: true,
         },
       ],
     };

    <MediaTable
        items={items}
        mediaClientConfig={mediaClientConfig}
        columns={columns}
        itemsPerPage={6}
        totalItems={10}
        isLoading={false}
     />
  ```

### Minor Changes

- [`07952b96f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07952b96f8) - Add support for isLoading, pageNumber, onSetPage, and onSort props
- [`07952b96f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07952b96f8) - Add support for pageNumber, itemsPerPage and totalItems props

## 1.1.0

### Minor Changes

- [`2c36ac5f82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c36ac5f82) - NOISSUE Add es2019 module to media-table package.json

### Patch Changes

- [`98f462e2aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98f462e2aa) - Bumping use the latest version of @atlaskit/spinner
- Updated dependencies
