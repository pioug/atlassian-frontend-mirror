import React from 'react';
import { md, Example, code, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ${(
    <SectionMessage
      appearance="warning"
      title="Note: @atlaskit/field-radio-group is being deprecated in favor of @atlaskit/radio."
    >
      This is part of our forms update which will modernize all our form fields.
    </SectionMessage>
  )}

  Provides a standard way to select a single option from a list.

  ## Usage

${code`
import RadioGroup, { AkFieldRadioGroup, AkRadio } from '@atlaskit/field-radio-group';
`}

  RadioGroup exports a stateful component as the default export. This
  handles the selection of items for you. You can also import a stateless
  version as AkFieldRadioGroup.

  Both accept a list of items that pass the properties on to a
AkRadio component to render. Both stateful and stateless
  maintain the state of their children AkRadio components.

  ${(
    <Example
      packageName="@atlaskit/field-radio-group"
      Component={require('../examples/00-basic-usage').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-usage')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/field-radio-group"
      Component={require('../examples/01-stateless-example').default}
      title="Stateless Checkbox"
      source={require('!!raw-loader!../examples/01-stateless-example')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/field-radio-group"
      Component={require('../examples/02-form-example').default}
      title="With a Form"
      source={require('!!raw-loader!../examples/02-form-example')}
    />
  )}

  ${(
    <Props
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
                  name: 'isRequired',
                },
                value: {
                  kind: 'boolean',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Mark whether this field is required for form validation.',
                    raw:
                      '* Mark whether this field is required for form validation. ',
                  },
                ],
                default: {
                  kind: 'boolean',
                  value: false,
                },
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'label',
                },
                value: {
                  kind: 'string',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Label to display above the radio button options.',
                    raw: '* Label to display above the radio button options. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'onRadioChange',
                },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'any',
                      },
                      type: null,
                    },
                  ],
                  returnType: {
                    kind: 'mixed',
                  },
                  kind: 'function',
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Called when the value changes; passed the event',
                    raw: '* Called when the value changes; passed the event ',
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
                key: {
                  kind: 'id',
                  name: 'items',
                },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'generic',
                    value: {
                      kind: 'id',
                      name: 'Array',
                    },
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
                                  name: 'isDisabled',
                                },
                                value: {
                                  kind: 'boolean',
                                },
                                optional: true,
                              },
                              {
                                kind: 'property',
                                key: {
                                  kind: 'id',
                                  name: 'isSelected',
                                },
                                value: {
                                  kind: 'boolean',
                                },
                                optional: true,
                              },
                              {
                                kind: 'property',
                                key: {
                                  kind: 'id',
                                  name: 'label',
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
                              {
                                kind: 'property',
                                key: {
                                  kind: 'id',
                                  name: 'name',
                                },
                                value: {
                                  kind: 'string',
                                },
                                optional: true,
                              },
                              {
                                kind: 'property',
                                key: {
                                  kind: 'id',
                                  name: 'value',
                                },
                                value: {
                                  kind: 'string',
                                },
                                optional: true,
                              },
                              {
                                kind: 'property',
                                key: {
                                  kind: 'id',
                                  name: 'defaultSelected',
                                },
                                value: {
                                  kind: 'boolean',
                                },
                                optional: true,
                              },
                            ],
                            referenceIdName: 'ItemPropTypeSmart',
                          },
                        },
                      ],
                    },
                    referenceIdName: 'ItemsPropTypeSmart',
                  },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Items to be rendered by a single Radio component. Passes options down to\nan AkRadio component, with label passed as children.',
                    raw:
                      '* Items to be rendered by a single Radio component. Passes options down to\n   an AkRadio component, with label passed as children. ',
                  },
                ],
                default: {
                  kind: 'array',
                  elements: [],
                  referenceIdName: 'defaultItems',
                },
              },
            ],
            referenceIdName: 'RadioGroupPropTypes',
          },
          name: {
            kind: 'id',
            name: 'FieldRadioGroup',
            type: null,
          },
        },
      }}
      heading="RadioGroup Props"
    />
  )}

  ${(
    <Props
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
                  name: 'isRequired',
                },
                value: {
                  kind: 'boolean',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Mark whether this field is required for form validation.',
                    raw:
                      '* Mark whether this field is required for form validation. ',
                  },
                ],
                default: {
                  kind: 'boolean',
                  value: false,
                },
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'label',
                },
                value: {
                  kind: 'string',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Label to display above the radio button options.',
                    raw: '* Label to display above the radio button options. ',
                  },
                ],
                default: {
                  kind: 'string',
                  value: '',
                },
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'onRadioChange',
                },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'any',
                      },
                      type: null,
                    },
                  ],
                  returnType: {
                    kind: 'mixed',
                  },
                  kind: 'function',
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Called when the value changes; passed the event',
                    raw: '* Called when the value changes; passed the event ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'items',
                },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'generic',
                    value: {
                      kind: 'id',
                      name: 'Array',
                    },
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
                                  name: 'isDisabled',
                                },
                                value: {
                                  kind: 'boolean',
                                },
                                optional: true,
                              },
                              {
                                kind: 'property',
                                key: {
                                  kind: 'id',
                                  name: 'isSelected',
                                },
                                value: {
                                  kind: 'boolean',
                                },
                                optional: true,
                              },
                              {
                                kind: 'property',
                                key: {
                                  kind: 'id',
                                  name: 'label',
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
                              {
                                kind: 'property',
                                key: {
                                  kind: 'id',
                                  name: 'name',
                                },
                                value: {
                                  kind: 'string',
                                },
                                optional: true,
                              },
                              {
                                kind: 'property',
                                key: {
                                  kind: 'id',
                                  name: 'value',
                                },
                                value: {
                                  kind: 'string',
                                },
                                optional: true,
                              },
                            ],
                            referenceIdName: 'ItemPropType',
                          },
                        },
                      ],
                    },
                    referenceIdName: 'ItemsPropType',
                  },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Items to be rendered by a single Radio component. Passes options down to\nan AkRadio component, with label passed as children.',
                    raw:
                      '* Items to be rendered by a single Radio component. Passes options down to\n   an AkRadio component, with label passed as children. ',
                  },
                ],
                default: {
                  kind: 'array',
                  elements: [],
                },
              },
            ],
            referenceIdName: 'RadioGroupStatelessPropTypes',
          },
          name: {
            kind: 'id',
            name: 'FieldRadioGroupStateless',
            type: null,
          },
        },
      }}
      heading="AkFieldRadioGroup (Stateless) Props"
    />
  )}

  ${(
    <Props
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
                  name: 'children',
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
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'isDisabled',
                },
                value: {
                  kind: 'boolean',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Field disabled',
                    raw: '* Field disabled ',
                  },
                ],
                default: {
                  kind: 'boolean',
                  value: false,
                },
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'isRequired',
                },
                value: {
                  kind: 'boolean',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Marks this as a required field',
                    raw: '* Marks this as a required field ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'isSelected',
                },
                value: {
                  kind: 'boolean',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Set the field as selected',
                    raw: '* Set the field as selected ',
                  },
                ],
                default: {
                  kind: 'boolean',
                  value: false,
                },
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'name',
                },
                value: {
                  kind: 'string',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Field name',
                    raw: '* Field name ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'onChange',
                },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'any',
                      },
                      type: null,
                    },
                  ],
                  returnType: {
                    kind: 'mixed',
                  },
                  kind: 'function',
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'onChange event handler',
                    raw: '* onChange event handler ',
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
                  kind: 'string',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Field value',
                    raw: '* Field value ',
                  },
                ],
              },
            ],
            referenceIdName: 'RadioBasePropTypes',
          },
          name: {
            kind: 'id',
            name: 'Radio',
            type: null,
          },
        },
      }}
      heading="RadioBase Props"
    />
  )}

`;
