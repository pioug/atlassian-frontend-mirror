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

  Drawers are designed to enter from the left of the screen and overlay the site,
  allowing additional options to be visible that are outside or may change the
  page. The two standard drawers are \`AkCreateDrawer\` and \`AkSearchDrawer\`,
  which are designed to line up with the global navigation icons to open them.

  Navigation also exports components to implement search.

  ${(
    <Props
      shouldCollapseProps
      heading="AkCreateDrawer Props"
      props={{
        kind: 'program',
        component: {
          kind: 'generic',
          value: {
            kind: 'object',
            members: [
              {
                kind: 'property',
                key: { kind: 'id', name: 'backIcon' },
                value: {
                  kind: 'generic',
                  value: { kind: 'any', referenceIdName: 'ReactElement' },
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'The icon to use as the back icon for this drawer',
                    raw: '* The icon to use as the back icon for this drawer ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'children' },
                value: {
                  kind: 'generic',
                  value: { kind: 'any', referenceIdName: 'ReactElement' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'The drawer contents',
                    raw: '* The drawer contents ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'header' },
                value: {
                  kind: 'generic',
                  value: { kind: 'any', referenceIdName: 'ReactElement' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'The header for this Drawer – often the ContainerTitle for a given Container',
                    raw:
                      '* The header for this Drawer – often the ContainerTitle for a given Container ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isOpen' },
                value: { kind: 'boolean' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Set whether the drawer is visible.',
                    raw: '* Set whether the drawer is visible. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isFullWidth' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Whether the Drawer is full width – used for focus tasks',
                    raw:
                      '* Whether the Drawer is full width – used for focus tasks ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onBackButton' },
                value: {
                  parameters: [],
                  returnType: { kind: 'mixed' },
                  kind: 'function',
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' A function to call when the backIcon button is clicked, or when the blanket\nbehind the Drawer is clicked',
                    raw:
                      '* A function to call when the backIcon button is clicked, or when the blanket\n   behind the Drawer is clicked ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'primaryIcon' },
                value: {
                  kind: 'generic',
                  value: { kind: 'any', referenceIdName: 'ReactElement' },
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' The primary icon in the Drawer – usually the globalPrimaryIcon that was\ngiven to the GlobalNavigation component',
                    raw:
                      '* The primary icon in the Drawer – usually the globalPrimaryIcon that was\n   given to the GlobalNavigation component ',
                  },
                ],
              },
            ],
            referenceIdName: 'DrawerProps',
          },
          name: { kind: 'id', name: 'CreateDrawer', type: null },
        },
      }}
    />
  )}

  ${(
    <Props
      shouldCollapseProps
      heading="AkSearchDrawer Props"
      props={{
        kind: 'program',
        component: {
          kind: 'generic',
          value: {
            kind: 'object',
            members: [
              {
                kind: 'property',
                key: { kind: 'id', name: 'backIcon' },
                value: {
                  kind: 'generic',
                  value: { kind: 'any', referenceIdName: 'ReactElement' },
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'The icon to use as the back icon for this drawer',
                    raw: '* The icon to use as the back icon for this drawer ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'children' },
                value: {
                  kind: 'generic',
                  value: { kind: 'any', referenceIdName: 'ReactElement' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'The drawer contents',
                    raw: '* The drawer contents ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'header' },
                value: {
                  kind: 'generic',
                  value: { kind: 'any', referenceIdName: 'ReactElement' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'The header for this Drawer – often the ContainerTitle for a given Container',
                    raw:
                      '* The header for this Drawer – often the ContainerTitle for a given Container ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isOpen' },
                value: { kind: 'boolean' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Set whether the drawer is visible.',
                    raw: '* Set whether the drawer is visible. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isFullWidth' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Whether the Drawer is full width – used for focus tasks',
                    raw:
                      '* Whether the Drawer is full width – used for focus tasks ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onBackButton' },
                value: {
                  parameters: [],
                  returnType: { kind: 'mixed' },
                  kind: 'function',
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' A function to call when the backIcon button is clicked, or when the blanket\nbehind the Drawer is clicked',
                    raw:
                      '* A function to call when the backIcon button is clicked, or when the blanket\n   behind the Drawer is clicked ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'primaryIcon' },
                value: {
                  kind: 'generic',
                  value: { kind: 'any', referenceIdName: 'ReactElement' },
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' The primary icon in the Drawer – usually the globalPrimaryIcon that was\ngiven to the GlobalNavigation component',
                    raw:
                      '* The primary icon in the Drawer – usually the globalPrimaryIcon that was\n   given to the GlobalNavigation component ',
                  },
                ],
              },
            ],
            referenceIdName: 'DrawerProps',
          },
          name: { kind: 'id', name: 'SearchDrawer', type: null },
        },
      }}
    />
  )}

  ${(
    <Props
      shouldCollapseProps
      heading="AkCustomDrawer Props"
      props={{
        kind: 'program',
        component: {
          kind: 'intersection',
          types: [
            {
              kind: 'generic',
              value: {
                kind: 'object',
                members: [
                  {
                    kind: 'property',
                    key: { kind: 'id', name: 'backIcon' },
                    value: {
                      kind: 'generic',
                      value: { kind: 'any', referenceIdName: 'ReactElement' },
                    },
                    optional: false,
                    leadingComments: [
                      {
                        type: 'commentBlock',
                        value:
                          'The icon to use as the back icon for this drawer',
                        raw:
                          '* The icon to use as the back icon for this drawer ',
                      },
                    ],
                  },
                  {
                    kind: 'property',
                    key: { kind: 'id', name: 'children' },
                    value: {
                      kind: 'generic',
                      value: { kind: 'any', referenceIdName: 'ReactElement' },
                    },
                    optional: true,
                    leadingComments: [
                      {
                        type: 'commentBlock',
                        value: 'The drawer contents',
                        raw: '* The drawer contents ',
                      },
                    ],
                  },
                  {
                    kind: 'property',
                    key: { kind: 'id', name: 'header' },
                    value: {
                      kind: 'generic',
                      value: { kind: 'any', referenceIdName: 'ReactElement' },
                    },
                    optional: true,
                    leadingComments: [
                      {
                        type: 'commentBlock',
                        value:
                          'The header for this Drawer – often the ContainerTitle for a given Container',
                        raw:
                          '* The header for this Drawer – often the ContainerTitle for a given Container ',
                      },
                    ],
                  },
                  {
                    kind: 'property',
                    key: { kind: 'id', name: 'isOpen' },
                    value: { kind: 'boolean' },
                    optional: false,
                    leadingComments: [
                      {
                        type: 'commentBlock',
                        value: 'Set whether the drawer is visible.',
                        raw: '* Set whether the drawer is visible. ',
                      },
                    ],
                  },
                  {
                    kind: 'property',
                    key: { kind: 'id', name: 'isFullWidth' },
                    value: { kind: 'boolean' },
                    optional: true,
                    leadingComments: [
                      {
                        type: 'commentBlock',
                        value:
                          'Whether the Drawer is full width – used for focus tasks',
                        raw:
                          '* Whether the Drawer is full width – used for focus tasks ',
                      },
                    ],
                  },
                  {
                    kind: 'property',
                    key: { kind: 'id', name: 'onBackButton' },
                    value: {
                      parameters: [],
                      returnType: { kind: 'mixed' },
                      kind: 'function',
                    },
                    optional: false,
                    leadingComments: [
                      {
                        type: 'commentBlock',
                        value:
                          ' A function to call when the backIcon button is clicked, or when the blanket\nbehind the Drawer is clicked',
                        raw:
                          '* A function to call when the backIcon button is clicked, or when the blanket\n   behind the Drawer is clicked ',
                      },
                    ],
                  },
                  {
                    kind: 'property',
                    key: { kind: 'id', name: 'primaryIcon' },
                    value: {
                      kind: 'generic',
                      value: { kind: 'any', referenceIdName: 'ReactElement' },
                    },
                    optional: false,
                    leadingComments: [
                      {
                        type: 'commentBlock',
                        value:
                          ' The primary icon in the Drawer – usually the globalPrimaryIcon that was\ngiven to the GlobalNavigation component',
                        raw:
                          '* The primary icon in the Drawer – usually the globalPrimaryIcon that was\n   given to the GlobalNavigation component ',
                      },
                    ],
                  },
                ],
                referenceIdName: 'DrawerProps',
              },
            },
            {
              kind: 'object',
              members: [
                {
                  kind: 'property',
                  key: { kind: 'id', name: 'width' },
                  value: {
                    kind: 'union',
                    types: [
                      { kind: 'string', value: 'narrow' },
                      { kind: 'string', value: 'medium' },
                      { kind: 'string', value: 'wide' },
                      { kind: 'string', value: 'full' },
                    ],
                  },
                  optional: false,
                  default: { kind: 'string', value: 'wide' },
                },
              ],
            },
          ],
          name: { kind: 'id', name: 'CustomDrawer', type: null },
        },
      }}
    />
  )}
`;
