import React from 'react';
import { code, md, Props } from '@atlaskit/docs';

import { Hr, IframeExample } from './shared';

export default md`This component is a wrapper around the \`GlobalNav\` primitive component from \`navigation-next\`. It provides a lot of features, configuration, and state management out of the box while exposing a more opinionated API. If you are building an Atlassian product you should use this component to ensure that our users get a consistent experience across our products. It will also make it easier for platform to ship updates to the experience without you needing to do any work!

If you are building an application that isn't an Atlassian product and you want to configure the global navigation area in a unique way, use [the component exported by \`navigation-next\`](/packages/design-system/navigation-next/docs/ui-components#globalnav).

${(<Hr />)}

## Usage

${code`import GlobalNavigation from '@atlaskit/global-navigation';`}

${(
  <IframeExample
    source={require('!!raw-loader!../examples/00-basic-global-navigation')}
    title="The GlobalNavigation component"
    url="/examples.html?groupId=core&packageId=global-navigation&exampleId=basic-global-navigation"
  />
)}

${(
  <Props
    heading="GlobalNavigation props"
    props={{
      kind: 'program',
      component: {
        kind: 'generic',
        value: {
          kind: 'object',
          members: [
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'productIcon',
              },
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
                  params: [
                    {
                      kind: 'object',
                      members: [],
                    },
                  ],
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The product logo. Expected to be an Atlaskit Logo component.',
                  raw:
                    '* The product logo. Expected to be an Atlaskit Logo component. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onProductClick',
              },
              value: {
                parameters: [],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A callback function which will be called when the product logo item is\nclicked. If this is passed, the drawer does not show up.',
                  raw:
                    '* A callback function which will be called when the product logo item is\n   * clicked. If this is passed, the drawer does not show up. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'productLabel',
              },
              value: {
                kind: 'string',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display as the label for the product logo item.',
                  raw:
                    '* The text to display as the label for the product logo item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'productTooltip',
              },
              value: {
                kind: 'union',
                types: [
                  {
                    kind: 'string',
                  },
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
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display in the tooltip for the product logo item.',
                  raw:
                    '* The text to display in the tooltip for the product logo item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'productHref',
              },
              value: {
                kind: 'string',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'An href attribute for the product logo item.',
                  raw: '* An href attribute for the product logo item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'getProductRef',
              },
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
                            key: {
                              kind: 'id',
                              name: 'current',
                            },
                            value: {
                              kind: 'union',
                              types: [
                                {
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
                                    params: [
                                      {
                                        kind: 'generic',
                                        value: {
                                          kind: 'typeParamsDeclaration',
                                          params: [
                                            {
                                              kind: 'typeParam',
                                              name: 'T',
                                            },
                                          ],
                                          referenceIdName: 'T',
                                        },
                                      },
                                    ],
                                  },
                                },
                                {
                                  kind: 'null',
                                },
                              ],
                            },
                            optional: false,
                          },
                        ],
                        referenceIdName: 'NonStringRef',
                      },
                      typeParams: {
                        kind: 'typeParams',
                        params: [
                          {
                            kind: 'string',
                            value: 'div',
                          },
                        ],
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'A function to get ref of the product icon',
                  raw: '* A function to get ref of the product icon ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onRecentClick',
              },
              value: {
                kind: 'nullable',
                arguments: {
                  parameters: [],
                  returnType: {
                    kind: 'void',
                  },
                  kind: 'function',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A callback function which will be called when the recent item is clicked.',
                  raw:
                    '* A callback function which will be called when the recent item is clicked.\n   * ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'recentLabel',
              },
              value: {
                kind: 'string',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display as the label for the recent drawer item.',
                  raw:
                    '* The text to display as the label for the recent drawer item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'recentTooltip',
              },
              value: {
                kind: 'union',
                types: [
                  {
                    kind: 'string',
                  },
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
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display in the tooltip for the recent drawer item.',
                  raw:
                    '* The text to display in the tooltip for the recent drawer item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'getRecentRef',
              },
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
                            key: {
                              kind: 'id',
                              name: 'current',
                            },
                            value: {
                              kind: 'union',
                              types: [
                                {
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
                                    params: [
                                      {
                                        kind: 'generic',
                                        value: {
                                          kind: 'typeParamsDeclaration',
                                          params: [
                                            {
                                              kind: 'typeParam',
                                              name: 'T',
                                            },
                                          ],
                                          referenceIdName: 'T',
                                        },
                                      },
                                    ],
                                  },
                                },
                                {
                                  kind: 'null',
                                },
                              ],
                            },
                            optional: false,
                          },
                        ],
                        referenceIdName: 'NonStringRef',
                      },
                      typeParams: {
                        kind: 'typeParams',
                        params: [
                          {
                            kind: 'string',
                            value: 'div',
                          },
                        ],
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'A function to get ref of the recent icon',
                  raw: '* A function to get ref of the recent icon ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onInviteClick',
              },
              value: {
                kind: 'nullable',
                arguments: {
                  parameters: [],
                  returnType: {
                    kind: 'void',
                  },
                  kind: 'function',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A callback function which will be called when the global invite item is clicked.',
                  raw:
                    '* A callback function which will be called when the global invite item is clicked.\n   * ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'inviteLabel',
              },
              value: {
                kind: 'string',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display as the label for the global invite drawer item.',
                  raw:
                    '* The text to display as the label for the global invite drawer item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'inviteTooltip',
              },
              value: {
                kind: 'union',
                types: [
                  {
                    kind: 'string',
                  },
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
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display in the tooltip for the global invite drawer item.',
                  raw:
                    '* The text to display in the tooltip for the global invite drawer item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'getInviteRef',
              },
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
                            key: {
                              kind: 'id',
                              name: 'current',
                            },
                            value: {
                              kind: 'union',
                              types: [
                                {
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
                                    params: [
                                      {
                                        kind: 'generic',
                                        value: {
                                          kind: 'typeParamsDeclaration',
                                          params: [
                                            {
                                              kind: 'typeParam',
                                              name: 'T',
                                            },
                                          ],
                                          referenceIdName: 'T',
                                        },
                                      },
                                    ],
                                  },
                                },
                                {
                                  kind: 'null',
                                },
                              ],
                            },
                            optional: false,
                          },
                        ],
                        referenceIdName: 'NonStringRef',
                      },
                      typeParams: {
                        kind: 'typeParams',
                        params: [
                          {
                            kind: 'string',
                            value: 'div',
                          },
                        ],
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'A function to get ref of the global invite icon',
                  raw: '* A function to get ref of the global invite icon ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onCreateClick',
              },
              value: {
                kind: 'nullable',
                arguments: {
                  parameters: [],
                  returnType: {
                    kind: 'void',
                  },
                  kind: 'function',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A callback function which will be called when the product logo item is\nclicked. If this is passed, the drawer does not show up.',
                  raw:
                    '* A callback function which will be called when the product logo item is\n   * clicked. If this is passed, the drawer does not show up. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'createLabel',
              },
              value: {
                kind: 'string',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display as the label for the create drawer item.',
                  raw:
                    '* The text to display as the label for the create drawer item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'createTooltip',
              },
              value: {
                kind: 'union',
                types: [
                  {
                    kind: 'string',
                  },
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
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display in the tooltip for the create drawer item.',
                  raw:
                    '* The text to display in the tooltip for the create drawer item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'getCreateRef',
              },
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
                            key: {
                              kind: 'id',
                              name: 'current',
                            },
                            value: {
                              kind: 'union',
                              types: [
                                {
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
                                    params: [
                                      {
                                        kind: 'generic',
                                        value: {
                                          kind: 'typeParamsDeclaration',
                                          params: [
                                            {
                                              kind: 'typeParam',
                                              name: 'T',
                                            },
                                          ],
                                          referenceIdName: 'T',
                                        },
                                      },
                                    ],
                                  },
                                },
                                {
                                  kind: 'null',
                                },
                              ],
                            },
                            optional: false,
                          },
                        ],
                        referenceIdName: 'NonStringRef',
                      },
                      typeParams: {
                        kind: 'typeParams',
                        params: [
                          {
                            kind: 'string',
                            value: 'div',
                          },
                        ],
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'A function to get ref of the create icon',
                  raw: '* A function to get ref of the create icon ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onStarredClick',
              },
              value: {
                kind: 'nullable',
                arguments: {
                  parameters: [],
                  returnType: {
                    kind: 'void',
                  },
                  kind: 'function',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A callback function which will be called when the starred item is clicked.',
                  raw:
                    '* A callback function which will be called when the starred item is clicked.\n   * ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'starredLabel',
              },
              value: {
                kind: 'string',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display as the label for the starred drawer item.',
                  raw:
                    '* The text to display as the label for the starred drawer item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'starredTooltip',
              },
              value: {
                kind: 'union',
                types: [
                  {
                    kind: 'string',
                  },
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
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display in the tooltip for the starred drawer item.',
                  raw:
                    '* The text to display in the tooltip for the starred drawer item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'getStarredRef',
              },
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
                            key: {
                              kind: 'id',
                              name: 'current',
                            },
                            value: {
                              kind: 'union',
                              types: [
                                {
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
                                    params: [
                                      {
                                        kind: 'generic',
                                        value: {
                                          kind: 'typeParamsDeclaration',
                                          params: [
                                            {
                                              kind: 'typeParam',
                                              name: 'T',
                                            },
                                          ],
                                          referenceIdName: 'T',
                                        },
                                      },
                                    ],
                                  },
                                },
                                {
                                  kind: 'null',
                                },
                              ],
                            },
                            optional: false,
                          },
                        ],
                        referenceIdName: 'NonStringRef',
                      },
                      typeParams: {
                        kind: 'typeParams',
                        params: [
                          {
                            kind: 'string',
                            value: 'div',
                          },
                        ],
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'A function to get ref of the starred icon',
                  raw: '* A function to get ref of the starred icon ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onSearchClick',
              },
              value: {
                kind: 'nullable',
                arguments: {
                  parameters: [],
                  returnType: {
                    kind: 'void',
                  },
                  kind: 'function',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A callback function which will be called when the product logo item is\nclicked. If this is passed, the drawer does not show up.',
                  raw:
                    '* A callback function which will be called when the product logo item is\n   * clicked. If this is passed, the drawer does not show up. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'searchLabel',
              },
              value: {
                kind: 'string',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display as the label for the search drawer item.',
                  raw:
                    '* The text to display as the label for the search drawer item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'searchTooltip',
              },
              value: {
                kind: 'union',
                types: [
                  {
                    kind: 'string',
                  },
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
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display in the tooltip for the search drawer item.',
                  raw:
                    '* The text to display in the tooltip for the search drawer item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'getSearchRef',
              },
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
                            key: {
                              kind: 'id',
                              name: 'current',
                            },
                            value: {
                              kind: 'union',
                              types: [
                                {
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
                                    params: [
                                      {
                                        kind: 'generic',
                                        value: {
                                          kind: 'typeParamsDeclaration',
                                          params: [
                                            {
                                              kind: 'typeParam',
                                              name: 'T',
                                            },
                                          ],
                                          referenceIdName: 'T',
                                        },
                                      },
                                    ],
                                  },
                                },
                                {
                                  kind: 'null',
                                },
                              ],
                            },
                            optional: false,
                          },
                        ],
                        referenceIdName: 'NonStringRef',
                      },
                      typeParams: {
                        kind: 'typeParams',
                        params: [
                          {
                            kind: 'string',
                            value: 'div',
                          },
                        ],
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'A function to get ref of the search icon',
                  raw: '* A function to get ref of the search icon ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'appSwitcherComponent',
              },
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
                  params: [
                    {
                      kind: 'exists',
                    },
                  ],
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'The component to render the app switcher.',
                  raw: '* The component to render the app switcher. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'appSwitcherLabel',
              },
              value: {
                kind: 'string',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentLine',
                  value: 'AppSwitcher component',
                  raw: ' AppSwitcher component',
                },
                {
                  type: 'commentBlock',
                  value:
                    'The text to display as the label for the app switcher item.',
                  raw:
                    '* The text to display as the label for the app switcher item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'appSwitcherTooltip',
              },
              value: {
                kind: 'union',
                types: [
                  {
                    kind: 'string',
                  },
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
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display in the tooltip for the app switcher item.',
                  raw:
                    '* The text to display in the tooltip for the app switcher item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'getAppSwitcherRef',
              },
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
                            key: {
                              kind: 'id',
                              name: 'current',
                            },
                            value: {
                              kind: 'union',
                              types: [
                                {
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
                                    params: [
                                      {
                                        kind: 'generic',
                                        value: {
                                          kind: 'typeParamsDeclaration',
                                          params: [
                                            {
                                              kind: 'typeParam',
                                              name: 'T',
                                            },
                                          ],
                                          referenceIdName: 'T',
                                        },
                                      },
                                    ],
                                  },
                                },
                                {
                                  kind: 'null',
                                },
                              ],
                            },
                            optional: false,
                          },
                        ],
                        referenceIdName: 'NonStringRef',
                      },
                      typeParams: {
                        kind: 'typeParams',
                        params: [
                          {
                            kind: 'string',
                            value: 'div',
                          },
                        ],
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'A function to get ref of the appSwitcher icon',
                  raw: '* A function to get ref of the appSwitcher icon ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onHelpClick',
              },
              value: {
                kind: 'nullable',
                arguments: {
                  parameters: [],
                  returnType: {
                    kind: 'void',
                  },
                  kind: 'function',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A callback function which will be called when the help item is clicked.',
                  raw:
                    '* A callback function which will be called when the help item is clicked.\n   * ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'helpLabel',
              },
              value: {
                kind: 'string',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display as the label for the help drawer item.',
                  raw:
                    '* The text to display as the label for the help drawer item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'helpTooltip',
              },
              value: {
                kind: 'union',
                types: [
                  {
                    kind: 'string',
                  },
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
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display in the tooltip for the help drawer item.',
                  raw:
                    '* The text to display in the tooltip for the help drawer item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'getHelpRef',
              },
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
                            key: {
                              kind: 'id',
                              name: 'current',
                            },
                            value: {
                              kind: 'union',
                              types: [
                                {
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
                                    params: [
                                      {
                                        kind: 'generic',
                                        value: {
                                          kind: 'typeParamsDeclaration',
                                          params: [
                                            {
                                              kind: 'typeParam',
                                              name: 'T',
                                            },
                                          ],
                                          referenceIdName: 'T',
                                        },
                                      },
                                    ],
                                  },
                                },
                                {
                                  kind: 'null',
                                },
                              ],
                            },
                            optional: false,
                          },
                        ],
                        referenceIdName: 'NonStringRef',
                      },
                      typeParams: {
                        kind: 'typeParams',
                        params: [
                          {
                            kind: 'string',
                            value: 'div',
                          },
                        ],
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'A function to get ref of the help icon',
                  raw: '* A function to get ref of the help icon ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'enableHelpDrawer',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The boolean that controls whether to display a drawer instead of a menu dropdown.',
                  raw:
                    '* The boolean that controls whether to display a drawer instead of a menu dropdown. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'helpItems',
              },
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
                  params: [
                    {
                      kind: 'object',
                      members: [],
                    },
                  ],
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'A component to render into the help menu dropdown.',
                  raw: '* A component to render into the help menu dropdown. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'helpBadge',
              },
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
                  params: [
                    {
                      kind: 'object',
                      members: [],
                    },
                  ],
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A component displayed over the help icon which can be used to convey a notification',
                  raw:
                    '* A component displayed over the help icon which can be used to convey a notification',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'profileLabel',
              },
              value: {
                kind: 'string',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display as the label for the profile item.',
                  raw:
                    '* The text to display as the label for the profile item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'profileTooltip',
              },
              value: {
                kind: 'union',
                types: [
                  {
                    kind: 'string',
                  },
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
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display in the tooltip for the profile item.',
                  raw:
                    '* The text to display in the tooltip for the profile item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'profileItems',
              },
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
                  params: [
                    {
                      kind: 'object',
                      members: [],
                    },
                  ],
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A component to render into the profile menu dropdown.',
                  raw:
                    '* A component to render into the profile menu dropdown. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'profileIconUrl',
              },
              value: {
                kind: 'string',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The URL of the avatar image to render in the profile item.',
                  raw:
                    '* The URL of the avatar image to render in the profile item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'loginHref',
              },
              value: {
                kind: 'string',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'The URL to redirect anonymous users to.',
                  raw: '* The URL to redirect anonymous users to. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'getProfileRef',
              },
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
                            key: {
                              kind: 'id',
                              name: 'current',
                            },
                            value: {
                              kind: 'union',
                              types: [
                                {
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
                                    params: [
                                      {
                                        kind: 'generic',
                                        value: {
                                          kind: 'typeParamsDeclaration',
                                          params: [
                                            {
                                              kind: 'typeParam',
                                              name: 'T',
                                            },
                                          ],
                                          referenceIdName: 'T',
                                        },
                                      },
                                    ],
                                  },
                                },
                                {
                                  kind: 'null',
                                },
                              ],
                            },
                            optional: false,
                          },
                        ],
                        referenceIdName: 'NonStringRef',
                      },
                      typeParams: {
                        kind: 'typeParams',
                        params: [
                          {
                            kind: 'string',
                            value: 'div',
                          },
                        ],
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'A function to get ref of the profile icon',
                  raw: '* A function to get ref of the profile icon ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onNotificationClick',
              },
              value: {
                kind: 'nullable',
                arguments: {
                  parameters: [],
                  returnType: {
                    kind: 'void',
                  },
                  kind: 'function',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A callback function which will be called when the product logo item is\nclicked. If this is passed, the drawer does not show up.',
                  raw:
                    '* A callback function which will be called when the product logo item is\n   * clicked. If this is passed, the drawer does not show up. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'notificationCount',
              },
              value: {
                kind: 'number',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' The number of unread notifications. Will render as a badge above the\nnotifications item.',
                  raw:
                    '* The number of unread notifications. Will render as a badge above the\n   * notifications item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'notificationsLabel',
              },
              value: {
                kind: 'string',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display as the label for the notifications drawer item.',
                  raw:
                    '* The text to display as the label for the notifications drawer item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'notificationTooltip',
              },
              value: {
                kind: 'union',
                types: [
                  {
                    kind: 'string',
                  },
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
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display in the tooltip for the notifications drawer item.',
                  raw:
                    '* The text to display in the tooltip for the notifications drawer item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'getNotificationRef',
              },
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
                            key: {
                              kind: 'id',
                              name: 'current',
                            },
                            value: {
                              kind: 'union',
                              types: [
                                {
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
                                    params: [
                                      {
                                        kind: 'generic',
                                        value: {
                                          kind: 'typeParamsDeclaration',
                                          params: [
                                            {
                                              kind: 'typeParam',
                                              name: 'T',
                                            },
                                          ],
                                          referenceIdName: 'T',
                                        },
                                      },
                                    ],
                                  },
                                },
                                {
                                  kind: 'null',
                                },
                              ],
                            },
                            optional: false,
                          },
                        ],
                        referenceIdName: 'NonStringRef',
                      },
                      typeParams: {
                        kind: 'typeParams',
                        params: [
                          {
                            kind: 'string',
                            value: 'div',
                          },
                        ],
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'A function to get ref of the notification icon',
                  raw: '* A function to get ref of the notification icon ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onSettingsClick',
              },
              value: {
                kind: 'nullable',
                arguments: {
                  parameters: [],
                  returnType: {
                    kind: 'void',
                  },
                  kind: 'function',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A callback function which will be called when the settings item is clicked.',
                  raw:
                    '* A callback function which will be called when the settings item is clicked. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'settingsLabel',
              },
              value: {
                kind: 'string',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display as the label for the settings drawer item.',
                  raw:
                    '* The text to display as the label for the settings drawer item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'settingsTooltip',
              },
              value: {
                kind: 'union',
                types: [
                  {
                    kind: 'string',
                  },
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
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The text to display in the tooltip for the settings drawer item.',
                  raw:
                    '* The text to display in the tooltip for the settings drawer item. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'getSettingsRef',
              },
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
                            key: {
                              kind: 'id',
                              name: 'current',
                            },
                            value: {
                              kind: 'union',
                              types: [
                                {
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
                                    params: [
                                      {
                                        kind: 'generic',
                                        value: {
                                          kind: 'typeParamsDeclaration',
                                          params: [
                                            {
                                              kind: 'typeParam',
                                              name: 'T',
                                            },
                                          ],
                                          referenceIdName: 'T',
                                        },
                                      },
                                    ],
                                  },
                                },
                                {
                                  kind: 'null',
                                },
                              ],
                            },
                            optional: false,
                          },
                        ],
                        referenceIdName: 'NonStringRef',
                      },
                      typeParams: {
                        kind: 'typeParams',
                        params: [
                          {
                            kind: 'string',
                            value: 'div',
                          },
                        ],
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'A function to get ref of the settings icon',
                  raw: '* A function to get ref of the settings icon ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'isCreateDrawerOpen',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A prop to take control over the opening and closing of drawer. NOTE:\nGlobalNavigation controls the drawer behaviour by default.',
                  raw:
                    '* A prop to take control over the opening and closing of drawer. NOTE:\n   * GlobalNavigation controls the drawer behaviour by default. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'createDrawerContents',
              },
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
                  params: [
                    {
                      kind: 'exists',
                    },
                  ],
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' The contents of the create drawer. This is ignored if onCreateClick is\npassed.',
                  raw:
                    '* The contents of the create drawer. This is ignored if onCreateClick is\n   * passed. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'createDrawerWidth',
              },
              value: {
                kind: 'generic',
                value: {
                  kind: 'import',
                  importKind: 'type',
                  name: 'DrawerWidth',
                  moduleSpecifier: '@atlaskit/drawer',
                  referenceIdName: 'DrawerWidth',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The width of the create drawer. This is "wide" by default.',
                  raw:
                    '* The width of the create drawer. This is "wide" by default. ',
                },
              ],
              default: {
                kind: 'string',
                value: 'wide',
              },
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onCreateDrawerOpen',
              },
              value: {
                parameters: [],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A callback function which will be fired when the create drawer is opened.',
                  raw:
                    '* A callback function which will be fired when the create drawer is opened.\n   * ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'isCreateDrawerFocusLock',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'Control if focus lock is enabled for create drawer',
                  raw: ' Control if focus lock is enabled for create drawer ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onCreateDrawerClose',
              },
              value: {
                parameters: [],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A callback function which will be fired when the create drawer is closed.',
                  raw:
                    '* A callback function which will be fired when the create drawer is closed.\n   * ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onCreateDrawerCloseComplete',
              },
              value: {
                parameters: [
                  {
                    kind: 'param',
                    value: {
                      kind: 'generic',
                      value: {
                        kind: 'id',
                        name: 'HTMLElement',
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A callback function which will be fired when the create drawer has finished its close transition. *',
                  raw:
                    '* A callback function which will be fired when the create drawer has finished its close transition. *',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'shouldCreateDrawerUnmountOnExit',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A prop to decide if the contents of the drawer should unmount on drawer\nclose. It is true by default.',
                  raw:
                    '* A prop to decide if the contents of the drawer should unmount on drawer\n   * close. It is true by default. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'isRecentDrawerOpen',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A prop to take control over the opening and closing of the recent drawer. NOTE:\nGlobalNavigation controls the drawer behaviour by default.',
                  raw:
                    '* A prop to take control over the opening and closing of the recent drawer. NOTE:\n   * GlobalNavigation controls the drawer behaviour by default. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'isRecentDrawerFocusLock',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'Control if focus lock is enabled for recent drawer',
                  raw: ' Control if focus lock is enabled for recent drawer ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'recentDrawerContents',
              },
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
                  params: [
                    {
                      kind: 'exists',
                    },
                  ],
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'The contents of the recent drawer.',
                  raw: '* The contents of the recent drawer. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'recentDrawerWidth',
              },
              value: {
                kind: 'generic',
                value: {
                  kind: 'import',
                  importKind: 'type',
                  name: 'DrawerWidth',
                  moduleSpecifier: '@atlaskit/drawer',
                  referenceIdName: 'DrawerWidth',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The width of the recent drawer. This is "wide" by default.',
                  raw:
                    '* The width of the recent drawer. This is "wide" by default. ',
                },
              ],
              default: {
                kind: 'string',
                value: 'wide',
              },
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onRecentDrawerOpen',
              },
              value: {
                parameters: [],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A callback function which will be called when the recent drawer is\nopened.',
                  raw:
                    '* A callback function which will be called when the recent drawer is\n   * opened. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onRecentDrawerClose',
              },
              value: {
                parameters: [],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A callback function which will be called when the recent drawer is\nclosed.',
                  raw:
                    '* A callback function which will be called when the recent drawer is\n   * closed. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onRecentDrawerCloseComplete',
              },
              value: {
                parameters: [
                  {
                    kind: 'param',
                    value: {
                      kind: 'generic',
                      value: {
                        kind: 'id',
                        name: 'HTMLElement',
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A callback function which will be fired when the recent drawer has finished its close transition. *',
                  raw:
                    '* A callback function which will be fired when the recent drawer has finished its close transition. *',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'shouldRecentDrawerUnmountOnExit',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A prop to decide if the contents of the drawer should unmount on drawer\nclose. It is true by default.',
                  raw:
                    '* A prop to decide if the contents of the drawer should unmount on drawer\n   * close. It is true by default. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'isInviteDrawerOpen',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A prop to take control over the opening and closing of the Global Invite drawer. NOTE:\nGlobalNavigation controls the drawer behaviour by default.',
                  raw:
                    '* A prop to take control over the opening and closing of the Global Invite drawer. NOTE:\n   * GlobalNavigation controls the drawer behaviour by default. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'isInviteDrawerFocusLock',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'Control if focus lock is enabled for invite drawer',
                  raw: ' Control if focus lock is enabled for invite drawer ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'inviteDrawerContents',
              },
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
                  params: [
                    {
                      kind: 'exists',
                    },
                  ],
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'The contents of the global invite drawer.',
                  raw: '* The contents of the global invite drawer. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'inviteDrawerWidth',
              },
              value: {
                kind: 'generic',
                value: {
                  kind: 'import',
                  importKind: 'type',
                  name: 'DrawerWidth',
                  moduleSpecifier: '@atlaskit/drawer',
                  referenceIdName: 'DrawerWidth',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The width of the global invite drawer. This is "wide" by default.',
                  raw:
                    '* The width of the global invite drawer. This is "wide" by default. ',
                },
              ],
              default: {
                kind: 'string',
                value: 'wide',
              },
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onInviteDrawerOpen',
              },
              value: {
                parameters: [],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A callback function which will be called when the global invite drawer is\nopened.',
                  raw:
                    '* A callback function which will be called when the global invite drawer is\n   * opened. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onInviteDrawerClose',
              },
              value: {
                parameters: [],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A callback function which will be called when the global invite drawer is\nclosed.',
                  raw:
                    '* A callback function which will be called when the global invite drawer is\n   * closed. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onInviteDrawerCloseComplete',
              },
              value: {
                parameters: [
                  {
                    kind: 'param',
                    value: {
                      kind: 'generic',
                      value: {
                        kind: 'id',
                        name: 'HTMLElement',
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A callback function which will be fired when the global invite drawer has finished its close transition. *',
                  raw:
                    '* A callback function which will be fired when the global invite drawer has finished its close transition. *',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'shouldInviteDrawerUnmountOnExit',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A prop to decide if the contents of the drawer should unmount on drawer\nclose. It is true by default.',
                  raw:
                    '* A prop to decide if the contents of the drawer should unmount on drawer\n   * close. It is true by default. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'isSearchDrawerOpen',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A prop to take control over the opening and closing of drawer. NOTE:\nGlobalNavigation controls the drawer behaviour by default.',
                  raw:
                    '* A prop to take control over the opening and closing of drawer. NOTE:\n   * GlobalNavigation controls the drawer behaviour by default. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'isSearchDrawerFocusLock',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'Control if focus lock is enabled for search drawer',
                  raw: ' Control if focus lock is enabled for search drawer ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'searchDrawerContents',
              },
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
                  params: [
                    {
                      kind: 'exists',
                    },
                  ],
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' The contents of the search drawer. This is ignored if onSearchClick is\npassed.',
                  raw:
                    '* The contents of the search drawer. This is ignored if onSearchClick is\n   * passed. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'searchDrawerWidth',
              },
              value: {
                kind: 'generic',
                value: {
                  kind: 'import',
                  importKind: 'type',
                  name: 'DrawerWidth',
                  moduleSpecifier: '@atlaskit/drawer',
                  referenceIdName: 'DrawerWidth',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The width of the search drawer. This is "wide" by default.',
                  raw:
                    '* The width of the search drawer. This is "wide" by default. ',
                },
              ],
              default: {
                kind: 'string',
                value: 'wide',
              },
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onSearchDrawerOpen',
              },
              value: {
                parameters: [],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A callback function which will be called when the search drawer is opened.',
                  raw:
                    '* A callback function which will be called when the search drawer is opened.\n   * ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onSearchDrawerClose',
              },
              value: {
                parameters: [],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A callback function which will be called when the search drawer is closed.',
                  raw:
                    '* A callback function which will be called when the search drawer is closed.\n   * ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onSearchDrawerCloseComplete',
              },
              value: {
                parameters: [
                  {
                    kind: 'param',
                    value: {
                      kind: 'generic',
                      value: {
                        kind: 'id',
                        name: 'HTMLElement',
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A callback function which will be fired when the search drawer has finished its close transition. *',
                  raw:
                    '* A callback function which will be fired when the search drawer has finished its close transition. *',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'shouldSearchDrawerUnmountOnExit',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A prop to decide if the contents of the drawer should unmount on drawer\nclose. It is true by default.',
                  raw:
                    '* A prop to decide if the contents of the drawer should unmount on drawer\n   * close. It is true by default. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'isNotificationDrawerOpen',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A prop to take control over the opening and closing of drawer. NOTE:\nGlobalNavigation controls the drawer behaviour by default.',
                  raw:
                    '* A prop to take control over the opening and closing of drawer. NOTE:\n   * GlobalNavigation controls the drawer behaviour by default. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'isNotificationDrawerFocusLock',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'Control if focus lock is enabled for notification drawer',
                  raw:
                    ' Control if focus lock is enabled for notification drawer ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'notificationDrawerContents',
              },
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
                  params: [
                    {
                      kind: 'exists',
                    },
                  ],
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'The contents of the notifications drawer.',
                  raw: '* The contents of the notifications drawer. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'notificationDrawerWidth',
              },
              value: {
                kind: 'generic',
                value: {
                  kind: 'import',
                  importKind: 'type',
                  name: 'DrawerWidth',
                  moduleSpecifier: '@atlaskit/drawer',
                  referenceIdName: 'DrawerWidth',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The width of the notification drawer. This is "wide" by default.',
                  raw:
                    '* The width of the notification drawer. This is "wide" by default. ',
                },
              ],
              default: {
                kind: 'string',
                value: 'wide',
              },
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onNotificationDrawerOpen',
              },
              value: {
                parameters: [],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A callback function which will be called when the notifications drawer is\nopened.',
                  raw:
                    '* A callback function which will be called when the notifications drawer is\n   * opened. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onNotificationDrawerClose',
              },
              value: {
                parameters: [],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A callback function which will be called when the notifications drawer is\nclosed.',
                  raw:
                    '* A callback function which will be called when the notifications drawer is\n   * closed. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onNotificationDrawerCloseComplete',
              },
              value: {
                parameters: [
                  {
                    kind: 'param',
                    value: {
                      kind: 'generic',
                      value: {
                        kind: 'id',
                        name: 'HTMLElement',
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A callback function which will be fired when the notification drawer has finished its close transition. *',
                  raw:
                    '* A callback function which will be fired when the notification drawer has finished its close transition. *',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'locale',
              },
              value: {
                kind: 'string',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'Locale to be passed to the notification iFrame',
                  raw: '* Locale to be passed to the notification iFrame',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'product',
              },
              value: {
                kind: 'union',
                types: [
                  {
                    kind: 'string',
                    value: 'jira',
                  },
                  {
                    kind: 'string',
                    value: 'confluence',
                  },
                ],
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    "Prop to let notification iframe know which product it's being rendered in",
                  raw:
                    "* Prop to let notification iframe know which product it's being rendered in",
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'fabricNotificationLogUrl',
              },
              value: {
                kind: 'string',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'fabricNotificationLogUrl of the user',
                  raw: '* fabricNotificationLogUrl of the user ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'cloudId',
              },
              value: {
                kind: 'string',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'cloudId of the user',
                  raw: '* cloudId of the user ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'shouldNotificationDrawerUnmountOnExit',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A prop to decide if the contents of the drawer should unmount on drawer\nclose. It is true by default.',
                  raw:
                    '* A prop to decide if the contents of the drawer should unmount on drawer\n   * close. It is true by default. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'isStarredDrawerOpen',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A prop to take control over the opening and closing of the star drawer. NOTE:\nGlobalNavigation controls the drawer behaviour by default.',
                  raw:
                    '* A prop to take control over the opening and closing of the star drawer. NOTE:\n   * GlobalNavigation controls the drawer behaviour by default. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'isStarredDrawerFocusLock',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'Control if focus lock is enabled for starred drawer',
                  raw: ' Control if focus lock is enabled for starred drawer ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'starredDrawerContents',
              },
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
                  params: [
                    {
                      kind: 'exists',
                    },
                  ],
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'The contents of the starred drawer.',
                  raw: '* The contents of the starred drawer. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'starredDrawerWidth',
              },
              value: {
                kind: 'generic',
                value: {
                  kind: 'import',
                  importKind: 'type',
                  name: 'DrawerWidth',
                  moduleSpecifier: '@atlaskit/drawer',
                  referenceIdName: 'DrawerWidth',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The width of the starred drawer. This is "wide" by default.',
                  raw:
                    '* The width of the starred drawer. This is "wide" by default. ',
                },
              ],
              default: {
                kind: 'string',
                value: 'wide',
              },
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onStarredDrawerOpen',
              },
              value: {
                parameters: [],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A callback function which will be called when the starred drawer is\nopened.',
                  raw:
                    '* A callback function which will be called when the starred drawer is\n   * opened. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onStarredDrawerClose',
              },
              value: {
                parameters: [],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A callback function which will be called when the starred drawer is\nclosed.',
                  raw:
                    '* A callback function which will be called when the starred drawer is\n   * closed. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onStarredDrawerCloseComplete',
              },
              value: {
                parameters: [
                  {
                    kind: 'param',
                    value: {
                      kind: 'generic',
                      value: {
                        kind: 'id',
                        name: 'HTMLElement',
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A callback function which will be fired when the starred drawer has finished its close transition. *',
                  raw:
                    '* A callback function which will be fired when the starred drawer has finished its close transition. *',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'shouldStarredDrawerUnmountOnExit',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A prop to decide if the contents of the drawer should unmount on drawer\nclose. It is true by default.',
                  raw:
                    '* A prop to decide if the contents of the drawer should unmount on drawer\n   * close. It is true by default. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'isSettingsDrawerOpen',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A prop to take control over the opening and closing of the settings drawer. NOTE:\nGlobalNavigation controls the drawer behaviour by default.',
                  raw:
                    '* A prop to take control over the opening and closing of the settings drawer. NOTE:\n   * GlobalNavigation controls the drawer behaviour by default. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'isSettingsDrawerFocusLock',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'Control if focus lock is enabled for settings drawer',
                  raw: ' Control if focus lock is enabled for settings drawer ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'settingsDrawerContents',
              },
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
                  params: [
                    {
                      kind: 'exists',
                    },
                  ],
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'The contents of the settings drawer.',
                  raw: '* The contents of the settings drawer. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onSettingsDrawerOpen',
              },
              value: {
                parameters: [],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A callback function which will be called when the settings drawer is\nopened.',
                  raw:
                    '* A callback function which will be called when the settings drawer is\n   * opened. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onSettingsDrawerClose',
              },
              value: {
                parameters: [],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A callback function which will be called when the settings drawer is\nclosed.',
                  raw:
                    '* A callback function which will be called when the settings drawer is\n   * closed. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onSettingsDrawerCloseComplete',
              },
              value: {
                parameters: [
                  {
                    kind: 'param',
                    value: {
                      kind: 'generic',
                      value: {
                        kind: 'id',
                        name: 'HTMLElement',
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A callback function which will be fired when the settings drawer has finished its close transition. *',
                  raw:
                    '* A callback function which will be fired when the settings drawer has finished its close transition. *',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'shouldSettingsDrawerUnmountOnExit',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A prop to decide if the contents of the drawer should unmount on drawer\nclose. It is true by default.',
                  raw:
                    '* A prop to decide if the contents of the drawer should unmount on drawer\n   * close. It is true by default. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'isHelpDrawerOpen',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A prop to take control over the opening and closing of the help drawer. NOTE:\nGlobalNavigation controls the drawer behaviour by default.',
                  raw:
                    '* A prop to take control over the opening and closing of the help drawer. NOTE:\n   * GlobalNavigation controls the drawer behaviour by default. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'isHelpDrawerFocusLock',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'Control if focus lock is enabled for help drawer',
                  raw: ' Control if focus lock is enabled for help drawer ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'helpDrawerContents',
              },
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
                  params: [
                    {
                      kind: 'exists',
                    },
                  ],
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'The contents of the help drawer.',
                  raw: '* The contents of the help drawer. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'HelpDrawerWidth',
              },
              value: {
                kind: 'generic',
                value: {
                  kind: 'import',
                  importKind: 'type',
                  name: 'DrawerWidth',
                  moduleSpecifier: '@atlaskit/drawer',
                  referenceIdName: 'DrawerWidth',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'The width of the help drawer. This is "wide" by default.',
                  raw:
                    '* The width of the help drawer. This is "wide" by default. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onHelpDrawerOpen',
              },
              value: {
                parameters: [],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A callback function which will be called when the help drawer is\nopened.',
                  raw:
                    '* A callback function which will be called when the help drawer is\n   * opened. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onHelpDrawerClose',
              },
              value: {
                parameters: [],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A callback function which will be called when the help drawer is\nclosed.',
                  raw:
                    '* A callback function which will be called when the help drawer is\n   * closed. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'onHelpDrawerCloseComplete',
              },
              value: {
                parameters: [
                  {
                    kind: 'param',
                    value: {
                      kind: 'generic',
                      value: {
                        kind: 'id',
                        name: 'HTMLElement',
                      },
                    },
                    type: null,
                  },
                ],
                returnType: {
                  kind: 'void',
                },
                kind: 'function',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'A callback function which will be fired when the help drawer has finished its close transition. *',
                  raw:
                    '* A callback function which will be fired when the help drawer has finished its close transition. *',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'shouldHelpDrawerUnmountOnExit',
              },
              value: {
                kind: 'boolean',
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    ' A prop to decide if the contents of the drawer should unmount on drawer\nclose. It is true by default.',
                  raw:
                    '* A prop to decide if the contents of the drawer should unmount on drawer\n   * close. It is true by default. ',
                },
              ],
            },
            {
              kind: 'property',
              key: {
                kind: 'id',
                name: 'drawerBackIcon',
              },
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
                  value: 'An optional Prop to configure the back icon',
                  raw: '* An optional Prop to configure the back icon ',
                },
              ],
              default: {
                kind: 'null',
              },
            },
          ],
          referenceIdName: 'GlobalNavigationProps',
        },
        name: {
          kind: 'id',
          name: 'GlobalNavigation',
          type: null,
        },
      },
    }}
  />
)}
`;
