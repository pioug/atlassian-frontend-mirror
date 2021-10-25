# @atlaskit/media-table

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
