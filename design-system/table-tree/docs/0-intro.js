import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
The component displays a table of expandable, nested rows that form a tree-like hierarchy.
Child rows can be loaded asynchronously, on expansion.

## Usage

${code`import TableTree from '@atlaskit/table-tree';`}

Import the default exported Component and provide the data in \`items\` prop.

${(
  <Example
    packageName="@atlaskit/table-tree"
    Component={require('../examples/single-component').default}
    source={require('!!raw-loader!../examples/single-component')}
    title="With Static Data"
    language="jsx"
  />
)}

### Expected data structure for \`items\` props

${code`
[
  {
    id: //Item 1 id,
    content: {

    },
    hasChildren:
    children: [
      // Item 1 children
      {
        // Child 1
      }
    ]
  },
  {
    // Item 2
  }
]
`}

  ## Usage

  ${code`import TableTree, {
  Headers,
  Header,
  Cell,
  Rows,
  Row,
  TableTreeDataHelper,
} from '@atlaskit/table-tree';`}

${(
  <Props
    heading="TableTree Props"
    props={{
      kind: 'program',
      component: {
        kind: 'generic',
        value: {
          kind: 'object',
          members: [
            {
              kind: 'property',
              key: { kind: 'id', name: 'columns' },
              value: {
                kind: 'generic',
                value: { kind: 'id', name: 'Array' },
                typeParams: {
                  kind: 'typeParams',
                  params: [
                    {
                      kind: 'generic',
                      value: {
                        kind: 'import',
                        importKind: 'type',
                        name: 'ElementType',
                        moduleSpecifier: 'react',
                        referenceIdName: 'ElementType',
                      },
                    },
                  ],
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'An array of React component constructors. Each component will be used to render a cell in a tree row.',
                  raw:
                    '* An array of React component constructors. Each component will be used to render a cell in a tree row.  ',
                },
              ],
            },
            {
              kind: 'property',
              key: { kind: 'id', name: 'columnWidths' },
              value: {
                kind: 'generic',
                value: { kind: 'id', name: 'Array' },
                typeParams: {
                  kind: 'typeParams',
                  params: [
                    {
                      kind: 'generic',
                      value: {
                        kind: 'union',
                        types: [{ kind: 'string' }, { kind: 'number' }],
                        referenceIdName: 'CSSWidth',
                      },
                    },
                  ],
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'The widths of the respective columns in the table.',
                  raw: '* The widths of the respective columns in the table. ',
                },
              ],
            },
            {
              kind: 'property',
              key: { kind: 'id', name: 'headers' },
              value: {
                kind: 'generic',
                value: { kind: 'id', name: 'Array' },
                typeParams: {
                  kind: 'typeParams',
                  params: [{ kind: 'string' }],
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'The headers of the respective columns of the table.',
                  raw: '* The headers of the respective columns of the table. ',
                },
              ],
            },
            {
              kind: 'property',
              key: { kind: 'id', name: 'children' },
              value: {
                kind: 'generic',
                value: {
                  kind: 'import',
                  importKind: 'type',
                  name: 'Node',
                  moduleSpecifier: 'react',
                  referenceIdName: 'Node',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'React node to rendered within table tree, most common use case is to pass the `Row` component exported from table-tree',
                  raw:
                    '* React node to rendered within table tree, most common use case is to pass the `Row` component exported from table-tree ',
                },
              ],
            },
            {
              kind: 'property',
              key: { kind: 'id', name: 'items' },
              value: {
                kind: 'generic',
                value: {
                  kind: 'union',
                  types: [
                    {
                      kind: 'nullable',
                      arguments: {
                        kind: 'generic',
                        value: { kind: 'id', name: 'Array' },
                        typeParams: {
                          kind: 'typeParams',
                          params: [
                            {
                              kind: 'generic',
                              value: {
                                kind: 'generic',
                                value: { kind: 'id', name: 'Object' },
                                referenceIdName: 'RowData',
                              },
                            },
                          ],
                        },
                      },
                    },
                    { kind: 'null' },
                  ],
                  referenceIdName: 'LoadableItems',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'An Array of table items',
                  raw: '* An Array of table items ',
                },
              ],
            },
          ],
          referenceIdName: 'Props',
        },
        name: { kind: 'id', name: 'TableTree', type: null },
      },
    }}
  />
)}
`;
