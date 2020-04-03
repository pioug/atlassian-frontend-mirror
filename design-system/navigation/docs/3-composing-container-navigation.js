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

  The components provided here are designed to be used within the container
  navigation to ensure the correct stylistic behaviour for items within them.

  \`AkNavigationItem\` is designed to be the basic item within the container
  navigation, and can be wrapped in \`AkNavigationItemGroup\` to help
  differentiate items.

  ${(
    <Props
      shouldCollapseProps
      heading="AkNavigationItem Props"
      props={{
        kind: 'program',
        component: {
          kind: 'generic',
          value: {
            kind: 'object',
            members: [
              {
                kind: 'property',
                key: { kind: 'id', name: 'action' },
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
              {
                kind: 'property',
                key: { kind: 'id', name: 'caption' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Text to appear to the right of the text. It has a lower font-weight.',
                    raw:
                      '* Text to appear to the right of the text. It has a lower font-weight. ',
                  },
                ],
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
                          kind: 'object',
                          members: [
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'style' },
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
                              key: {
                                kind: 'string',
                                value: 'data-react-beautiful-dnd-draggable',
                              },
                              value: { kind: 'string' },
                              optional: false,
                            },
                          ],
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
                          kind: 'generic',
                          value: { kind: 'id', name: 'Function' },
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
                key: { kind: 'id', name: 'href' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Location to link out to on click. This is passed down to the custom link\ncomponent if one is provided.',
                    raw:
                      '* Location to link out to on click. This is passed down to the custom link\n   component if one is provided. ',
                  },
                ],
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
                key: { kind: 'id', name: 'icon' },
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
                      ' React element to appear to the left of the text. This should be an\n@atlaskit/icon component. For accessibility reasons, set the label for the icon to an empty string if providing\na text prop for this item.',
                    raw:
                      '* React element to appear to the left of the text. This should be an\n   @atlaskit/icon component. For accessibility reasons, set the label for the icon to an empty string if providing\n   a text prop for this item. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'dropIcon' },
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
                      ' Element displayed to the right of the item. The dropIcon should generally be\nan appropriate @atlaskit icon, such as the ExpandIcon.',
                    raw:
                      '* Element displayed to the right of the item. The dropIcon should generally be\n   an appropriate @atlaskit icon, such as the ExpandIcon. ',
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
                      'Makes the navigation item appear with reduced padding and font size.',
                    raw:
                      '* Makes the navigation item appear with reduced padding and font size. ',
                  },
                ],
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
                key: { kind: 'id', name: 'isSelected' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Set whether the item should be highlighted as selected. Selected items have\na different background color.',
                    raw:
                      '* Set whether the item should be highlighted as selected. Selected items have\n   a different background color. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isDropdownTrigger' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Set whether the item should be used to trigger a dropdown. If this is true,\nThe href property will be disabled.',
                    raw:
                      '* Set whether the item should be used to trigger a dropdown. If this is true,\n   The href property will be disabled. ',
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
                  typeParams: { kind: 'typeParams', params: [{ kind: 'any' }] },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Component to be used as link, if default link component does not suit, such\nas if you are using a different router. Component is passed a href prop, and the content\nof the title as children. Any custom link component must accept a className prop so that\nit can be styled.',
                    raw:
                      '* Component to be used as link, if default link component does not suit, such\n  as if you are using a different router. Component is passed a href prop, and the content\n  of the title as children. Any custom link component must accept a className prop so that\n  it can be styled. ',
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
                        kind: 'nullable',
                        arguments: {
                          kind: 'generic',
                          value: { kind: 'id', name: 'MouseEvent' },
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
                      ' Function to be called on click. This is passed down to a custom link component,\nif one is provided.',
                    raw:
                      '* Function to be called on click. This is passed down to a custom link component,\n   if one is provided.  ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onKeyDown' },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'generic',
                        value: { kind: 'id', name: 'KeyboardEvent' },
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
                      ' Function to be called on click. This is passed down to a custom link component,\nif one is provided.',
                    raw:
                      '* Function to be called on click. This is passed down to a custom link component,\n   if one is provided.  ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onMouseEnter' },
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
                key: { kind: 'id', name: 'subText' },
                value: { kind: 'nullable', arguments: { kind: 'string' } },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Text to be shown alongside the main `text`.',
                    raw: '* Text to be shown alongside the main `text`. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'text' },
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
                      ' Main text to be displayed as the item. Accepts a react component but in most\ncases this should just be a string.',
                    raw:
                      '* Main text to be displayed as the item. Accepts a react component but in most\n   cases this should just be a string. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'textAfter' },
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
                      'React component to be placed to the right of the main text.',
                    raw:
                      '* React component to be placed to the right of the main text. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'autoFocus' },
                value: { kind: 'boolean' },
                optional: true,
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
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'NavigationItem', type: null },
        },
      }}
    />
  )}

  ${(
    <Props
      shouldCollapseProps
      heading="AkNavigationItemGroup Props"
      props={{
        kind: 'program',
        component: {
          kind: 'generic',
          value: {
            kind: 'object',
            members: [
              {
                kind: 'property',
                key: { kind: 'id', name: 'action' },
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
                      'React element to be displayed to the right of the group header.',
                    raw:
                      '* React element to be displayed to the right of the group header. ',
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
                      ' React Elements to be displayed within the group. This should generally be\na collection of NavigationItems.',
                    raw:
                      '* React Elements to be displayed within the group. This should generally be\n   a collection of NavigationItems. ',
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
                    value: 'Set whether the text should be compacted.',
                    raw: '* Set whether the text should be compacted. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'hasSeparator' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Set whether a separator should appear above the group.',
                    raw:
                      '* Set whether a separator should appear above the group. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
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
                      'Text to appear as heading above group. Will be auto-capitalised.',
                    raw:
                      '* Text to appear as heading above group. Will be auto-capitalised. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'innerRef' },
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
                      'A function that returns the DOM ref created by the group',
                    raw:
                      '* A function that returns the DOM ref created by the group ',
                  },
                ],
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'NavigationItemGroup', type: null },
        },
      }}
    />
  )}

  ${(
    <Props
      shouldCollapseProps
      heading="AkContainerTitle Props"
      props={{
        kind: 'program',
        component: {
          kind: 'generic',
          value: {
            kind: 'object',
            members: [
              {
                kind: 'property',
                key: { kind: 'id', name: 'href' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Location to link out to on click. This is passed down to the custom link\ncomponent if one is provided.',
                    raw:
                      '* Location to link out to on click. This is passed down to the custom link\n   component if one is provided. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'icon' },
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
                      ' React element to appear to the left of the text. This should be an\n@atlaskit/icon component.',
                    raw:
                      '* React element to appear to the left of the text. This should be an\n   @atlaskit/icon component. ',
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
                      'Component to be used as link, if default link component does not suit, such\nas if you are using a different router. Component is passed a href prop, and the content\nof the title as children. Any custom link component must accept a className prop so that\nit can be styled.',
                    raw:
                      '* Component to be used as link, if default link component does not suit, such\n  as if you are using a different router. Component is passed a href prop, and the content\n  of the title as children. Any custom link component must accept a className prop so that\n  it can be styled. ',
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
                        kind: 'nullable',
                        arguments: {
                          kind: 'generic',
                          value: { kind: 'id', name: 'MouseEvent' },
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
                      ' Function to be called on click. This is passed down to a custom link component,\nif one is provided.',
                    raw:
                      '* Function to be called on click. This is passed down to a custom link component,\n   if one is provided.  ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onKeyDown' },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'generic',
                        value: { kind: 'id', name: 'KeyboardEvent' },
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
                      ' Function to be called on click. This is passed down to a custom link component,\nif one is provided.',
                    raw:
                      '* Function to be called on click. This is passed down to a custom link component,\n   if one is provided.  ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onMouseEnter' },
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
                key: { kind: 'id', name: 'subText' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Text to be shown alongside the main `text`.',
                    raw: '* Text to be shown alongside the main `text`. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'text' },
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
                      ' Main text to be displayed as the item. Accepts a react component but in most\ncases this should just be a string.',
                    raw:
                      '* Main text to be displayed as the item. Accepts a react component but in most\n   cases this should just be a string. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'theme' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Object' },
                },
                optional: false,
                leadingComments: [
                  { type: 'commentLine', value: 'TODO', raw: ' TODO' },
                ],
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'ContainerTitle', type: null },
        },
      }}
    />
  )}

  ${(
    <Props
      shouldCollapseProps
      heading="AkContainerLogo Props"
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
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Elements to be wrapped with the Logo styling.',
                    raw: '* Elements to be wrapped with the Logo styling. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'theme' },
                value: { kind: 'object', members: [] },
                optional: false,
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'ContainerLogo', type: null },
        },
      }}
    />
  )}

  ${(
    <Props
      shouldCollapseProps
      heading="AkContainerTitleDropdown Props"
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
                    value:
                      ' Content that will be rendered inside the layer element. Should typically be\n`DropdownItemGroup` or `DropdownItem`, or checkbox / radio variants of those.',
                    raw:
                      '* Content that will be rendered inside the layer element. Should typically be\n   * `DropdownItemGroup` or `DropdownItem`, or checkbox / radio variants of those. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'icon' },
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
                    value: 'Image appear to the left of the text.',
                    raw: '* Image appear to the left of the text. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'subText' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Text to appear below the title.',
                    raw: '* Text to appear below the title. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'text' },
                value: { kind: 'string' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Text to appear as the title. This is placed at the top and bolded.',
                    raw:
                      '* Text to appear as the title. This is placed at the top and bolded. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'theme' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Object' },
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Theme used',
                    raw: '* Theme used ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'defaultDropdownOpen' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Controls the initial open state of the dropdown.',
                    raw: '* Controls the initial open state of the dropdown. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isDropdownOpen' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Controls the open state of the dropdown.',
                    raw: '* Controls the open state of the dropdown. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isDropdownLoading' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'If true, a Spinner is rendered instead of the items',
                    raw:
                      '* If true, a Spinner is rendered instead of the items ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onDropdownOpenChange' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Function' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Called when the menu is open or closed. Received an object with isOpen state.',
                    raw:
                      '* Called when the menu is open or closed. Received an object with isOpen state. ',
                  },
                ],
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'ContainerTitleDropdown', type: null },
        },
      }}
    />
  )}

  ${(
    <Props
      shouldCollapseProps
      heading="AkContainerNavigation Props"
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
                      'Icon to be rendered in the globalPrimaryActions internal component when\nisCollapsed is true. When clicked, onGlobalCreateActivate is called. It is\nrecommended that you use an atlaskit icon.',
                    raw:
                      '* Icon to be rendered in the globalPrimaryActions internal component when\n  isCollapsed is true. When clicked, onGlobalCreateActivate is called. It is\n  recommended that you use an atlaskit icon. ',
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
                      ' A list of nodes to be rendered as the global primary actions.  They appear\ndirectly underneath the global primary icon. This must not exceed three nodes',
                    raw:
                      '* A list of nodes to be rendered as the global primary actions.  They appear\n   directly underneath the global primary icon. This must not exceed three nodes ',
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
                      'Icon to be rendered at the top of the globalPrimaryActions internal component\nwhen isCollapsed is true. It is renered as a linkComponent, using the\nglobalPrimaryItemHref. It is recommended that you use an atlaskit icon.',
                    raw:
                      '* Icon to be rendered at the top of the globalPrimaryActions internal component\n  when isCollapsed is true. It is renered as a linkComponent, using the\n  globalPrimaryItemHref. It is recommended that you use an atlaskit icon. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'globalPrimaryItemHref' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'href to be used around the globalPrimaryIcon.',
                    raw: '* href to be used around the globalPrimaryIcon. ',
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
                      'Icon to be displayed in the middle of the internal globalPrimaryActions\ncomponent. On click, onGlobalSearchActivate is called. It is recommended\nthat you use an atlaskit icon.',
                    raw:
                      '* Icon to be displayed in the middle of the internal globalPrimaryActions\n  component. On click, onGlobalSearchActivate is called. It is recommended\n  that you use an atlaskit icon. ',
                  },
                ],
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
                key: { kind: 'id', name: 'headerComponent' },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: { kind: 'object', members: [] },
                      type: null,
                    },
                  ],
                  returnType: {
                    kind: 'generic',
                    value: {
                      kind: 'import',
                      importKind: 'type',
                      name: 'Node',
                      moduleSpecifier: 'react',
                      referenceIdName: 'Node',
                    },
                  },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Functional react component that is passed the prop isCollapsed. The AkContainerTitle\ncomponent is designed to be used as the headerComponent.',
                    raw:
                      '* Functional react component that is passed the prop isCollapsed. The AkContainerTitle\n   component is designed to be used as the headerComponent. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isCollapsed' },
                value: { kind: 'boolean' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Set to determine whether the ContainerNavigation should be rendered in its\nopen state or closed state. Passed through to the headerComponent.',
                    raw:
                      '* Set to determine whether the ContainerNavigation should be rendered in its\n   open state or closed state. Passed through to the headerComponent. ',
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
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' A component to be used as a link. By Default this is an anchor. when a href\nis passed to it, and otherwise is a button.',
                    raw:
                      '* A component to be used as a link. By Default this is an anchor. when a href\n   is passed to it, and otherwise is a button. ',
                  },
                ],
                default: {
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
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'className' },
                        value: { kind: 'string' },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'href' },
                        value: { kind: 'string' },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'onClick' },
                        value: {
                          parameters: [],
                          returnType: { kind: 'mixed' },
                          kind: 'function',
                        },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'onMouseDown' },
                        value: {
                          parameters: [],
                          returnType: { kind: 'mixed' },
                          kind: 'function',
                        },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'onMouseEnter' },
                        value: {
                          parameters: [],
                          returnType: { kind: 'mixed' },
                          kind: 'function',
                        },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'onMouseLeave' },
                        value: {
                          parameters: [],
                          returnType: { kind: 'mixed' },
                          kind: 'function',
                        },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'tabIndex' },
                        value: { kind: 'number' },
                        optional: true,
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
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'isSelected' },
                        value: { kind: 'boolean' },
                        optional: true,
                      },
                    ],
                    referenceIdName: 'Props',
                  },
                  name: {
                    kind: 'id',
                    name: 'DefaultLinkComponent',
                    type: null,
                  },
                  referenceIdName: 'DefaultLinkComponent',
                },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onGlobalCreateActivate' },
                value: {
                  parameters: [],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Function to be called when the globalCreateIcon is clicked on.',
                    raw:
                      '* Function to be called when the globalCreateIcon is clicked on. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onGlobalSearchActivate' },
                value: {
                  parameters: [],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Function to be called when the globalSearchIcon is clicked on.',
                    raw:
                      '* Function to be called when the globalSearchIcon is clicked on. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'scrollRef' },
                value: {
                  parameters: [],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Standard React ref for the scrollable element on the container navigation.',
                    raw:
                      '* Standard React ref for the scrollable element on the container navigation. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'showGlobalActions' },
                value: { kind: 'boolean' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Sets whether the globalyPrimaryActions should be displayed. These should be\ncomponents shared with the GlobalNavigation component, so they can be included\nin the ContainerNavigation when Navigation is collapsed.',
                    raw:
                      '* Sets whether the globalyPrimaryActions should be displayed. These should be\n  components shared with the GlobalNavigation component, so they can be included\n  in the ContainerNavigation when Navigation is collapsed. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
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
                      ' Theme object. Custom theme objects should be generated using the createGlobalTheme\nfunction.',
                    raw:
                      '* Theme object. Custom theme objects should be generated using the createGlobalTheme\n   function. ',
                  },
                ],
                default: {
                  kind: 'variable',
                  declarations: [
                    {
                      kind: 'initial',
                      id: {
                        kind: 'id',
                        name: 'container',
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
                  referenceIdName: 'container',
                },
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
                default: { kind: 'array', elements: [] },
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'ContainerNavigation', type: null },
        },
      }}
    />
  )}

  ${(
    <Props
      shouldCollapseProps
      heading="AkContainerNavigationNested Props"
      props={{
        kind: 'program',
        component: {
          kind: 'generic',
          value: {
            kind: 'object',
            members: [
              {
                kind: 'property',
                key: { kind: 'id', name: 'onAnimationEnd' },
                value: {
                  kind: 'generic',
                  value: {
                    parameters: [
                      {
                        kind: 'param',
                        value: {
                          kind: 'object',
                          members: [
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'traversalDirection' },
                              value: {
                                kind: 'generic',
                                value: {
                                  kind: 'union',
                                  types: [
                                    { kind: 'string', value: 'up' },
                                    { kind: 'string', value: 'down' },
                                  ],
                                  referenceIdName: 'TraversalDirection',
                                },
                              },
                              optional: false,
                            },
                          ],
                        },
                        type: null,
                      },
                    ],
                    returnType: { kind: 'void' },
                    kind: 'function',
                    referenceIdName: 'OnAnimationEnd',
                  },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Callback function which will be executed when the transition animation completes.',
                    raw:
                      '* Callback function which will be executed when the transition animation completes. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'stack' },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'generic',
                    value: { kind: 'id', name: 'Array' },
                    typeParams: {
                      kind: 'typeParams',
                      params: [{ kind: 'any' }],
                    },
                    referenceIdName: 'Stack',
                  },
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'An array of arrays representing the current state of the nested navigation.\nThe last item is rendered and the other items represent its ancestors in the menu tree.',
                    raw:
                      '*\n   * An array of arrays representing the current state of the nested navigation.\n   * The last item is rendered and the other items represent its ancestors in the menu tree.\n   ',
                  },
                ],
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'ContainerNavigationNested', type: null },
        },
      }}
    />
  )}
`;
