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

  React component which allows selection of multiple items from a dropdown list. Substitute for the native multiple select element.

  ## Examples

  ${(
    <Example
      packageName="@atlaskit/multi-select"
      Component={require('../examples/00-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/multi-select"
      Component={require('../examples/01-groupless').default}
      title="Appearance"
      source={require('!!raw-loader!../examples/01-groupless')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/multi-select"
      Component={require('../examples/02-stateless').default}
      title="Custom"
      source={require('!!raw-loader!../examples/02-stateless')}
    />
  )}

  ${(
    <Props
      heading="Stateful MultiSelect Props"
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
                key: { kind: 'id', name: 'createNewItemLabel' },
                value: { kind: 'string' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Message to display in footer after the name of the new item. Only applicable if\nshouldAllowCreateItem prop is set to true.',
                    raw:
                      '* Message to display in footer after the name of the new item. Only applicable if\n   * shouldAllowCreateItem prop is set to true. ',
                  },
                ],
                default: { kind: 'string', value: 'New item' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'defaultSelected' },
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
                              leadingComments: [
                                {
                                  type: 'commentBlock',
                                  value:
                                    "Hold an array of strings to compare against multi-select's filterValue",
                                  raw:
                                    "* Hold an array of strings to compare against multi-select's filterValue ",
                                },
                              ],
                            },
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'content' },
                              value: { kind: 'string' },
                              optional: false,
                              leadingComments: [
                                {
                                  type: 'commentBlock',
                                  value:
                                    'The content to be displayed in the drop list and also in the tag when selected.',
                                  raw:
                                    '* The content to be displayed in the drop list and also in the tag when selected.  ',
                                },
                              ],
                            },
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'description' },
                              value: { kind: 'string' },
                              optional: true,
                              leadingComments: [
                                {
                                  type: 'commentBlock',
                                  value:
                                    'Text to be displayed below the item in the drop list.',
                                  raw:
                                    '* Text to be displayed below the item in the drop list. ',
                                },
                              ],
                            },
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'value' },
                              value: {
                                kind: 'union',
                                types: [{ kind: 'string' }, { kind: 'number' }],
                              },
                              optional: false,
                              leadingComments: [
                                {
                                  type: 'commentBlock',
                                  value:
                                    'The value to be used when multi-select is submitted in a form. Also used internally.',
                                  raw:
                                    '* The value to be used when multi-select is submitted in a form. Also used internally. ',
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
                                  type: 'commentLine',
                                  value:
                                    'eslint-disable-line react/no-unused-prop-types, max-len',
                                  raw:
                                    ' eslint-disable-line react/no-unused-prop-types, max-len',
                                },
                                {
                                  type: 'commentBlock',
                                  value: 'Set whether the item is selectable.',
                                  raw: '* Set whether the item is selectable. ',
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
                                    ' Set whether the item is selected. Selected items will be displayed as a\ntag instead of in the drop list.',
                                  raw:
                                    '* Set whether the item is selected. Selected items will be displayed as a\n   tag instead of in the drop list. ',
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
                                    'Element before item. Used to provide avatar when desired.',
                                  raw:
                                    '* Element before item. Used to provide avatar when desired. ',
                                },
                              ],
                            },
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'tag' },
                              value: {
                                kind: 'generic',
                                value: {
                                  kind: 'object',
                                  members: [
                                    {
                                      kind: 'property',
                                      key: { kind: 'id', name: 'appearance' },
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'import',
                                          importKind: 'type',
                                          name: 'AppearanceType',
                                          moduleSpecifier: '@atlaskit/tag',
                                          referenceIdName: 'AppearanceType',
                                        },
                                      },
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
                                  referenceIdName: 'TagType',
                                },
                              },
                              optional: true,
                              leadingComments: [
                                {
                                  type: 'commentBlock',
                                  value:
                                    'Object which will pass on some properties to the @atlaskit/tag element when selected.',
                                  raw:
                                    '* Object which will pass on some properties to the @atlaskit/tag element when selected. ',
                                },
                              ],
                            },
                          ],
                          referenceIdName: 'ItemType',
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
                      'An array of items that will be selected on component mount.',
                    raw:
                      '* An array of items that will be selected on component mount. ',
                  },
                ],
                default: { kind: 'array', elements: [] },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'footer' },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'object',
                    members: [
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'content' },
                        value: { kind: 'string' },
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
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'onActivate' },
                        value: {
                          kind: 'generic',
                          value: { kind: 'id', name: 'Function' },
                        },
                        optional: true,
                      },
                      {
                        kind: 'property',
                        key: { kind: 'id', name: 'appearance' },
                        value: {
                          kind: 'union',
                          types: [
                            { kind: 'string', value: 'default' },
                            { kind: 'string', value: 'primary' },
                          ],
                        },
                        optional: true,
                      },
                    ],
                    referenceIdName: 'FooterType',
                  },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Element to show after the list of item. Accepts an object of a specific shape',
                    raw:
                      '* Element to show after the list of item. Accepts an object of a specific shape ',
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
                key: { kind: 'id', name: 'shouldFocus' },
                value: { kind: 'boolean' },
                optional: false,
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
                key: { kind: 'id', name: 'isDefaultOpen' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Set whether the component should be open on mount.',
                    raw:
                      '* Set whether the component should be open on mount. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isRequired' },
                value: { kind: 'boolean' },
                optional: false,
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
                  kind: 'union',
                  types: [
                    {
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
                                                    params: [
                                                      { kind: 'string' },
                                                    ],
                                                  },
                                                },
                                                optional: true,
                                                leadingComments: [
                                                  {
                                                    type: 'commentBlock',
                                                    value:
                                                      "Hold an array of strings to compare against multi-select's filterValue",
                                                    raw:
                                                      "* Hold an array of strings to compare against multi-select's filterValue ",
                                                  },
                                                ],
                                              },
                                              {
                                                kind: 'property',
                                                key: {
                                                  kind: 'id',
                                                  name: 'content',
                                                },
                                                value: { kind: 'string' },
                                                optional: false,
                                                leadingComments: [
                                                  {
                                                    type: 'commentBlock',
                                                    value:
                                                      'The content to be displayed in the drop list and also in the tag when selected.',
                                                    raw:
                                                      '* The content to be displayed in the drop list and also in the tag when selected.  ',
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
                                                leadingComments: [
                                                  {
                                                    type: 'commentBlock',
                                                    value:
                                                      'Text to be displayed below the item in the drop list.',
                                                    raw:
                                                      '* Text to be displayed below the item in the drop list. ',
                                                  },
                                                ],
                                              },
                                              {
                                                kind: 'property',
                                                key: {
                                                  kind: 'id',
                                                  name: 'value',
                                                },
                                                value: {
                                                  kind: 'union',
                                                  types: [
                                                    { kind: 'string' },
                                                    { kind: 'number' },
                                                  ],
                                                },
                                                optional: false,
                                                leadingComments: [
                                                  {
                                                    type: 'commentBlock',
                                                    value:
                                                      'The value to be used when multi-select is submitted in a form. Also used internally.',
                                                    raw:
                                                      '* The value to be used when multi-select is submitted in a form. Also used internally. ',
                                                  },
                                                ],
                                              },
                                              {
                                                kind: 'property',
                                                key: {
                                                  kind: 'id',
                                                  name: 'isDisabled',
                                                },
                                                value: { kind: 'boolean' },
                                                optional: true,
                                                leadingComments: [
                                                  {
                                                    type: 'commentLine',
                                                    value:
                                                      'eslint-disable-line react/no-unused-prop-types, max-len',
                                                    raw:
                                                      ' eslint-disable-line react/no-unused-prop-types, max-len',
                                                  },
                                                  {
                                                    type: 'commentBlock',
                                                    value:
                                                      'Set whether the item is selectable.',
                                                    raw:
                                                      '* Set whether the item is selectable. ',
                                                  },
                                                ],
                                              },
                                              {
                                                kind: 'property',
                                                key: {
                                                  kind: 'id',
                                                  name: 'isSelected',
                                                },
                                                value: { kind: 'boolean' },
                                                optional: true,
                                                leadingComments: [
                                                  {
                                                    type: 'commentBlock',
                                                    value:
                                                      ' Set whether the item is selected. Selected items will be displayed as a\ntag instead of in the drop list.',
                                                    raw:
                                                      '* Set whether the item is selected. Selected items will be displayed as a\n   tag instead of in the drop list. ',
                                                  },
                                                ],
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
                                                leadingComments: [
                                                  {
                                                    type: 'commentBlock',
                                                    value:
                                                      'Element before item. Used to provide avatar when desired.',
                                                    raw:
                                                      '* Element before item. Used to provide avatar when desired. ',
                                                  },
                                                ],
                                              },
                                              {
                                                kind: 'property',
                                                key: {
                                                  kind: 'id',
                                                  name: 'tag',
                                                },
                                                value: {
                                                  kind: 'generic',
                                                  value: {
                                                    kind: 'object',
                                                    members: [
                                                      {
                                                        kind: 'property',
                                                        key: {
                                                          kind: 'id',
                                                          name: 'appearance',
                                                        },
                                                        value: {
                                                          kind: 'generic',
                                                          value: {
                                                            kind: 'import',
                                                            importKind: 'type',
                                                            name:
                                                              'AppearanceType',
                                                            moduleSpecifier:
                                                              '@atlaskit/tag',
                                                            referenceIdName:
                                                              'AppearanceType',
                                                          },
                                                        },
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
                                                            moduleSpecifier:
                                                              'react',
                                                            referenceIdName:
                                                              'Node',
                                                          },
                                                        },
                                                        optional: true,
                                                      },
                                                    ],
                                                    referenceIdName: 'TagType',
                                                  },
                                                },
                                                optional: true,
                                                leadingComments: [
                                                  {
                                                    type: 'commentBlock',
                                                    value:
                                                      'Object which will pass on some properties to the @atlaskit/tag element when selected.',
                                                    raw:
                                                      '* Object which will pass on some properties to the @atlaskit/tag element when selected. ',
                                                  },
                                                ],
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
                    {
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
                                  leadingComments: [
                                    {
                                      type: 'commentBlock',
                                      value:
                                        "Hold an array of strings to compare against multi-select's filterValue",
                                      raw:
                                        "* Hold an array of strings to compare against multi-select's filterValue ",
                                    },
                                  ],
                                },
                                {
                                  kind: 'property',
                                  key: { kind: 'id', name: 'content' },
                                  value: { kind: 'string' },
                                  optional: false,
                                  leadingComments: [
                                    {
                                      type: 'commentBlock',
                                      value:
                                        'The content to be displayed in the drop list and also in the tag when selected.',
                                      raw:
                                        '* The content to be displayed in the drop list and also in the tag when selected.  ',
                                    },
                                  ],
                                },
                                {
                                  kind: 'property',
                                  key: { kind: 'id', name: 'description' },
                                  value: { kind: 'string' },
                                  optional: true,
                                  leadingComments: [
                                    {
                                      type: 'commentBlock',
                                      value:
                                        'Text to be displayed below the item in the drop list.',
                                      raw:
                                        '* Text to be displayed below the item in the drop list. ',
                                    },
                                  ],
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
                                  optional: false,
                                  leadingComments: [
                                    {
                                      type: 'commentBlock',
                                      value:
                                        'The value to be used when multi-select is submitted in a form. Also used internally.',
                                      raw:
                                        '* The value to be used when multi-select is submitted in a form. Also used internally. ',
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
                                      type: 'commentLine',
                                      value:
                                        'eslint-disable-line react/no-unused-prop-types, max-len',
                                      raw:
                                        ' eslint-disable-line react/no-unused-prop-types, max-len',
                                    },
                                    {
                                      type: 'commentBlock',
                                      value:
                                        'Set whether the item is selectable.',
                                      raw:
                                        '* Set whether the item is selectable. ',
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
                                        ' Set whether the item is selected. Selected items will be displayed as a\ntag instead of in the drop list.',
                                      raw:
                                        '* Set whether the item is selected. Selected items will be displayed as a\n   tag instead of in the drop list. ',
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
                                        'Element before item. Used to provide avatar when desired.',
                                      raw:
                                        '* Element before item. Used to provide avatar when desired. ',
                                    },
                                  ],
                                },
                                {
                                  kind: 'property',
                                  key: { kind: 'id', name: 'tag' },
                                  value: {
                                    kind: 'generic',
                                    value: {
                                      kind: 'object',
                                      members: [
                                        {
                                          kind: 'property',
                                          key: {
                                            kind: 'id',
                                            name: 'appearance',
                                          },
                                          value: {
                                            kind: 'generic',
                                            value: {
                                              kind: 'import',
                                              importKind: 'type',
                                              name: 'AppearanceType',
                                              moduleSpecifier: '@atlaskit/tag',
                                              referenceIdName: 'AppearanceType',
                                            },
                                          },
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
                                      referenceIdName: 'TagType',
                                    },
                                  },
                                  optional: true,
                                  leadingComments: [
                                    {
                                      type: 'commentBlock',
                                      value:
                                        'Object which will pass on some properties to the @atlaskit/tag element when selected.',
                                      raw:
                                        '* Object which will pass on some properties to the @atlaskit/tag element when selected. ',
                                    },
                                  ],
                                },
                              ],
                              referenceIdName: 'ItemType',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
                optional: false,
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
                      ' Mesage to display in any group in items if there are no items in it,\nincluding if there is one item that has been selected.',
                    raw:
                      '* Mesage to display in any group in items if there are no items in it,\n   including if there is one item that has been selected. ',
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
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Handler to be called when the filtered items changes.',
                    raw:
                      '* Handler to be called when the filtered items changes.',
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
                key: { kind: 'id', name: 'onNewItemCreated' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Function' },
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Handler to be called when a new item is created.\nOnly applicable when the shouldAllowCreateItem is set to true.',
                    raw:
                      '* Handler to be called when a new item is created.\n   * Only applicable when the shouldAllowCreateItem is set to true.',
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
                key: { kind: 'id', name: 'onSelectedChange' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Function' },
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Handler to be called on select change.',
                    raw: '* Handler to be called on select change. ',
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
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'position' },
                value: { kind: 'string' },
                optional: false,
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
                key: { kind: 'id', name: 'shouldFlip' },
                value: { kind: 'boolean' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Set whether the dropdown should flip its position when there is not enough\nroom in its default position.',
                    raw:
                      '* Set whether the dropdown should flip its position when there is not enough\n   room in its default position. ',
                  },
                ],
                default: { kind: 'boolean', value: true },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'shouldAllowCreateItem' },
                value: { kind: 'boolean' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Sets whether a new item could be created and added to the list by pressing Enter\ninside the autocomplete field',
                    raw:
                      '* Sets whether a new item could be created and added to the list by pressing Enter\n   * inside the autocomplete field ',
                  },
                ],
                default: { kind: 'boolean', value: false },
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
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Icon to display at the right end of the multi-select',
                    raw:
                      '*\n   * Icon to display at the right end of the multi-select\n   ',
                  },
                ],
                default: {
                  kind: 'JSXElement',
                  value: {
                    kind: 'JSXOpeningElement',
                    name: { kind: 'JSXIdentifier', value: 'ExpandIcon' },
                    attributes: [
                      {
                        kind: 'JSXAttribute',
                        name: { kind: 'JSXIdentifier', value: 'label' },
                        value: { kind: 'string', value: '' },
                      },
                    ],
                  },
                },
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'MultiSelect', type: null },
        },
      }}
    />
  )}
`;
