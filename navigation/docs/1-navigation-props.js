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

  These are the props available to the main \`Navigation\` component export. They
  are used for both controlling the appearance of itself and other sub-components
  as well as fixing the layout of the navigation components by accepting many
  of them as props.

  ${(
    <Props
      shouldCollapseProps
      heading="Navigation Props"
      props={{
        kind: 'program',
        component: {
          kind: 'generic',
          value: {
            kind: 'object',
            members: [
              {
                kind: 'property',
                key: { kind: 'id', name: 'createAnalyticsEvent' },
                value: { kind: 'any' },
                optional: false,
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
                      'Elements to be displayed in the ContainerNavigationComponent',
                    raw:
                      '* Elements to be displayed in the ContainerNavigationComponent ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'containerTheme' },
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
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Theme object to be used to color the navigation container.',
                    raw:
                      '* Theme object to be used to color the navigation container. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'containerHeaderComponent' },
                value: {
                  parameters: [],
                  returnType: {
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
                            name: 'Node',
                            moduleSpecifier: 'react',
                            referenceIdName: 'Node',
                          },
                        },
                      ],
                    },
                  },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Component(s) to be rendered as the header of the container.',
                    raw:
                      '* Component(s) to be rendered as the header of the container.  ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'containerScrollRef' },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'generic',
                        value: {
                          kind: 'import',
                          importKind: 'type',
                          name: 'ElementRef',
                          moduleSpecifier: 'react',
                          referenceIdName: 'ElementRef',
                        },
                        typeParams: {
                          kind: 'typeParams',
                          params: [{ kind: 'exists' }],
                        },
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
                      'Standard React ref for the container navigation scrollable element.',
                    raw:
                      '* Standard React ref for the container navigation scrollable element. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'drawers' },
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
                      ' Location to pass in an array of drawers (AkCreateDrawer, AkSearchDrawer, AkCustomDrawer)\nto be rendered. There is no decoration done to the components passed in here.',
                    raw:
                      '* Location to pass in an array of drawers (AkCreateDrawer, AkSearchDrawer, AkCustomDrawer)\n   to be rendered. There is no decoration done to the components passed in here. ',
                  },
                ],
                default: { kind: 'array', elements: [] },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'globalTheme' },
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
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Theme object to be used to color the global container.',
                    raw:
                      '* Theme object to be used to color the global container. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'globalCreateIcon' },
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
                      " Icon to be used as the 'create' icon. onCreateDrawerOpen is called when it\nis clicked.",
                    raw:
                      "* Icon to be used as the 'create' icon. onCreateDrawerOpen is called when it\n   is clicked. ",
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'globalPrimaryIcon' },
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
                      ' Icon to be displayed at the top of the GlobalNavigation. This is wrapped in\nthe linkComponent.',
                    raw:
                      '* Icon to be displayed at the top of the GlobalNavigation. This is wrapped in\n   the linkComponent. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'globalPrimaryIconAppearance' },
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
                      'Appearance of globalPrimaryIcon for shape styling of drop shadows',
                    raw:
                      '* Appearance of globalPrimaryIcon for shape styling of drop shadows ',
                  },
                ],
                default: { kind: 'string', value: 'round' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'globalPrimaryItemHref' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Link to be passed to the linkComponent that wraps the globalCreateIcon.',
                    raw:
                      '* Link to be passed to the linkComponent that wraps the globalCreateIcon. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'globalSearchIcon' },
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
                      " Icon to be used as the 'create' icon. onSearchDrawerOpen is called when it\nis clicked.",
                    raw:
                      "* Icon to be used as the 'create' icon. onSearchDrawerOpen is called when it\n   is clicked. ",
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'globalPrimaryActions' },
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
                      ' A list of nodes to be rendered as the global primary actions. They appear\ndirectly underneath the global primary icon. This must not exceed three nodes',
                    raw:
                      '* A list of nodes to be rendered as the global primary actions. They appear\n   directly underneath the global primary icon. This must not exceed three nodes ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'globalSecondaryActions' },
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
                      'An array of elements to be displayed at the bottom of the global component.\nThese should be icons or other small elements. There must be no more than five.\nSecondary Actions will not be visible when nav is collapsed.',
                    raw:
                      '* An array of elements to be displayed at the bottom of the global component.\n  These should be icons or other small elements. There must be no more than five.\n  Secondary Actions will not be visible when nav is collapsed. ',
                  },
                ],
                default: { kind: 'array', elements: [] },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'hasScrollHintTop' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Whether to display a scroll hint shadow at the top of the ContainerNavigation\nwrapper.',
                    raw:
                      '* Whether to display a scroll hint shadow at the top of the ContainerNavigation\n   * wrapper. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isCollapsible' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Set whether collapse should be allowed. If false, the nav cannot be dragged\nto be smaller.',
                    raw:
                      '* Set whether collapse should be allowed. If false, the nav cannot be dragged\n   to be smaller. ',
                  },
                ],
                default: { kind: 'boolean', value: true },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isOpen' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Set whether the nav is collapsed or not. Note that this is never controlled\ninternally as state, so if it is collapsible, you need to manually listen to onResize\nto determine when to change this if you are letting users manually collapse the\nnav.',
                    raw:
                      '* Set whether the nav is collapsed or not. Note that this is never controlled\n  internally as state, so if it is collapsible, you need to manually listen to onResize\n  to determine when to change this if you are letting users manually collapse the\n  nav. ',
                  },
                ],
                default: { kind: 'boolean', value: true },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isResizeable' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Sets whether to disable all resize prompts.',
                    raw: '* Sets whether to disable all resize prompts. ',
                  },
                ],
                default: { kind: 'boolean', value: true },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isElectronMac' },
                value: { kind: 'boolean' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Causes leftmost navigation section to be slightly wider to accommodate macOS buttons.',
                    raw:
                      '* Causes leftmost navigation section to be slightly wider to accommodate macOS buttons. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
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
                      ' A component to be used as a link. By Default this is an anchor. when a href\nis passed to it, and otherwise is a button.',
                    raw:
                      '* A component to be used as a link. By Default this is an anchor. when a href\n   is passed to it, and otherwise is a button. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onResize' },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'generic',
                        value: {
                          kind: 'object',
                          members: [
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'width' },
                              value: { kind: 'number' },
                              optional: false,
                            },
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'isOpen' },
                              value: { kind: 'boolean' },
                              optional: false,
                            },
                          ],
                          referenceIdName: 'resizeObj',
                        },
                      },
                      type: null,
                    },
                  ],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Function called at the end of a resize event. It is called with an object\ncontaining a width and an isOpen. These can be used to update the props of Navigation.',
                    raw:
                      '* Function called at the end of a resize event. It is called with an object\n   containing a width and an isOpen. These can be used to update the props of Navigation. ',
                  },
                ],
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
                key: { kind: 'id', name: 'onResizeStart' },
                value: {
                  parameters: [],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Function to be called when a resize event starts.',
                    raw: '* Function to be called when a resize event starts. ',
                  },
                ],
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
                key: { kind: 'id', name: 'onCreateDrawerOpen' },
                value: {
                  parameters: [],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Function called when the globalCreateIcon is clicked.',
                    raw:
                      '* Function called when the globalCreateIcon is clicked. ',
                  },
                ],
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
                key: { kind: 'id', name: 'onSearchDrawerOpen' },
                value: {
                  parameters: [],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Function called when the globalSearchIcon is clicked.',
                    raw:
                      '* Function called when the globalSearchIcon is clicked. ',
                  },
                ],
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
                key: { kind: 'id', name: 'onToggleStart' },
                value: {
                  parameters: [],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Function called when a collapse/expand starts',
                    raw: '* Function called when a collapse/expand starts ',
                  },
                ],
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
                key: { kind: 'id', name: 'onToggleEnd' },
                value: {
                  parameters: [],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Function called when a collapse/expand finishes',
                    raw: '* Function called when a collapse/expand finishes ',
                  },
                ],
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
                key: { kind: 'id', name: 'resizerButtonLabel' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'aria-label for the resizer button to help screen readers (a11y)',
                    raw:
                      '* aria-label for the resizer button to help screen readers (a11y) ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'topOffset' },
                value: { kind: 'number' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'The offset at the top of the page before the navigation begins. This allows\nabsolute items such as a banner to be placed above nav, without lower nav items\nbeing pushed off the screen. **DO NOT** use this outside of this use-case. Changes\nare animated. The string is any valid css height value',
                    raw:
                      '* The offset at the top of the page before the navigation begins. This allows\n  absolute items such as a banner to be placed above nav, without lower nav items\n  being pushed off the screen. **DO NOT** use this outside of this use-case. Changes\n  are animated. The string is any valid css height value ',
                  },
                ],
                default: { kind: 'number', value: 0 },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'width' },
                value: { kind: 'number' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Width of the navigation. Width cannot be reduced below the minimum, and the\ncollapsed with will be respected above the provided width.',
                    raw:
                      '* Width of the navigation. Width cannot be reduced below the minimum, and the\n   collapsed with will be respected above the provided width. ',
                  },
                ],
                default: {
                  kind: 'binary',
                  operator: '+',
                  left: {
                    kind: 'call',
                    callee: {
                      kind: 'variable',
                      declarations: [
                        {
                          kind: 'initial',
                          id: {
                            kind: 'id',
                            name: 'globalOpenWidth',
                            type: null,
                          },
                          value: {
                            kind: 'function',
                            id: null,
                            async: false,
                            generator: false,
                            parameters: [
                              {
                                kind: 'param',
                                value: {
                                  kind: 'assignmentPattern',
                                  left: {
                                    kind: 'id',
                                    name: 'isElectron',
                                    type: { kind: 'boolean' },
                                  },
                                  right: { kind: 'boolean', value: false },
                                },
                                type: null,
                              },
                            ],
                            returnType: { kind: 'number' },
                          },
                        },
                      ],
                      referenceIdName: 'globalOpenWidth',
                    },
                    args: [],
                  },
                  right: {
                    kind: 'variable',
                    declarations: [
                      {
                        kind: 'initial',
                        id: {
                          kind: 'id',
                          name: 'containerOpenWidth',
                          type: null,
                        },
                        value: { kind: 'number', value: 240 },
                      },
                    ],
                    referenceIdName: 'containerOpenWidth',
                  },
                  referenceIdName: 'defaultWidth',
                },
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'Navigation', type: null },
        },
      }}
    />
  )}
`;
