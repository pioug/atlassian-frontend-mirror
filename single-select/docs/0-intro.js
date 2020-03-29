import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ${(
    <SectionMessage
      appearance="warning"
      title="Note: @atlaskit/multi-select is deprecated."
    >
      Please use @atlaskit/select instead.
    </SectionMessage>
  )}

  React component which allows selection of a single item from a dropdown list. Substitute for the native select element.

  ${(
    <Example
      packageName="@atlaskit/single-select"
      Component={require('../examples/00-basic').default}
      source={require('!!raw-loader!../examples/00-basic')}
      title="Basic"
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/single-select"
      Component={require('../examples/01-stateless').default}
      source={require('!!raw-loader!../examples/01-stateless')}
      title="With Stateless Select"
    />
  )}

  ${(
    <Props
      heading="Stateful Props"
      props={{
        kind: 'program',
        component: {
          kind: 'generic',
          value: {
            kind: 'object',
            members: [
              {
                kind: 'property',
                key: { kind: 'id', name: 'appearance' },
                value: {
                  kind: 'union',
                  types: [
                    { kind: 'string', value: 'default' },
                    { kind: 'string', value: 'subtle' },
                  ],
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Subtle items do not have a background color.',
                    raw: '* Subtle items do not have a background color. ',
                  },
                ],
                default: {
                  kind: 'memberExpression',
                  object: {
                    kind: 'object',
                    members: [
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'values', type: null },
                        value: {
                          kind: 'array',
                          elements: [
                            { kind: 'string', value: 'default' },
                            { kind: 'string', value: 'subtle' },
                          ],
                        },
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'default', type: null },
                        value: { kind: 'string', value: 'default' },
                      },
                    ],
                    referenceIdName: 'appearances',
                  },
                  property: { kind: 'id', name: 'default', type: null },
                },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'defaultSelected' },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'object',
                    members: [
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'content' },
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
                              ' Can be either a string or JSX. If using JSX, the label property must be supplied to\nallow the component to filter properly.',
                            raw:
                              '* Can be either a string or JSX. If using JSX, the label property must be supplied to\n   * allow the component to filter properly. ',
                          },
                        ],
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'description' },
                        value: { kind: 'string' },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'label' },
                        value: { kind: 'string' },
                        optional: true,
                        leadingComments: [
                          {
                            type: 'commentBlock',
                            value: 'Label is only needed if content is JSX.',
                            raw: '* Label is only needed if content is JSX. ',
                          },
                        ],
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'tooltipDescription' },
                        value: { kind: 'string' },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'tooltipPosition' },
                        value: {
                          kind: 'union',
                          types: [
                            { kind: 'string', value: 'top' },
                            { kind: 'string', value: 'bottom' },
                            { kind: 'string', value: 'left' },
                          ],
                        },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'value' },
                        value: {
                          kind: 'union',
                          types: [{ kind: 'string' }, { kind: 'number' }],
                        },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'filterValues' },
                        value: {
                          kind: 'generic',
                          value: { kind: 'id', name: 'Array' },
                          typeParams: {
                            kind: 'typeParams',
                            params: [{ kind: 'string' }],
                          },
                        },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'isDisabled' },
                        value: { kind: 'boolean' },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'isSelected' },
                        value: { kind: 'boolean' },
                        optional: true,
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
                      },
                    ],
                    referenceIdName: 'ItemType',
                  },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Item to be selected on component mount.',
                    raw: '* Item to be selected on component mount. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'droplistShouldFitContainer' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Sets whether the dropdown should be constrained to the width of its trigger',
                    raw:
                      '* Sets whether the dropdown should be constrained to the width of its trigger ',
                  },
                ],
                default: { kind: 'boolean', value: true },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'hasAutocomplete' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Sets whether the field should be selectable. If it is, the field will be\na text box, which will filter the items.',
                    raw:
                      '* Sets whether the field should be selectable. If it is, the field will be\n   a text box, which will filter the items. ',
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
                      'id property to be passed down to the html select component.',
                    raw:
                      '* id property to be passed down to the html select component. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'invalidMessage' },
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
                      'message to show on the dialog when isInvalid is true',
                    raw:
                      '* message to show on the dialog when isInvalid is true ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isFirstChild' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'controls the top margin of the label component rendered.',
                    raw:
                      '* controls the top margin of the label component rendered. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isDisabled' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Sets whether the select is selectable. Changes hover state.',
                    raw:
                      '* Sets whether the select is selectable. Changes hover state. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isDefaultOpen' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Sets whether the component should be open on mount.',
                    raw:
                      '* Sets whether the component should be open on mount. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isRequired' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Sets whether form including select can be submitted without an option\nbeing made.',
                    raw:
                      '* Sets whether form including select can be submitted without an option\n   being made. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isInvalid' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Set whether there is an error with the selection. Sets an orange border\nand shows the warning icon.',
                    raw:
                      '* Set whether there is an error with the selection. Sets an orange border\n   and shows the warning icon. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'items' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Array' },
                  typeParams: {
                    kind: 'typeParams',
                    params: [
                      {
                        kind: 'generic',
                        value: {
                          kind: 'object',
                          members: [
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'heading' },
                              value: { kind: 'string' },
                              optional: true,
                            },
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'items' },
                              value: {
                                kind: 'generic',
                                value: { kind: 'id', name: 'Array' },
                                typeParams: {
                                  kind: 'typeParams',
                                  params: [
                                    {
                                      kind: 'generic',
                                      value: {
                                        kind: 'object',
                                        members: [
                                          {
                                            kind: 'property',
                                            key: {
                                              kind: 'id',
                                              name: 'content',
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
                                                value:
                                                  ' Can be either a string or JSX. If using JSX, the label property must be supplied to\nallow the component to filter properly.',
                                                raw:
                                                  '* Can be either a string or JSX. If using JSX, the label property must be supplied to\n   * allow the component to filter properly. ',
                                              },
                                            ],
                                          },
                                          {
                                            kind: 'property',
                                            key: {
                                              kind: 'id',
                                              name: 'description',
                                            },
                                            value: { kind: 'string' },
                                            optional: true,
                                          },
                                          {
                                            kind: 'property',
                                            key: { kind: 'id', name: 'label' },
                                            value: { kind: 'string' },
                                            optional: true,
                                            leadingComments: [
                                              {
                                                type: 'commentBlock',
                                                value:
                                                  'Label is only needed if content is JSX.',
                                                raw:
                                                  '* Label is only needed if content is JSX. ',
                                              },
                                            ],
                                          },
                                          {
                                            kind: 'property',
                                            key: {
                                              kind: 'id',
                                              name: 'tooltipDescription',
                                            },
                                            value: { kind: 'string' },
                                            optional: true,
                                          },
                                          {
                                            kind: 'property',
                                            key: {
                                              kind: 'id',
                                              name: 'tooltipPosition',
                                            },
                                            value: {
                                              kind: 'union',
                                              types: [
                                                {
                                                  kind: 'string',
                                                  value: 'top',
                                                },
                                                {
                                                  kind: 'string',
                                                  value: 'bottom',
                                                },
                                                {
                                                  kind: 'string',
                                                  value: 'left',
                                                },
                                              ],
                                            },
                                            optional: true,
                                          },
                                          {
                                            kind: 'property',
                                            key: { kind: 'id', name: 'value' },
                                            value: {
                                              kind: 'union',
                                              types: [
                                                { kind: 'string' },
                                                { kind: 'number' },
                                              ],
                                            },
                                            optional: true,
                                          },
                                          {
                                            kind: 'property',
                                            key: {
                                              kind: 'id',
                                              name: 'filterValues',
                                            },
                                            value: {
                                              kind: 'generic',
                                              value: {
                                                kind: 'id',
                                                name: 'Array',
                                              },
                                              typeParams: {
                                                kind: 'typeParams',
                                                params: [{ kind: 'string' }],
                                              },
                                            },
                                            optional: true,
                                          },
                                          {
                                            kind: 'property',
                                            key: {
                                              kind: 'id',
                                              name: 'isDisabled',
                                            },
                                            value: { kind: 'boolean' },
                                            optional: true,
                                          },
                                          {
                                            kind: 'property',
                                            key: {
                                              kind: 'id',
                                              name: 'isSelected',
                                            },
                                            value: { kind: 'boolean' },
                                            optional: true,
                                          },
                                          {
                                            kind: 'property',
                                            key: {
                                              kind: 'id',
                                              name: 'elemBefore',
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
                                          },
                                        ],
                                        referenceIdName: 'ItemType',
                                      },
                                    },
                                  ],
                                },
                              },
                              optional: false,
                            },
                          ],
                          referenceIdName: 'GroupType',
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
                      'An array of objects, each one of which must have an array of items, and\nmay have a heading. All items should have content and value properties, with\ncontent being the displayed text.',
                    raw:
                      '* An array of objects, each one of which must have an array of items, and\n  may have a heading. All items should have content and value properties, with\n  content being the displayed text. ',
                  },
                ],
                default: { kind: 'array', elements: [] },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'label' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Label to be displayed above select.',
                    raw: '* Label to be displayed above select. ',
                  },
                ],
                default: { kind: 'string', value: '' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'name' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'name property to be passed to the html select element.',
                    raw:
                      '* name property to be passed to the html select element. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'noMatchesFound' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Message to display in any group in items if there are no items in it,\nincluding if there is one item that has been selected.',
                    raw:
                      '* Message to display in any group in items if there are no items in it,\n   including if there is one item that has been selected. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onFilterChange' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Function' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Handler to be called when the filtered items changes.',
                    raw:
                      '* Handler to be called when the filtered items changes. ',
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
                key: { kind: 'id', name: 'onSelected' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Function' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Handler to be called when an item is selected. Called with an object that\nhas the item selected as a property on the object.',
                    raw:
                      '* Handler to be called when an item is selected. Called with an object that\n   has the item selected as a property on the object. ',
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
                key: { kind: 'id', name: 'onOpenChange' },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'object',
                        members: [
                          {
                            kind: 'property',
                            key: { kind: 'id', name: 'event' },
                            value: {
                              kind: 'generic',
                              value: { kind: 'id', name: 'SyntheticEvent' },
                              typeParams: {
                                kind: 'typeParams',
                                params: [{ kind: 'any' }],
                              },
                            },
                            optional: false,
                          },
                          {
                            kind: 'property',
                            key: { kind: 'id', name: 'isOpen' },
                            value: { kind: 'boolean' },
                            optional: false,
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
                      ' Handler called when the select is opened or closed. Called with an object\nthat has both the event, and the new isOpen state.',
                    raw:
                      '* Handler called when the select is opened or closed. Called with an object\n   that has both the event, and the new isOpen state. ',
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
                key: { kind: 'id', name: 'placeholder' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Text to be shown within the select when no item is selected.',
                    raw:
                      '* Text to be shown within the select when no item is selected. ',
                  },
                ],
                default: { kind: 'string', value: '' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'position' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Where the select dropdown should be displayed relative to the field position.',
                    raw:
                      '* Where the select dropdown should be displayed relative to the field position. ',
                  },
                ],
                default: { kind: 'string', value: 'bottom left' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'shouldFitContainer' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Sets whether the field should be constrained to the width of its trigger',
                    raw:
                      '* Sets whether the field should be constrained to the width of its trigger ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'shouldFocus' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Sets whether the field will become focused.',
                    raw: '* Sets whether the field will become focused. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'shouldFlip' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Sets whether the droplist should flip its position when there is not enough space.',
                    raw:
                      '* Sets whether the droplist should flip its position when there is not enough space. ',
                  },
                ],
                default: { kind: 'boolean', value: true },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'maxHeight' },
                value: { kind: 'number' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Set the max height of the dropdown list in pixels.',
                    raw:
                      '* Set the max height of the dropdown list in pixels. ',
                  },
                ],
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'AkSingleSelect', type: null },
        },
      }}
    />
  )}

  ${(
    <Props
      heading="Stateless Props"
      props={{
        kind: 'program',
        component: {
          kind: 'generic',
          value: {
            kind: 'object',
            members: [
              {
                kind: 'property',
                key: { kind: 'id', name: 'appearance' },
                value: {
                  kind: 'union',
                  types: [
                    { kind: 'string', value: 'default' },
                    { kind: 'string', value: 'subtle' },
                  ],
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Subtle items do not have a background color.',
                    raw: '* Subtle items do not have a background color. ',
                  },
                ],
                default: {
                  kind: 'memberExpression',
                  object: {
                    kind: 'object',
                    members: [
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'values', type: null },
                        value: {
                          kind: 'array',
                          elements: [
                            { kind: 'string', value: 'default' },
                            { kind: 'string', value: 'subtle' },
                          ],
                        },
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'default', type: null },
                        value: { kind: 'string', value: 'default' },
                      },
                    ],
                    referenceIdName: 'appearances',
                  },
                  property: { kind: 'id', name: 'default', type: null },
                },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'droplistShouldFitContainer' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Sets whether the dropdown should be constrained to the width of its trigger',
                    raw:
                      '* Sets whether the dropdown should be constrained to the width of its trigger ',
                  },
                ],
                default: { kind: 'boolean', value: true },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'filterValue' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      "Value to be used when filtering the items. Compared against 'content'.",
                    raw:
                      "* Value to be used when filtering the items. Compared against 'content'. ",
                  },
                ],
                default: { kind: 'string', value: '' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'hasAutocomplete' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Sets whether the field should be selectable. If it is, the field will be\na text box, which will filter the items.',
                    raw:
                      '* Sets whether the field should be selectable. If it is, the field will be\n   a text box, which will filter the items. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
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
                      'id property to be passed down to the html select component.',
                    raw:
                      '* id property to be passed down to the html select component. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'invalidMessage' },
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
                      'message to show on the dialog when isInvalid is true',
                    raw:
                      '* message to show on the dialog when isInvalid is true ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isDisabled' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Sets whether the select is selectable. Changes hover state.',
                    raw:
                      '* Sets whether the select is selectable. Changes hover state. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isFirstChild' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'controls the top margin of the label component rendered.',
                    raw:
                      '* controls the top margin of the label component rendered. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isOpen' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Sets whether the Select dropdown is open.',
                    raw: '* Sets whether the Select dropdown is open. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isRequired' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Sets whether form including select can be submitted without an option\nbeing made.',
                    raw:
                      '* Sets whether form including select can be submitted without an option\n   being made. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isInvalid' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Set whether there is an error with the selection. Sets an orange border\nand shows the warning icon.',
                    raw:
                      '* Set whether there is an error with the selection. Sets an orange border\n   and shows the warning icon. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isLoading' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Sets whether the field is loading data. The same property is used\nfor either initial fetch (when no options are available) as well for\nsubsequent loading of more options. The component reacts accordingly\nbased on the `items` provided.',
                    raw:
                      '* Sets whether the field is loading data. The same property is used\n   * for either initial fetch (when no options are available) as well for\n   * subsequent loading of more options. The component reacts accordingly\n   * based on the `items` provided.\n   ',
                  },
                ],
                default: { kind: 'boolean', value: false },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'items' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Array' },
                  typeParams: {
                    kind: 'typeParams',
                    params: [
                      {
                        kind: 'generic',
                        value: {
                          kind: 'object',
                          members: [
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'heading' },
                              value: { kind: 'string' },
                              optional: true,
                            },
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'items' },
                              value: {
                                kind: 'generic',
                                value: { kind: 'id', name: 'Array' },
                                typeParams: {
                                  kind: 'typeParams',
                                  params: [
                                    {
                                      kind: 'generic',
                                      value: {
                                        kind: 'object',
                                        members: [
                                          {
                                            kind: 'property',
                                            key: {
                                              kind: 'id',
                                              name: 'content',
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
                                                value:
                                                  ' Can be either a string or JSX. If using JSX, the label property must be supplied to\nallow the component to filter properly.',
                                                raw:
                                                  '* Can be either a string or JSX. If using JSX, the label property must be supplied to\n   * allow the component to filter properly. ',
                                              },
                                            ],
                                          },
                                          {
                                            kind: 'property',
                                            key: {
                                              kind: 'id',
                                              name: 'description',
                                            },
                                            value: { kind: 'string' },
                                            optional: true,
                                          },
                                          {
                                            kind: 'property',
                                            key: { kind: 'id', name: 'label' },
                                            value: { kind: 'string' },
                                            optional: true,
                                            leadingComments: [
                                              {
                                                type: 'commentBlock',
                                                value:
                                                  'Label is only needed if content is JSX.',
                                                raw:
                                                  '* Label is only needed if content is JSX. ',
                                              },
                                            ],
                                          },
                                          {
                                            kind: 'property',
                                            key: {
                                              kind: 'id',
                                              name: 'tooltipDescription',
                                            },
                                            value: { kind: 'string' },
                                            optional: true,
                                          },
                                          {
                                            kind: 'property',
                                            key: {
                                              kind: 'id',
                                              name: 'tooltipPosition',
                                            },
                                            value: {
                                              kind: 'union',
                                              types: [
                                                {
                                                  kind: 'string',
                                                  value: 'top',
                                                },
                                                {
                                                  kind: 'string',
                                                  value: 'bottom',
                                                },
                                                {
                                                  kind: 'string',
                                                  value: 'left',
                                                },
                                              ],
                                            },
                                            optional: true,
                                          },
                                          {
                                            kind: 'property',
                                            key: { kind: 'id', name: 'value' },
                                            value: {
                                              kind: 'union',
                                              types: [
                                                { kind: 'string' },
                                                { kind: 'number' },
                                              ],
                                            },
                                            optional: true,
                                          },
                                          {
                                            kind: 'property',
                                            key: {
                                              kind: 'id',
                                              name: 'filterValues',
                                            },
                                            value: {
                                              kind: 'generic',
                                              value: {
                                                kind: 'id',
                                                name: 'Array',
                                              },
                                              typeParams: {
                                                kind: 'typeParams',
                                                params: [{ kind: 'string' }],
                                              },
                                            },
                                            optional: true,
                                          },
                                          {
                                            kind: 'property',
                                            key: {
                                              kind: 'id',
                                              name: 'isDisabled',
                                            },
                                            value: { kind: 'boolean' },
                                            optional: true,
                                          },
                                          {
                                            kind: 'property',
                                            key: {
                                              kind: 'id',
                                              name: 'isSelected',
                                            },
                                            value: { kind: 'boolean' },
                                            optional: true,
                                          },
                                          {
                                            kind: 'property',
                                            key: {
                                              kind: 'id',
                                              name: 'elemBefore',
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
                                          },
                                        ],
                                        referenceIdName: 'ItemType',
                                      },
                                    },
                                  ],
                                },
                              },
                              optional: false,
                            },
                          ],
                          referenceIdName: 'GroupType',
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
                      'An array of objects, each one of which must have an array of items, and\nmay have a heading. All items should have content and value properties, with\ncontent being the displayed text, and can optionally have a list of filterValues.',
                    raw:
                      '* An array of objects, each one of which must have an array of items, and\n  may have a heading. All items should have content and value properties, with\n  content being the displayed text, and can optionally have a list of filterValues. ',
                  },
                ],
                default: { kind: 'array', elements: [] },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'label' },
                value: { kind: 'string' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Label to be displayed above select.',
                    raw: '* Label to be displayed above select. ',
                  },
                ],
                default: { kind: 'string', value: '' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'loadingMessage' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Message to be displayed when the component is set to its loading state.\nThe message might be displayed differently depending on whether or not\nthere are items already being rendered.',
                    raw:
                      '* Message to be displayed when the component is set to its loading state.\n  The message might be displayed differently depending on whether or not\n  there are items already being rendered. ',
                  },
                ],
                default: { kind: 'string', value: 'Receiving information' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'name' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'name property to be passed to the html select element.',
                    raw:
                      '* name property to be passed to the html select element. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'noMatchesFound' },
                value: { kind: 'string' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Message to display in any group in items if there are no items in it,\nincluding if there is one item that has been selected.',
                    raw:
                      '* Message to display in any group in items if there are no items in it,\n   including if there is one item that has been selected. ',
                  },
                ],
                default: { kind: 'string', value: 'No matches found' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onSelected' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Function' },
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Handler called when a selection is made, with the item chosen.',
                    raw:
                      '* Handler called when a selection is made, with the item chosen. ',
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
                key: { kind: 'id', name: 'onFilterChange' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Function' },
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Handler to be called when the filtered items changes.',
                    raw:
                      '* Handler to be called when the filtered items changes. ',
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
                key: { kind: 'id', name: 'onOpenChange' },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'object',
                        members: [
                          {
                            kind: 'property',
                            key: { kind: 'id', name: 'event' },
                            value: {
                              kind: 'generic',
                              value: { kind: 'id', name: 'SyntheticEvent' },
                              typeParams: {
                                kind: 'typeParams',
                                params: [{ kind: 'any' }],
                              },
                            },
                            optional: false,
                          },
                          {
                            kind: 'property',
                            key: { kind: 'id', name: 'isOpen' },
                            value: { kind: 'boolean' },
                            optional: false,
                          },
                        ],
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
                      ' Handler called when the select is opened or closed. Called with an object\nthat has both the event, and the new isOpen state.',
                    raw:
                      '* Handler called when the select is opened or closed. Called with an object\n   that has both the event, and the new isOpen state. ',
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
                key: { kind: 'id', name: 'placeholder' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Text to be shown within the select when no item is selected.',
                    raw:
                      '* Text to be shown within the select when no item is selected. ',
                  },
                ],
                default: { kind: 'string', value: '' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'position' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Where the select dropdown should be displayed relative to the field position.',
                    raw:
                      '* Where the select dropdown should be displayed relative to the field position. ',
                  },
                ],
                default: { kind: 'string', value: 'bottom left' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'shouldFocus' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Sets whether the field will become focused.',
                    raw: '* Sets whether the field will become focused. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'selectedItem' },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'object',
                    members: [
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'content' },
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
                              ' Can be either a string or JSX. If using JSX, the label property must be supplied to\nallow the component to filter properly.',
                            raw:
                              '* Can be either a string or JSX. If using JSX, the label property must be supplied to\n   * allow the component to filter properly. ',
                          },
                        ],
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'description' },
                        value: { kind: 'string' },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'label' },
                        value: { kind: 'string' },
                        optional: true,
                        leadingComments: [
                          {
                            type: 'commentBlock',
                            value: 'Label is only needed if content is JSX.',
                            raw: '* Label is only needed if content is JSX. ',
                          },
                        ],
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'tooltipDescription' },
                        value: { kind: 'string' },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'tooltipPosition' },
                        value: {
                          kind: 'union',
                          types: [
                            { kind: 'string', value: 'top' },
                            { kind: 'string', value: 'bottom' },
                            { kind: 'string', value: 'left' },
                          ],
                        },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'value' },
                        value: {
                          kind: 'union',
                          types: [{ kind: 'string' }, { kind: 'number' }],
                        },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'filterValues' },
                        value: {
                          kind: 'generic',
                          value: { kind: 'id', name: 'Array' },
                          typeParams: {
                            kind: 'typeParams',
                            params: [{ kind: 'string' }],
                          },
                        },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'isDisabled' },
                        value: { kind: 'boolean' },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'isSelected' },
                        value: { kind: 'boolean' },
                        optional: true,
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
                      },
                    ],
                    referenceIdName: 'ItemType',
                  },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'The selected item data',
                    raw: '* The selected item data ',
                  },
                ],
                default: { kind: 'object', members: [] },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'shouldFitContainer' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Sets whether the field should be constrained to the width of its trigger',
                    raw:
                      '* Sets whether the field should be constrained to the width of its trigger ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'shouldFlip' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Sets whether the droplist should flip its position when there is not enough space.',
                    raw:
                      '* Sets whether the droplist should flip its position when there is not enough space. ',
                  },
                ],
                default: { kind: 'boolean', value: true },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'maxHeight' },
                value: { kind: 'number' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Set the max height of the dropdown list in pixels.',
                    raw:
                      '* Set the max height of the dropdown list in pixels. ',
                  },
                ],
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'StatelessSelect', type: null },
        },
      }}
    />
  )}
`;
