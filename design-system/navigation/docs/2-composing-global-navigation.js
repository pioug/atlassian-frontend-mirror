import React from 'react';
import { md, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ${(
    <SectionMessage appearance="error">
      <p>
        <strong>Note: @atlaskit/navigation is now deprecated.</strong>
      </p>
      <p>We recommend upgrading to @atlaskit/navigation-next</p>
    </SectionMessage>
  )}

  There is a specific \`AkGlobalItem\` component that is designed to be used in the
  \`globalSecondaryActions\` prop for navigation. Wrapping an icon, possibly
  with a tooltip insie a \`AkGlobalItem\` component will ensure the correct
  styling behaviour for the item.

  ${(
    <Props
      shouldCollapseProps
      heading="Global Navigation Item Props"
      props={{
        kind: 'program',
        component: {
          kind: 'generic',
          value: {
            kind: 'object',
            members: [
              {
                kind: 'property',
                key: { kind: 'string', value: 'aria-haspopup' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Standard aria-haspopup prop',
                    raw: '* Standard aria-haspopup prop ',
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
                    type: 'commentLine',
                    value: 'eslint-disable-line react/no-unused-prop-types',
                    raw: ' eslint-disable-line react/no-unused-prop-types',
                  },
                  {
                    type: 'commentBlock',
                    value:
                      'Element to be rendered inside the item. Should be an atlaskit icon.',
                    raw:
                      '* Element to be rendered inside the item. Should be an atlaskit icon. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'href' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'href to pass to linkComponent.',
                    raw: '* href to pass to linkComponent.  ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'id' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'An id used for analytics to identify the item when it is clicked. If passed in, an event will be fired on the navigation channel.',
                    raw:
                      '* An id used for analytics to identify the item when it is clicked. If passed in, an event will be fired on the navigation channel. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isSelected' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Causes the item to appear with a persistent selected background state.',
                    raw:
                      '* Causes the item to appear with a persistent selected background state. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'linkComponent' },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'import',
                    importKind: 'type',
                    name: 'ComponentType',
                    moduleSpecifier: 'react',
                    referenceIdName: 'ComponentType',
                  },
                  typeParams: { kind: 'typeParams', params: [{ kind: 'any' }] },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Component to be used to create the link in the global item. A default\ncomponent is used if none is provided.',
                    raw:
                      '* Component to be used to create the link in the global item. A default\n   component is used if none is provided. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onClick' },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'union',
                        types: [
                          {
                            kind: 'generic',
                            value: { kind: 'id', name: 'SyntheticMouseEvent' },
                            typeParams: {
                              kind: 'typeParams',
                              params: [{ kind: 'exists' }],
                            },
                          },
                          {
                            kind: 'generic',
                            value: {
                              kind: 'id',
                              name: 'SyntheticKeyboardEvent',
                            },
                            typeParams: {
                              kind: 'typeParams',
                              params: [{ kind: 'exists' }],
                            },
                          },
                        ],
                      },
                      type: null,
                    },
                    {
                      kind: 'param',
                      value: { kind: 'object', members: [] },
                      type: null,
                    },
                  ],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Standard onClick event',
                    raw: '* Standard onClick event ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onMouseDown' },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'generic',
                        value: { kind: 'id', name: 'MouseEvent' },
                      },
                      type: null,
                    },
                  ],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: false,
                default: {
                  kind: 'function',
                  id: null,
                  async: false,
                  generator: false,
                  parameters: [],
                  returnType: null,
                },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'role' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'ARIA role to apply to the global item.',
                    raw: '* ARIA role to apply to the global item. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'size' },
                value: {
                  kind: 'union',
                  types: [
                    { kind: 'string', value: 'small' },
                    { kind: 'string', value: 'medium' },
                    { kind: 'string', value: 'large' },
                  ],
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: "Set the size of the item's content.",
                    raw: "* Set the size of the item's content.  ",
                  },
                ],
                default: { kind: 'string', value: 'small' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'appearance' },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'union',
                    types: [
                      { kind: 'string', value: 'square' },
                      { kind: 'string', value: 'round' },
                    ],
                    referenceIdName: 'IconAppearance',
                  },
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Appearance of item for custom styling (square or round)',
                    raw:
                      '* Appearance of item for custom styling (square or round) ',
                  },
                ],
                default: { kind: 'string', value: 'round' },
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'GlobalItem', type: null },
        },
      }}
    />
  )}

  If you want to render GlobalNavigation only, it is exported as \`AkGlobalNavigation\`.

  ${(
    <Props
      shouldCollapseProps
      heading="Global Navigation Props"
      props={{
        kind: 'program',
        component: {
          kind: 'generic',
          value: {
            kind: 'object',
            members: [
              {
                kind: 'property',
                key: { kind: 'id', name: 'createIcon' },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'import',
                    importKind: 'type',
                    name: 'Element',
                    moduleSpecifier: 'react',
                    referenceIdName: 'Element',
                  },
                  typeParams: { kind: 'typeParams', params: [{ kind: 'any' }] },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'The icon to be used for the create button',
                    raw: '* The icon to be used for the create button ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'linkComponent' },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'import',
                    importKind: 'type',
                    name: 'ComponentType',
                    moduleSpecifier: 'react',
                    referenceIdName: 'ComponentType',
                  },
                  typeParams: {
                    kind: 'typeParams',
                    params: [{ kind: 'exists' }],
                  },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' A component that will be used to render links. A default link component is\nused if none is provided.',
                    raw:
                      '* A component that will be used to render links. A default link component is\n   used if none is provided. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'primaryActions' },
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
                          name: 'Element',
                          moduleSpecifier: 'react',
                          referenceIdName: 'Element',
                        },
                        typeParams: {
                          kind: 'typeParams',
                          params: [{ kind: 'any' }],
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
                      ' A list of nodes to be rendered as the global primary actions.  They appear\ndirectly underneath the global primary icon. This must not exceed three nodes',
                    raw:
                      '* A list of nodes to be rendered as the global primary actions.  They appear\n   directly underneath the global primary icon. This must not exceed three nodes ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'primaryIcon' },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'import',
                    importKind: 'type',
                    name: 'Element',
                    moduleSpecifier: 'react',
                    referenceIdName: 'Element',
                  },
                  typeParams: { kind: 'typeParams', params: [{ kind: 'any' }] },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' The topmost icon to be placed in the global navigation - usually the product\nlogo, or the product home icon',
                    raw:
                      '* The topmost icon to be placed in the global navigation - usually the product\n   logo, or the product home icon ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'primaryIconAppearance' },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'union',
                    types: [
                      { kind: 'string', value: 'square' },
                      { kind: 'string', value: 'round' },
                    ],
                    referenceIdName: 'IconAppearance',
                  },
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'The appearance of the primary icon for custom styling purposes',
                    raw:
                      '* The appearance of the primary icon for custom styling purposes ',
                  },
                ],
                default: { kind: 'string', value: 'round' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'primaryItemHref' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'A link to place around the primary icon.',
                    raw: '* A link to place around the primary icon. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'secondaryActions' },
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
                          name: 'Element',
                          moduleSpecifier: 'react',
                          referenceIdName: 'Element',
                        },
                        typeParams: {
                          kind: 'typeParams',
                          params: [{ kind: 'any' }],
                        },
                      },
                    ],
                  },
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' A list of nodes to be placed in the secondary actions slot at the bottom of\nthe global sidebar. This must not exceed five nodes.',
                    raw:
                      '* A list of nodes to be placed in the secondary actions slot at the bottom of\n   the global sidebar. This must not exceed five nodes. ',
                  },
                ],
                default: { kind: 'array', elements: [] },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'searchIcon' },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'import',
                    importKind: 'type',
                    name: 'Element',
                    moduleSpecifier: 'react',
                    referenceIdName: 'Element',
                  },
                  typeParams: { kind: 'typeParams', params: [{ kind: 'any' }] },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'The icon to use in the global navigation for the global search button',
                    raw:
                      '* The icon to use in the global navigation for the global search button ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onSearchActivate' },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'union',
                        types: [
                          {
                            kind: 'generic',
                            value: { kind: 'id', name: 'SyntheticMouseEvent' },
                            typeParams: {
                              kind: 'typeParams',
                              params: [{ kind: 'exists' }],
                            },
                          },
                          {
                            kind: 'generic',
                            value: {
                              kind: 'id',
                              name: 'SyntheticKeyboardEvent',
                            },
                            typeParams: {
                              kind: 'typeParams',
                              params: [{ kind: 'exists' }],
                            },
                          },
                        ],
                      },
                      type: null,
                    },
                  ],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'A handler that is called when the search drawer is requesting to be opened',
                    raw:
                      '* A handler that is called when the search drawer is requesting to be opened ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onCreateActivate' },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'union',
                        types: [
                          {
                            kind: 'generic',
                            value: { kind: 'id', name: 'SyntheticMouseEvent' },
                            typeParams: {
                              kind: 'typeParams',
                              params: [{ kind: 'exists' }],
                            },
                          },
                          {
                            kind: 'generic',
                            value: {
                              kind: 'id',
                              name: 'SyntheticKeyboardEvent',
                            },
                            typeParams: {
                              kind: 'typeParams',
                              params: [{ kind: 'exists' }],
                            },
                          },
                        ],
                      },
                      type: null,
                    },
                  ],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'A handler that is called when the createIcon is clicked',
                    raw:
                      '* A handler that is called when the createIcon is clicked ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'theme' },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'object',
                    members: [
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'background' },
                        value: {
                          kind: 'object',
                          members: [
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'primary' },
                              value: {
                                kind: 'generic',
                                value: {
                                  kind: 'generic',
                                  value: {
                                    kind: 'union',
                                    types: [
                                      { kind: 'string' },
                                      {
                                        kind: 'generic',
                                        value: { kind: 'id', name: 'Function' },
                                      },
                                    ],
                                    referenceIdName: 'Color',
                                  },
                                  referenceIdName: 'Background',
                                },
                              },
                              optional: false,
                            },
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'secondary' },
                              value: {
                                kind: 'generic',
                                value: {
                                  kind: 'generic',
                                  value: {
                                    kind: 'union',
                                    types: [
                                      { kind: 'string' },
                                      {
                                        kind: 'generic',
                                        value: { kind: 'id', name: 'Function' },
                                      },
                                    ],
                                    referenceIdName: 'Color',
                                  },
                                  referenceIdName: 'Background',
                                },
                              },
                              optional: false,
                            },
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'tertiary' },
                              value: {
                                kind: 'generic',
                                value: {
                                  kind: 'generic',
                                  value: {
                                    kind: 'union',
                                    types: [
                                      { kind: 'string' },
                                      {
                                        kind: 'generic',
                                        value: { kind: 'id', name: 'Function' },
                                      },
                                    ],
                                    referenceIdName: 'Color',
                                  },
                                  referenceIdName: 'Background',
                                },
                              },
                              optional: false,
                              leadingComments: [
                                {
                                  type: 'commentLine',
                                  value: 'currently used for drawer',
                                  raw: ' currently used for drawer',
                                },
                              ],
                            },
                          ],
                        },
                        optional: false,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'text' },
                        value: {
                          kind: 'generic',
                          value: {
                            kind: 'generic',
                            value: {
                              kind: 'union',
                              types: [
                                { kind: 'string' },
                                {
                                  kind: 'generic',
                                  value: { kind: 'id', name: 'Function' },
                                },
                              ],
                              referenceIdName: 'Color',
                            },
                            referenceIdName: 'Text',
                          },
                        },
                        optional: false,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'subText' },
                        value: {
                          kind: 'generic',
                          value: {
                            kind: 'generic',
                            value: {
                              kind: 'union',
                              types: [
                                { kind: 'string' },
                                {
                                  kind: 'generic',
                                  value: { kind: 'id', name: 'Function' },
                                },
                              ],
                              referenceIdName: 'Color',
                            },
                            referenceIdName: 'Text',
                          },
                        },
                        optional: false,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'keyline' },
                        value: {
                          kind: 'generic',
                          value: {
                            kind: 'generic',
                            value: {
                              kind: 'union',
                              types: [
                                { kind: 'string' },
                                {
                                  kind: 'generic',
                                  value: { kind: 'id', name: 'Function' },
                                },
                              ],
                              referenceIdName: 'Color',
                            },
                            referenceIdName: 'Line',
                          },
                        },
                        optional: false,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'item' },
                        value: {
                          kind: 'generic',
                          value: {
                            kind: 'object',
                            members: [
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'default' },
                                value: {
                                  kind: 'object',
                                  members: [
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'background' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Background',
                                        },
                                      },
                                      optional: false,
                                    },
                                  ],
                                },
                                optional: false,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'hover' },
                                value: {
                                  kind: 'object',
                                  members: [
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'background' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Background',
                                        },
                                      },
                                      optional: false,
                                    },
                                  ],
                                },
                                optional: false,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'active' },
                                value: {
                                  kind: 'object',
                                  members: [
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'background' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Background',
                                        },
                                      },
                                      optional: false,
                                    },
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'text' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Text',
                                        },
                                      },
                                      optional: true,
                                    },
                                  ],
                                },
                                optional: false,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'focus' },
                                value: {
                                  kind: 'object',
                                  members: [
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'background' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Background',
                                        },
                                      },
                                      optional: true,
                                    },
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'outline' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'union',
                                          types: [
                                            { kind: 'string' },
                                            {
                                              kind: 'generic',
                                              value: {
                                                kind: 'id',
                                                name: 'Function',
                                              },
                                            },
                                          ],
                                          referenceIdName: 'Color',
                                        },
                                      },
                                      optional: true,
                                    },
                                  ],
                                },
                                optional: false,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'selected' },
                                value: {
                                  kind: 'object',
                                  members: [
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'background' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Background',
                                        },
                                      },
                                      optional: false,
                                    },
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'text' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Text',
                                        },
                                      },
                                      optional: true,
                                    },
                                  ],
                                },
                                optional: false,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'dragging' },
                                value: {
                                  kind: 'object',
                                  members: [
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'background' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Background',
                                        },
                                      },
                                      optional: false,
                                    },
                                  ],
                                },
                                optional: false,
                              },
                            ],
                            referenceIdName: 'ItemTheme',
                          },
                        },
                        optional: false,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'dropdown' },
                        value: {
                          kind: 'generic',
                          value: {
                            kind: 'object',
                            members: [
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'default' },
                                value: {
                                  kind: 'object',
                                  members: [
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'background' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Background',
                                        },
                                      },
                                      optional: false,
                                    },
                                  ],
                                },
                                optional: false,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'hover' },
                                value: {
                                  kind: 'object',
                                  members: [
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'background' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Background',
                                        },
                                      },
                                      optional: false,
                                    },
                                  ],
                                },
                                optional: false,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'active' },
                                value: {
                                  kind: 'object',
                                  members: [
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'background' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Background',
                                        },
                                      },
                                      optional: false,
                                    },
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'text' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Text',
                                        },
                                      },
                                      optional: true,
                                    },
                                  ],
                                },
                                optional: false,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'focus' },
                                value: {
                                  kind: 'object',
                                  members: [
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'background' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Background',
                                        },
                                      },
                                      optional: true,
                                    },
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'outline' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'union',
                                          types: [
                                            { kind: 'string' },
                                            {
                                              kind: 'generic',
                                              value: {
                                                kind: 'id',
                                                name: 'Function',
                                              },
                                            },
                                          ],
                                          referenceIdName: 'Color',
                                        },
                                      },
                                      optional: true,
                                    },
                                  ],
                                },
                                optional: false,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'selected' },
                                value: {
                                  kind: 'object',
                                  members: [
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'background' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Background',
                                        },
                                      },
                                      optional: false,
                                    },
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'text' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Text',
                                        },
                                      },
                                      optional: true,
                                    },
                                  ],
                                },
                                optional: false,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'dragging' },
                                value: {
                                  kind: 'object',
                                  members: [
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'background' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Background',
                                        },
                                      },
                                      optional: false,
                                    },
                                  ],
                                },
                                optional: false,
                              },
                            ],
                            referenceIdName: 'ItemTheme',
                          },
                        },
                        optional: false,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'hasDarkmode' },
                        value: { kind: 'boolean' },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'scrollBar' },
                        value: {
                          kind: 'generic',
                          value: {
                            kind: 'object',
                            members: [
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'default' },
                                value: {
                                  kind: 'object',
                                  members: [
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'background' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Background',
                                        },
                                      },
                                      optional: false,
                                    },
                                  ],
                                },
                                optional: false,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'hover' },
                                value: {
                                  kind: 'object',
                                  members: [
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'background' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Background',
                                        },
                                      },
                                      optional: false,
                                    },
                                  ],
                                },
                                optional: false,
                              },
                            ],
                            referenceIdName: 'ScrollBarTheme',
                          },
                        },
                        optional: false,
                      },
                    ],
                    referenceIdName: 'Provided',
                  },
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'The theme of the global navigation. Presets are available via the\npresetThemes named export, or you can generate your own using the the\ncreateGlobalTheme named export function.',
                    raw:
                      '* The theme of the global navigation. Presets are available via the\n  presetThemes named export, or you can generate your own using the the\n  createGlobalTheme named export function. ',
                  },
                ],
                default: {
                  kind: 'variable',
                  declarations: [
                    {
                      kind: 'initial',
                      id: {
                        kind: 'id',
                        name: 'global',
                        type: {
                          kind: 'generic',
                          value: {
                            kind: 'object',
                            members: [
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'background' },
                                value: {
                                  kind: 'object',
                                  members: [
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'primary' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Background',
                                        },
                                      },
                                      optional: false,
                                    },
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'secondary' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Background',
                                        },
                                      },
                                      optional: false,
                                    },
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'tertiary' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'union',
                                            types: [
                                              { kind: 'string' },
                                              {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'id',
                                                  name: 'Function',
                                                },
                                              },
                                            ],
                                            referenceIdName: 'Color',
                                          },
                                          referenceIdName: 'Background',
                                        },
                                      },
                                      optional: false,
                                      leadingComments: [
                                        {
                                          type: 'commentLine',
                                          value: 'currently used for drawer',
                                          raw: ' currently used for drawer',
                                        },
                                      ],
                                    },
                                  ],
                                },
                                optional: false,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'text' },
                                value: {
                                  kind: 'generic',
                                  value: {
                                    kind: 'generic',
                                    value: {
                                      kind: 'union',
                                      types: [
                                        { kind: 'string' },
                                        {
                                          kind: 'generic',
                                          value: {
                                            kind: 'id',
                                            name: 'Function',
                                          },
                                        },
                                      ],
                                      referenceIdName: 'Color',
                                    },
                                    referenceIdName: 'Text',
                                  },
                                },
                                optional: false,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'subText' },
                                value: {
                                  kind: 'generic',
                                  value: {
                                    kind: 'generic',
                                    value: {
                                      kind: 'union',
                                      types: [
                                        { kind: 'string' },
                                        {
                                          kind: 'generic',
                                          value: {
                                            kind: 'id',
                                            name: 'Function',
                                          },
                                        },
                                      ],
                                      referenceIdName: 'Color',
                                    },
                                    referenceIdName: 'Text',
                                  },
                                },
                                optional: false,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'keyline' },
                                value: {
                                  kind: 'generic',
                                  value: {
                                    kind: 'generic',
                                    value: {
                                      kind: 'union',
                                      types: [
                                        { kind: 'string' },
                                        {
                                          kind: 'generic',
                                          value: {
                                            kind: 'id',
                                            name: 'Function',
                                          },
                                        },
                                      ],
                                      referenceIdName: 'Color',
                                    },
                                    referenceIdName: 'Line',
                                  },
                                },
                                optional: false,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'item' },
                                value: {
                                  kind: 'generic',
                                  value: {
                                    kind: 'object',
                                    members: [
                                      {
                                        kind: 'property',
                                        key: { kind: 'id', name: 'default' },
                                        value: {
                                          kind: 'object',
                                          members: [
                                            {
                                              kind: 'property',
                                              key: {
                                                kind: 'id',
                                                name: 'background',
                                              },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Background',
                                                },
                                              },
                                              optional: false,
                                            },
                                          ],
                                        },
                                        optional: false,
                                      },
                                      {
                                        kind: 'property',
                                        key: { kind: 'id', name: 'hover' },
                                        value: {
                                          kind: 'object',
                                          members: [
                                            {
                                              kind: 'property',
                                              key: {
                                                kind: 'id',
                                                name: 'background',
                                              },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Background',
                                                },
                                              },
                                              optional: false,
                                            },
                                          ],
                                        },
                                        optional: false,
                                      },
                                      {
                                        kind: 'property',
                                        key: { kind: 'id', name: 'active' },
                                        value: {
                                          kind: 'object',
                                          members: [
                                            {
                                              kind: 'property',
                                              key: {
                                                kind: 'id',
                                                name: 'background',
                                              },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Background',
                                                },
                                              },
                                              optional: false,
                                            },
                                            {
                                              kind: 'property',
                                              key: { kind: 'id', name: 'text' },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Text',
                                                },
                                              },
                                              optional: true,
                                            },
                                          ],
                                        },
                                        optional: false,
                                      },
                                      {
                                        kind: 'property',
                                        key: { kind: 'id', name: 'focus' },
                                        value: {
                                          kind: 'object',
                                          members: [
                                            {
                                              kind: 'property',
                                              key: {
                                                kind: 'id',
                                                name: 'background',
                                              },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Background',
                                                },
                                              },
                                              optional: true,
                                            },
                                            {
                                              kind: 'property',
                                              key: {
                                                kind: 'id',
                                                name: 'outline',
                                              },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'union',
                                                  types: [
                                                    { kind: 'string' },
                                                    {
                                                      kind: 'generic',
                                                      value: {
                                                        kind: 'id',
                                                        name: 'Function',
                                                      },
                                                    },
                                                  ],
                                                  referenceIdName: 'Color',
                                                },
                                              },
                                              optional: true,
                                            },
                                          ],
                                        },
                                        optional: false,
                                      },
                                      {
                                        kind: 'property',
                                        key: { kind: 'id', name: 'selected' },
                                        value: {
                                          kind: 'object',
                                          members: [
                                            {
                                              kind: 'property',
                                              key: {
                                                kind: 'id',
                                                name: 'background',
                                              },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Background',
                                                },
                                              },
                                              optional: false,
                                            },
                                            {
                                              kind: 'property',
                                              key: { kind: 'id', name: 'text' },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Text',
                                                },
                                              },
                                              optional: true,
                                            },
                                          ],
                                        },
                                        optional: false,
                                      },
                                      {
                                        kind: 'property',
                                        key: { kind: 'id', name: 'dragging' },
                                        value: {
                                          kind: 'object',
                                          members: [
                                            {
                                              kind: 'property',
                                              key: {
                                                kind: 'id',
                                                name: 'background',
                                              },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Background',
                                                },
                                              },
                                              optional: false,
                                            },
                                          ],
                                        },
                                        optional: false,
                                      },
                                    ],
                                    referenceIdName: 'ItemTheme',
                                  },
                                },
                                optional: false,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'dropdown' },
                                value: {
                                  kind: 'generic',
                                  value: {
                                    kind: 'object',
                                    members: [
                                      {
                                        kind: 'property',
                                        key: { kind: 'id', name: 'default' },
                                        value: {
                                          kind: 'object',
                                          members: [
                                            {
                                              kind: 'property',
                                              key: {
                                                kind: 'id',
                                                name: 'background',
                                              },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Background',
                                                },
                                              },
                                              optional: false,
                                            },
                                          ],
                                        },
                                        optional: false,
                                      },
                                      {
                                        kind: 'property',
                                        key: { kind: 'id', name: 'hover' },
                                        value: {
                                          kind: 'object',
                                          members: [
                                            {
                                              kind: 'property',
                                              key: {
                                                kind: 'id',
                                                name: 'background',
                                              },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Background',
                                                },
                                              },
                                              optional: false,
                                            },
                                          ],
                                        },
                                        optional: false,
                                      },
                                      {
                                        kind: 'property',
                                        key: { kind: 'id', name: 'active' },
                                        value: {
                                          kind: 'object',
                                          members: [
                                            {
                                              kind: 'property',
                                              key: {
                                                kind: 'id',
                                                name: 'background',
                                              },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Background',
                                                },
                                              },
                                              optional: false,
                                            },
                                            {
                                              kind: 'property',
                                              key: { kind: 'id', name: 'text' },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Text',
                                                },
                                              },
                                              optional: true,
                                            },
                                          ],
                                        },
                                        optional: false,
                                      },
                                      {
                                        kind: 'property',
                                        key: { kind: 'id', name: 'focus' },
                                        value: {
                                          kind: 'object',
                                          members: [
                                            {
                                              kind: 'property',
                                              key: {
                                                kind: 'id',
                                                name: 'background',
                                              },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Background',
                                                },
                                              },
                                              optional: true,
                                            },
                                            {
                                              kind: 'property',
                                              key: {
                                                kind: 'id',
                                                name: 'outline',
                                              },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'union',
                                                  types: [
                                                    { kind: 'string' },
                                                    {
                                                      kind: 'generic',
                                                      value: {
                                                        kind: 'id',
                                                        name: 'Function',
                                                      },
                                                    },
                                                  ],
                                                  referenceIdName: 'Color',
                                                },
                                              },
                                              optional: true,
                                            },
                                          ],
                                        },
                                        optional: false,
                                      },
                                      {
                                        kind: 'property',
                                        key: { kind: 'id', name: 'selected' },
                                        value: {
                                          kind: 'object',
                                          members: [
                                            {
                                              kind: 'property',
                                              key: {
                                                kind: 'id',
                                                name: 'background',
                                              },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Background',
                                                },
                                              },
                                              optional: false,
                                            },
                                            {
                                              kind: 'property',
                                              key: { kind: 'id', name: 'text' },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Text',
                                                },
                                              },
                                              optional: true,
                                            },
                                          ],
                                        },
                                        optional: false,
                                      },
                                      {
                                        kind: 'property',
                                        key: { kind: 'id', name: 'dragging' },
                                        value: {
                                          kind: 'object',
                                          members: [
                                            {
                                              kind: 'property',
                                              key: {
                                                kind: 'id',
                                                name: 'background',
                                              },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Background',
                                                },
                                              },
                                              optional: false,
                                            },
                                          ],
                                        },
                                        optional: false,
                                      },
                                    ],
                                    referenceIdName: 'ItemTheme',
                                  },
                                },
                                optional: false,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'hasDarkmode' },
                                value: { kind: 'boolean' },
                                optional: true,
                              },
                              {
                                kind: 'property',
                                key: { kind: 'id', name: 'scrollBar' },
                                value: {
                                  kind: 'generic',
                                  value: {
                                    kind: 'object',
                                    members: [
                                      {
                                        kind: 'property',
                                        key: { kind: 'id', name: 'default' },
                                        value: {
                                          kind: 'object',
                                          members: [
                                            {
                                              kind: 'property',
                                              key: {
                                                kind: 'id',
                                                name: 'background',
                                              },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Background',
                                                },
                                              },
                                              optional: false,
                                            },
                                          ],
                                        },
                                        optional: false,
                                      },
                                      {
                                        kind: 'property',
                                        key: { kind: 'id', name: 'hover' },
                                        value: {
                                          kind: 'object',
                                          members: [
                                            {
                                              kind: 'property',
                                              key: {
                                                kind: 'id',
                                                name: 'background',
                                              },
                                              value: {
                                                kind: 'generic',
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'union',
                                                    types: [
                                                      { kind: 'string' },
                                                      {
                                                        kind: 'generic',
                                                        value: {
                                                          kind: 'id',
                                                          name: 'Function',
                                                        },
                                                      },
                                                    ],
                                                    referenceIdName: 'Color',
                                                  },
                                                  referenceIdName: 'Background',
                                                },
                                              },
                                              optional: false,
                                            },
                                          ],
                                        },
                                        optional: false,
                                      },
                                    ],
                                    referenceIdName: 'ScrollBarTheme',
                                  },
                                },
                                optional: false,
                              },
                            ],
                            referenceIdName: 'Provided',
                          },
                        },
                      },
                      value: {
                        kind: 'call',
                        callee: {
                          kind: 'function',
                          id: null,
                          async: false,
                          generator: false,
                          parameters: [],
                          returnType: {
                            kind: 'generic',
                            value: {
                              kind: 'object',
                              members: [
                                {
                                  kind: 'property',
                                  key: {
                                    kind: 'id',
                                    name: 'background',
                                    type: null,
                                  },
                                  value: {
                                    kind: 'object',
                                    members: [
                                      {
                                        kind: 'property',
                                        key: {
                                          kind: 'id',
                                          name: 'primary',
                                          type: null,
                                        },
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'id',
                                            name: 'Background',
                                            type: null,
                                            referenceIdName: 'Background',
                                          },
                                        },
                                        optional: false,
                                      },
                                      {
                                        kind: 'property',
                                        key: {
                                          kind: 'id',
                                          name: 'secondary',
                                          type: null,
                                        },
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'id',
                                            name: 'Background',
                                            type: null,
                                            referenceIdName: 'Background',
                                          },
                                        },
                                        optional: false,
                                      },
                                      {
                                        kind: 'property',
                                        key: {
                                          kind: 'id',
                                          name: 'tertiary',
                                          type: null,
                                        },
                                        value: {
                                          kind: 'generic',
                                          value: {
                                            kind: 'id',
                                            name: 'Background',
                                            type: null,
                                            referenceIdName: 'Background',
                                          },
                                        },
                                        optional: false,
                                        leadingComments: [
                                          {
                                            type: 'commentLine',
                                            value: 'currently used for drawer',
                                            raw: ' currently used for drawer',
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                  optional: false,
                                },
                                {
                                  kind: 'property',
                                  key: { kind: 'id', name: 'text', type: null },
                                  value: {
                                    kind: 'generic',
                                    value: {
                                      kind: 'id',
                                      name: 'Text',
                                      type: null,
                                      referenceIdName: 'Text',
                                    },
                                  },
                                  optional: false,
                                },
                                {
                                  kind: 'property',
                                  key: {
                                    kind: 'id',
                                    name: 'subText',
                                    type: null,
                                  },
                                  value: {
                                    kind: 'generic',
                                    value: {
                                      kind: 'id',
                                      name: 'Text',
                                      type: null,
                                      referenceIdName: 'Text',
                                    },
                                  },
                                  optional: false,
                                },
                                {
                                  kind: 'property',
                                  key: {
                                    kind: 'id',
                                    name: 'keyline',
                                    type: null,
                                  },
                                  value: {
                                    kind: 'generic',
                                    value: {
                                      kind: 'id',
                                      name: 'Line',
                                      type: null,
                                      referenceIdName: 'Line',
                                    },
                                  },
                                  optional: false,
                                },
                                {
                                  kind: 'property',
                                  key: { kind: 'id', name: 'item', type: null },
                                  value: {
                                    kind: 'generic',
                                    value: {
                                      kind: 'id',
                                      name: 'ItemTheme',
                                      type: null,
                                      referenceIdName: 'ItemTheme',
                                    },
                                  },
                                  optional: false,
                                },
                                {
                                  kind: 'property',
                                  key: {
                                    kind: 'id',
                                    name: 'dropdown',
                                    type: null,
                                  },
                                  value: {
                                    kind: 'generic',
                                    value: {
                                      kind: 'id',
                                      name: 'ItemTheme',
                                      type: null,
                                      referenceIdName: 'ItemTheme',
                                    },
                                  },
                                  optional: false,
                                },
                                {
                                  kind: 'property',
                                  key: {
                                    kind: 'id',
                                    name: 'hasDarkmode',
                                    type: null,
                                  },
                                  value: { kind: 'boolean' },
                                  optional: true,
                                },
                                {
                                  kind: 'property',
                                  key: {
                                    kind: 'id',
                                    name: 'scrollBar',
                                    type: null,
                                  },
                                  value: {
                                    kind: 'generic',
                                    value: {
                                      kind: 'id',
                                      name: 'ScrollBarTheme',
                                      type: null,
                                      referenceIdName: 'ScrollBarTheme',
                                    },
                                  },
                                  optional: false,
                                },
                              ],
                              referenceIdName: 'Provided',
                            },
                          },
                        },
                        args: [],
                      },
                    },
                  ],
                  referenceIdName: 'global',
                },
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'GlobalNavigation', type: null },
        },
      }}
    />
  )}


`;
