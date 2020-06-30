# @atlaskit/media-table

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
