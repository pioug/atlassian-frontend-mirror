import React from 'react';

import { code, Example, md } from '@atlaskit/docs';

export default md`
## Upgrade from 4.x to 5.x

In the v5 release was added ability to control expansion state of the tree-table.

## Changes to the Props

## Row
- v5 - **isExpanded**: If set to true or false, turns component into stateless, that requires to control it's behavior with onExpand / onCollapse handlers.
- v5 - **isDefaultExpanded**: New property that allows to control default expansion state of the row.

## Upgrade from 1.x to 2.x

In the v2 release the table-tree component does not maintain state anymore. A helper class \`TableTreeDataHelper\`
is exported that can help you maintain cache of the object keys and update table tree items object efficiently.

---

## Changes to the Props

### TableTree (Default export)

- v2 - **items**: Array of data object to display in the Table Tree
- v1 - **items**: (***Deprecated***) Function that will be used to provide data for rows at a particular level in the hierarchy

### Rows:

- v2 - **items**: Array of data object to display in the Table Tree
- v1 - **items**: (***Deprecated***) Function that will be used to provide data for rows at a particular level in the hierarchy

### Row:

- [New Prop] **items** - Array of child objects for a particular parent


## Upgrade with static table data ( without async loading )

In v2 API of table tree, the \`items\` prop on default export of tableTree, accepts the array of data to be presented
in table tree. Moreover, the \`items\` prop is drilled down to Rows component ( exported from package ) , therefore, we
can pass the table tree here in case we follow render props pattern.

Additionally, a new prop \`items\` is added on Row component ( exported from package ), which accepts array of children object for particular
parent item. See the example below:

${(
  <Example
    packageName="@atlaskit/table-tree"
    Component={
      require('../examples/upgrade-guide-examples/static-data').default
    }
    source={require('!!raw-loader!../examples/upgrade-guide-examples/static-data')}
    title="With Static Data"
    language="jsx"
  />
)}

### Explanation:

We provide the table tree data in the \`items\` prop on the Rows component. When a row is expanded if will pass
the expanded object, parent item in this case. Thus, we get children of the expanded Row. Then we just pass in
the children in as \`items\` in Row component.

*As you may have guessed, property name children is used in example but we can name our property anything we want and
pass the same as \`items\` in Row*

## Upgrade with Async loading of table data

**Here we will discuss the helper class that we can use in case of Async data loading.**

### Problem

We can use the nested table data structure where each item has a children property referencing it's children object.
However, in case of async loading we will not have children items for a particular parent item. Therefore, once we load the
the children item we need to traverse the table tree object and update the children property in the particular parent item. As
the table tree data object grows we will hit performance bottle neck in traversing table tree object.

Example table data

${code`
[
  {
    // Item 1 data,
    children: [
      {
        // child 1.1 data,
        children: [
          {
            // child 1.1.1 data,
            // ... and so on
          }
        ]
      }
    ]
  }
]
`}

*To overcome this performance bottle neck we recommend creating a cache with unique identifier in the item and path to the item, so that
we can travel the item tree quickly to update, to do this we provide a helper class \`TableTreeDataHelper\`*

### Recommendation

\`TableTreeDataHelper\` is exported from table tree package, to use it we need to instantiate it with the unique identifier in the table tree
item objects.

${code`
const tableTreeDataHelper = new TableTreeDataHelper('keyId');
`}

Then to build cache and get items to be used in component just do:

${code`
tableTreeDataHelper.updateItems(<_items_to_add>, <_current_items_>, <_parent_item_for_item_to_be_added_>);
`}

*In case of root items ( 1st level object) only one parameter items is enough*

${(
  <Example
    packageName="@atlaskit/table-tree"
    Component={
      require('../examples/upgrade-guide-examples/async-data-loading').default
    }
    source={require('!!raw-loader!../examples/upgrade-guide-examples/async-data-loading')}
    title="Advance Usage: With Async loading"
    language="jsx"
  />
)}

The idea here is to get the path of parent item in the table tree object using cache, cache makes it really fast, and then
update parent update with children and return the new items with updated items.

${code`
itemsById: {
  'id1': {
    // item 1
    children: [
      // Children
    ]
  },
  'id2': {
    // item 2
    children: [
      // Children
    ]
  }
}
`}

**TableTreeDataHelper** creates the cache and updates the object for you, hence taking the worry away in case of async loading.

**Appending items in the table:** (**v4.1.0** or above required) 

In case the table rows are received in chunks we can use the *appendItems* method on TableTreeDataHelper class

Usage:

${code`
tableTreeDataHelper.appendItems(<_items_to_add>, <_current_items_>, <_parent_item_for_item_to_be_added_>);
`}
`;
