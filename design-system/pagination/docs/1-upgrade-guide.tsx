import React from 'react';
import { code, md } from '@atlaskit/docs';
import DynamicTable from '@atlaskit/dynamic-table';

export default md`
## v8 to v9

### ⚡️ Highlights

- Ability to extend the pagination UI with custom components
- Control the maximum number of pages to be displayed
- Ability to customise the logic to collapse the pagination affordance
- Pass in extra styling to the pagination container component so you can omit the use of style wrappers

### 💻 Upgrading:

In v8 we used to create pagination components as follows:

${code`
<Pagination
  total={10}
  onChange={newSelectedPage => console.log('page changed', newSelectedPage)}
/>
`}

The above code could be written in v9 as:

${code`
<Pagination
  pages={[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]} // or [ ...Array(10) ].map((_, i) => i + 1)
  onChange={(event, newSelectedPage) => console.log('page changed', newSelectedPage)}
/>
`}

We have created a codemod which aims to reduce the amount of busy work to upgrade to this new API. Here is how to get up and running:

1. Clone the [Atlaskit Codemod repository](https://bitbucket.org/atlassian/atlaskit-codemods/src/master/).
2. Follow the setup instructions on the [README](https://bitbucket.org/atlassian/atlaskit-codemods/src/master/README.md).
3. The codemod created for this upgrade is the [pagination-8-to-9](https://bitbucket.org/atlassian/atlaskit-codemods/src/master/src/pagination-8-to-9/README.md) codemod. The README in that directory contains all the information about setting up and running the codemod.

### 🆕 Props added:

- **pages**: ( ***Required*** ) Array of pages to the rendered by the Pagination component
- **defaultSelectedIndex**: The index of the page to be selected by default
- **selectedIndex**: The index of the page to be selected.
- **collapseRange**: A function which should return an Array of react Nodes to be rendered by Pagination component
- **components**: You can replace the default page, previous and next component by passing in your custom components here.
- **renderEllipsis**: A function that returns a react node to be rendered instead of default ellipsis.
- **innerStyles**: A styles object that is spread on the styles on the div wrapping pagination. Ideal for adding margins as required by the ADG guideline.

### 🚨 Deprecated Props:

- **defaultValue**: Please use ***defaultSelectedIndex*** prop instead
- **total**: Please use ***pages*** prop and pass in array of pages instead
- **value**: Please use ***selectedIndex*** prop instead

### ⏫ Props updated:

- **onChange**: The function signature has been updated to \`( event: SyntheticEvent<>, newSelectedPageIndex: number, analyticsEvent: UIAnalyticsEvent ) => void\`

## v7 to v8

### 🎉 ADG styling

In v8 pagination styling has been updated.

### 🎉 No changes in the API

There are no changes in the Pagination API. 
Therefore, no code change will be required to consume this major version. 
However, you might need to update your styling.

### 🚨 Styles changes

There must be spacing a 24px ( \`3 * gridSize\` ) between pagination and anything above it.
Add this spacing to the element above the pagination component.

In v7 this spacing was not there either, but because in v8 the buttons have a dark background color the experience will appear broken if this spacing is not there.

Have your designers check that this change does not break the look within your app. Functionaly there no changes in the component.

Example:

${code`
import { gridSize } from '@atlaskit/theme';

<div>
    <div style={{marginBottom: (gridSize() * 3) + 'px'}}>
        <!-- Your awesome page -->
    </div>
    <Pagination
        defaultValue={5}
        total={10}
        onChange={e => console.log('page changed', e)}
    />
</div>
`}

## v3 to v4

In version 4 we have simplified the package to export a single component.
This section describes the changes and how to migrate to version 4.

### Removal of Stateless component

This export has been removed from the package. The value of the current page
value can be controlled by using the \`value\` prop from the default import.

Before version 4:

${code`
import React from 'react';
import { PaginationStateless } from '@atlaskit/pagination';

export default () => (
  <PaginationStateless
    current={4}
    total={10}
    onSetPage={page => console.log(page)}
  />
);
`}

In version 4:

${code`
import React from 'react';
import Pagination from '@atlaskit/pagination';

export default () => (
  <Pagination
    value={4}
    total={10}
    onChange={page => console.log(page)}
  />
);
`}

### Naming changes

Version 4 renames props to follow more standard React naming conventions.
Below is a table of the changes.

#### Prop name changes

${(
  <DynamicTable
    head={{
      cells: [
        {
          key: 'before',
          content: 'Before',
        },
        {
          key: 'v4',
          content: 'In version 4',
        },
      ],
    }}
    rows={[
      {
        cells: [
          {
            key: 'current',
            content: 'current',
          },
          {
            key: 'value',
            content: 'value',
          },
        ],
        key: 'value',
      },
      {
        cells: [
          {
            key: 'defaultCurrent',
            content: 'defaultCurrent',
          },
          {
            key: 'defaultValue',
            content: 'defaultValue',
          },
        ],
        key: 'defaultValue',
      },
      {
        cells: [
          {
            key: 'onSetPage',
            content: 'onSetPage',
          },
          {
            key: 'onChange',
            content: 'onChange',
          },
        ],
        key: 'onChange',
      },
    ]}
  />
)}
`;
