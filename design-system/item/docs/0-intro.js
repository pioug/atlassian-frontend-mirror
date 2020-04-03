import React from 'react';
import { code, md, Example, Props } from '@atlaskit/docs';

export default md`

# This package is for internal consumption only. Use at your own risk.

This is a generic Item component, designed to be composed declaratively into other components.
Item is generally a layout component, concerned with visual presentation of the content provided via props.
  
  ## Usage

  ${code`
  import Item from '@atlaskit/item';
  `}

  ${(
    <Example
      packageName="@atlaskit/item"
      Component={require('../examples/00-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}
  
  ${(
    <Props
      heading="Item Props"
      props={{
        kind: 'program',
        component: {
          kind: 'generic',
          value: {
            kind: 'object',
            members: [
              {
                kind: 'property',
                key: { kind: 'id', name: 'autoFocus' },
                value: { kind: 'boolean' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Whether the Item should attempt to gain browser focus when mounted',
                    raw:
                      '* Whether the Item should attempt to gain browser focus when mounted ',
                  },
                ],
                default: { kind: 'boolean', value: false },
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
                    value: 'Main content to be shown inside the item.',
                    raw: '* Main content to be shown inside the item. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'description' },
                value: { kind: 'string' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Secondary text to be shown underneath the main content.',
                    raw:
                      '* Secondary text to be shown underneath the main content. ',
                  },
                ],
                default: { kind: 'string', value: '' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'dnd' },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'object',
                    members: [
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'draggableProps' },
                        value: {
                          kind: 'generic',
                          value: { kind: 'id', name: 'Object' },
                        },
                        optional: false,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'dragHandleProps' },
                        value: {
                          kind: 'nullable',
                          arguments: {
                            kind: 'generic',
                            value: { kind: 'id', name: 'Object' },
                          },
                        },
                        optional: false,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'innerRef' },
                        value: {
                          parameters: [
                            {
                              kind: 'param',
                              value: {
                                kind: 'union',
                                types: [
                                  {
                                    kind: 'generic',
                                    value: { kind: 'id', name: 'HTMLElement' },
                                  },
                                  { kind: 'null' },
                                ],
                              },
                              type: null,
                            },
                          ],
                          returnType: { kind: 'void' },
                          kind: 'function',
                        },
                        optional: false,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'placeholder' },
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
                      },
                    ],
                    referenceIdName: 'DnDType',
                  },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Drag and drop props provided by react-beautiful-dnd. Please do not use\nthis unless using react-beautiful-dnd',
                    raw:
                      '* Drag and drop props provided by react-beautiful-dnd. Please do not use\n   * this unless using react-beautiful-dnd ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'elemAfter' },
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
                      ' Content to be shown after the main content. Shown to the right of content (or to the left\nin RTL mode).',
                    raw:
                      '* Content to be shown after the main content. Shown to the right of content (or to the left\n   * in RTL mode). ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'elemBefore' },
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
                      ' Content to be shown before the main content. Shown to the left of content (or to the right\nin RTL mode).',
                    raw:
                      '* Content to be shown before the main content. Shown to the left of content (or to the right\n   * in RTL mode). ',
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
                    value:
                      'Link that the user will be redirected to when the item is clicked. If omitted, a\nnon-hyperlink component will be rendered.',
                    raw:
                      '* Link that the user will be redirected to when the item is clicked. If omitted, a\n   *  non-hyperlink component will be rendered. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isCompact' },
                value: { kind: 'boolean' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Causes the item to be rendered with reduced spacing.',
                    raw:
                      '* Causes the item to be rendered with reduced spacing. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isDisabled' },
                value: { kind: 'boolean' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Causes the item to appear in a disabled state and click behaviours will not be triggered.',
                    raw:
                      '* Causes the item to appear in a disabled state and click behaviours will not be triggered. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isDragging' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Used to apply correct dragging styles when also using react-beautiful-dnd.',
                    raw:
                      '* Used to apply correct dragging styles when also using react-beautiful-dnd. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isHidden' },
                value: { kind: 'boolean' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Causes the item to still be rendered, but with `display: none` applied.',
                    raw:
                      '* Causes the item to still be rendered, but with `display: none` applied. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
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
                  value: { kind: 'id', name: 'Function' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Optional function to be used for rendering links. Receives `href` and possibly `target`\nas props.',
                    raw:
                      '* Optional function to be used for rendering links. Receives `href` and possibly `target`\n   * as props. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onClick' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Function' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Function to be called when the item is clicked, Receives the MouseEvent.',
                    raw:
                      '* Function to be called when the item is clicked, Receives the MouseEvent. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onKeyDown' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Function' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Function to be called when the item is pressed with a keyboard,\nReceives the KeyboardEvent.',
                    raw:
                      '* Function to be called when the item is pressed with a keyboard,\n   * Receives the KeyboardEvent. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onMouseEnter' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Function' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Standard onmouseenter event',
                    raw: '* Standard onmouseenter event ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onMouseLeave' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Function' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Standard onmouseleave event',
                    raw: '* Standard onmouseleave event ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'role' },
                value: { kind: 'string' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Allows the role attribute of the item to be altered from it\'s default of\n`role="button"`',
                    raw:
                      '* Allows the role attribute of the item to be altered from it\'s default of\n   *  `role="button"` ',
                  },
                ],
                default: { kind: 'string', value: 'button' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'shouldAllowMultiline' },
                value: { kind: 'boolean' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Allows the `children` content to break onto a new line, rather than truncating the\ncontent.',
                    raw:
                      '* Allows the `children` content to break onto a new line, rather than truncating the\n   *  content. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'target' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Target frame for item `href` link to be aimed at.',
                    raw: '* Target frame for item `href` link to be aimed at. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'title' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Standard browser title to be displayed on the item when hovered.',
                    raw:
                      '* Standard browser title to be displayed on the item when hovered. ',
                  },
                ],
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'Item', type: null },
        },
      }}
    />
  )}

  ${(
    <Props
      heading="ItemGroup Props"
      props={{
        kind: 'program',
        component: {
          kind: 'generic',
          value: {
            kind: 'object',
            members: [
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
                    value: 'Items to be shown inside the item group.',
                    raw: '* Items to be shown inside the item group. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isCompact' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Causes the group title to be rendered with reduced spacing.',
                    raw:
                      '* Causes the group title to be rendered with reduced spacing. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'title' },
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
                    value: 'Optional heading text to be shown above the items.',
                    raw:
                      '* Optional heading text to be shown above the items. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'elemAfter' },
                value: {
                  kind: 'union',
                  types: [
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
                    { kind: 'string' },
                  ],
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Content to be shown to the right of the heading',
                    raw: '* Content to be shown to the right of the heading ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'innerRef' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Function' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'A function that returns the DOM ref created by the group',
                    raw:
                      '* A function that returns the DOM ref created by the group ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'role' },
                value: { kind: 'string' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Accessibility role to be applied to the root component',
                    raw:
                      '* Accessibility role to be applied to the root component ',
                  },
                ],
                default: { kind: 'string', value: 'group' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'label' },
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
                      'Accessibility label - if not provided the title will be used if available',
                    raw:
                      '* Accessibility label - if not provided the title will be used if available ',
                  },
                ],
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'ItemGroup', type: null },
        },
      }}
    />
  )}

  ${(
    <Props
      heading="withItemClick Props"
      props={{
        kind: 'program',
        component: {
          kind: 'generic',
          value: {
            kind: 'object',
            members: [
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
                    value: 'Items to be shown inside the item group.',
                    raw: '* Items to be shown inside the item group. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isCompact' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Causes the group title to be rendered with reduced spacing.',
                    raw:
                      '* Causes the group title to be rendered with reduced spacing. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'title' },
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
                    value: 'Optional heading text to be shown above the items.',
                    raw:
                      '* Optional heading text to be shown above the items. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'elemAfter' },
                value: {
                  kind: 'union',
                  types: [
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
                    { kind: 'string' },
                  ],
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Content to be shown to the right of the heading',
                    raw: '* Content to be shown to the right of the heading ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'innerRef' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Function' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'A function that returns the DOM ref created by the group',
                    raw:
                      '* A function that returns the DOM ref created by the group ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'role' },
                value: { kind: 'string' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Accessibility role to be applied to the root component',
                    raw:
                      '* Accessibility role to be applied to the root component ',
                  },
                ],
                default: { kind: 'string', value: 'group' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'label' },
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
                      'Accessibility label - if not provided the title will be used if available',
                    raw:
                      '* Accessibility label - if not provided the title will be used if available ',
                  },
                ],
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'ItemGroup', type: null },
        },
      }}
    />
  )}

  ${(
    <Props
      heading="withItemFocus Props"
      props={{
        kind: 'program',
        component: {
          kind: 'generic',
          value: {
            kind: 'object',
            members: [
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
                    value: 'Items to be shown inside the item group.',
                    raw: '* Items to be shown inside the item group. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isCompact' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Causes the group title to be rendered with reduced spacing.',
                    raw:
                      '* Causes the group title to be rendered with reduced spacing. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'title' },
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
                    value: 'Optional heading text to be shown above the items.',
                    raw:
                      '* Optional heading text to be shown above the items. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'elemAfter' },
                value: {
                  kind: 'union',
                  types: [
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
                    { kind: 'string' },
                  ],
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Content to be shown to the right of the heading',
                    raw: '* Content to be shown to the right of the heading ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'innerRef' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Function' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'A function that returns the DOM ref created by the group',
                    raw:
                      '* A function that returns the DOM ref created by the group ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'role' },
                value: { kind: 'string' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Accessibility role to be applied to the root component',
                    raw:
                      '* Accessibility role to be applied to the root component ',
                  },
                ],
                default: { kind: 'string', value: 'group' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'label' },
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
                      'Accessibility label - if not provided the title will be used if available',
                    raw:
                      '* Accessibility label - if not provided the title will be used if available ',
                  },
                ],
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'ItemGroup', type: null },
        },
      }}
    />
  )}
`;
