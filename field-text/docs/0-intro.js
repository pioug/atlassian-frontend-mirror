import React from 'react';
import { md, Example, code, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ${(
    <SectionMessage
      appearance="warning"
      title="Note: @atlaskit/field-text is being deprecated in favor of @atlaskit/textfield."
    >
      This is part of our forms update which will modernize all our form fields.
    </SectionMessage>
  )}

  Text Field provides a form input.

  ## Usage

${code`
import FieldText, { FieldTextStateless } from '@atlaskit/field-text';
`}

  Text Field exports both a stateful default component, and a stateless component.
  The stateful component manages the value of the input for you and passes all
   other props on to the stateless version.

  ${(
    <Example
      packageName="@atlaskit/field-text"
      Component={require('../examples/00-basic-example').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-example')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/field-text"
      Component={require('../examples/01-stateless-example').default}
      title="Stateless Example"
      source={require('!!raw-loader!../examples/01-stateless-example')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/field-text"
      Component={require('../examples/02-form-example').default}
      title="Form Example"
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
                  name: 'autoComplete',
                },
                value: {
                  kind: 'string',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Standard HTML input autocomplete attribute.',
                    raw: '* Standard HTML input autocomplete attribute. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'form',
                },
                value: {
                  kind: 'string',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Standard HTML input form attribute. This is useful if the input cannot be included directly\ninside a form.',
                    raw:
                      '* Standard HTML input form attribute. This is useful if the input cannot be included directly\n   inside a form. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'pattern',
                },
                value: {
                  kind: 'string',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Standard HTML input pattern attribute, used for validating using a regular expression.',
                    raw:
                      '* Standard HTML input pattern attribute, used for validating using a regular expression. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'compact',
                },
                value: {
                  kind: 'boolean',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Set whether the fields should expand to fill available horizontal space.',
                    raw:
                      '* Set whether the fields should expand to fill available horizontal space. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'type',
                },
                value: {
                  kind: 'string',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Type value to be passed to the html input.',
                    raw: '* Type value to be passed to the html input. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'disabled',
                },
                value: {
                  kind: 'boolean',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Sets the field as uneditable, with a changed hover state.',
                    raw:
                      '* Sets the field as uneditable, with a changed hover state. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'isReadOnly',
                },
                value: {
                  kind: 'boolean',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'If true, prevents the value of the input from being edited.',
                    raw:
                      '* If true, prevents the value of the input from being edited. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'required',
                },
                value: {
                  kind: 'boolean',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Add asterisk to label. Set required for form that the field is part of.',
                    raw:
                      '* Add asterisk to label. Set required for form that the field is part of. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'isInvalid',
                },
                value: {
                  kind: 'boolean',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Sets styling to indicate that the input is invalid.',
                    raw:
                      '* Sets styling to indicate that the input is invalid. ',
                  },
                ],
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
                    value: 'Label to be displayed above the input.',
                    raw: '* Label to be displayed above the input. ',
                  },
                ],
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
                    value: 'Name value to be passed to the html input.',
                    raw: '* Name value to be passed to the html input. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'min',
                },
                value: {
                  kind: 'number',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Standard input min attribute, to be used with type="number"',
                    raw:
                      '* Standard input min attribute, to be used with type="number" ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'max',
                },
                value: {
                  kind: 'number',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Standard input max attribute, to be used with type="number"',
                    raw:
                      '* Standard input max attribute, to be used with type="number" ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'placeholder',
                },
                value: {
                  kind: 'string',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Text to display in the input if the input is empty.',
                    raw:
                      '* Text to display in the input if the input is empty. ',
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
                    {
                      kind: 'string',
                    },
                    {
                      kind: 'number',
                    },
                  ],
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'The value of the input.',
                    raw: '* The value of the input. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'onBlur',
                },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'generic',
                        value: {
                          kind: 'id',
                          name: 'SyntheticEvent',
                        },
                        typeParams: {
                          kind: 'typeParams',
                          params: [],
                        },
                      },
                      type: null,
                    },
                  ],
                  returnType: {
                    kind: 'mixed',
                  },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Handler to be called when the input loses focus.',
                    raw: '* Handler to be called when the input loses focus. ',
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
                        kind: 'generic',
                        value: {
                          kind: 'id',
                          name: 'SyntheticInputEvent',
                        },
                        typeParams: {
                          kind: 'typeParams',
                          params: [
                            {
                              kind: 'generic',
                              value: {
                                kind: 'id',
                                name: 'HTMLInputElement',
                              },
                            },
                          ],
                        },
                      },
                      type: null,
                    },
                  ],
                  returnType: {
                    kind: 'mixed',
                  },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Handler to be called when the input changes.',
                    raw: '* Handler to be called when the input changes. ',
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
                  name: 'onFocus',
                },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'generic',
                        value: {
                          kind: 'id',
                          name: 'SyntheticEvent',
                        },
                        typeParams: {
                          kind: 'typeParams',
                          params: [],
                        },
                      },
                      type: null,
                    },
                  ],
                  returnType: {
                    kind: 'mixed',
                  },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Handler to be called when the input receives focus.',
                    raw:
                      '* Handler to be called when the input receives focus. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'onKeyDown',
                },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'generic',
                        value: {
                          kind: 'id',
                          name: 'SyntheticKeyboardEvent',
                        },
                        typeParams: {
                          kind: 'typeParams',
                          params: [],
                        },
                      },
                      type: null,
                    },
                  ],
                  returnType: {
                    kind: 'mixed',
                  },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Standard input onkeydown event.',
                    raw: '* Standard input onkeydown event. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'onKeyPress',
                },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'generic',
                        value: {
                          kind: 'id',
                          name: 'SyntheticKeyboardEvent',
                        },
                        typeParams: {
                          kind: 'typeParams',
                          params: [],
                        },
                      },
                      type: null,
                    },
                  ],
                  returnType: {
                    kind: 'mixed',
                  },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Standard input onkeypress event.',
                    raw: '* Standard input onkeypress event. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'onKeyUp',
                },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'generic',
                        value: {
                          kind: 'id',
                          name: 'SyntheticKeyboardEvent',
                        },
                        typeParams: {
                          kind: 'typeParams',
                          params: [],
                        },
                      },
                      type: null,
                    },
                  ],
                  returnType: {
                    kind: 'mixed',
                  },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Standard input onkeyup event.',
                    raw: '* Standard input onkeyup event. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'id',
                },
                value: {
                  kind: 'string',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Id value to be passed to the html input.',
                    raw: '* Id value to be passed to the html input. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'isLabelHidden',
                },
                value: {
                  kind: 'boolean',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Sets whether to show or hide the label.',
                    raw: '* Sets whether to show or hide the label. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'isMonospaced',
                },
                value: {
                  kind: 'boolean',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Sets content text value to monospace',
                    raw: '* Sets content text value to monospace ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'invalidMessage',
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
                      ' Provided component is rendered inside a modal dialogue when the field is\nselected.',
                    raw:
                      '* Provided component is rendered inside a modal dialogue when the field is\n   selected. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'shouldFitContainer',
                },
                value: {
                  kind: 'boolean',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Ensure the input fits in to its containing element.',
                    raw:
                      '* Ensure the input fits in to its containing element. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'isSpellCheckEnabled',
                },
                value: {
                  kind: 'boolean',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Sets whether to apply spell checking to the content.',
                    raw:
                      '* Sets whether to apply spell checking to the content. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'autoFocus',
                },
                value: {
                  kind: 'boolean',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Sets whether the component should be automatically focused on component\nrender.',
                    raw:
                      '* Sets whether the component should be automatically focused on component\n   render. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'maxLength',
                },
                value: {
                  kind: 'number',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Set the maximum length that the entered text can be.',
                    raw:
                      '* Set the maximum length that the entered text can be. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'isValidationHidden',
                },
                value: {
                  kind: 'boolean',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Hide the validation message and style. This is used by <Field> to disable Validation display handling by FieldBase',
                    raw:
                      '* Hide the validation message and style. This is used by <Field> to disable Validation display handling by FieldBase\n   ',
                  },
                ],
              },
            ],
            referenceIdName: 'FieldTextProps',
          },
          name: {
            kind: 'id',
            name: 'FieldText',
            type: null,
          },
        },
      }}
      heading="FieldText Props"
    />
  )}

  ${(
    <Props
      props={{
        kind: 'program',
        component: {
          kind: 'generic',
          value: {
            kind: 'intersection',
            types: [
              {
                kind: 'generic',
                value: {
                  kind: 'object',
                  members: [
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'autoComplete',
                      },
                      value: {
                        kind: 'string',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value: 'Standard HTML input autocomplete attribute.',
                          raw: '* Standard HTML input autocomplete attribute. ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'form',
                      },
                      value: {
                        kind: 'string',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value:
                            ' Standard HTML input form attribute. This is useful if the input cannot be included directly\ninside a form.',
                          raw:
                            '* Standard HTML input form attribute. This is useful if the input cannot be included directly\n   inside a form. ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'pattern',
                      },
                      value: {
                        kind: 'string',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value:
                            'Standard HTML input pattern attribute, used for validating using a regular expression.',
                          raw:
                            '* Standard HTML input pattern attribute, used for validating using a regular expression. ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'compact',
                      },
                      value: {
                        kind: 'boolean',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value:
                            'Set whether the fields should expand to fill available horizontal space.',
                          raw:
                            '* Set whether the fields should expand to fill available horizontal space. ',
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
                        name: 'type',
                      },
                      value: {
                        kind: 'string',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value: 'Type value to be passed to the html input.',
                          raw: '* Type value to be passed to the html input. ',
                        },
                      ],
                      default: {
                        kind: 'string',
                        value: 'text',
                      },
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'disabled',
                      },
                      value: {
                        kind: 'boolean',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value:
                            'Sets the field as uneditable, with a changed hover state.',
                          raw:
                            '* Sets the field as uneditable, with a changed hover state. ',
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
                        name: 'isReadOnly',
                      },
                      value: {
                        kind: 'boolean',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value:
                            'If true, prevents the value of the input from being edited.',
                          raw:
                            '* If true, prevents the value of the input from being edited. ',
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
                        name: 'required',
                      },
                      value: {
                        kind: 'boolean',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value:
                            'Add asterisk to label. Set required for form that the field is part of.',
                          raw:
                            '* Add asterisk to label. Set required for form that the field is part of. ',
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
                        name: 'isInvalid',
                      },
                      value: {
                        kind: 'boolean',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value:
                            'Sets styling to indicate that the input is invalid.',
                          raw:
                            '* Sets styling to indicate that the input is invalid. ',
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
                          value: 'Label to be displayed above the input.',
                          raw: '* Label to be displayed above the input. ',
                        },
                      ],
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
                          value: 'Name value to be passed to the html input.',
                          raw: '* Name value to be passed to the html input. ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'min',
                      },
                      value: {
                        kind: 'number',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value:
                            'Standard input min attribute, to be used with type="number"',
                          raw:
                            '* Standard input min attribute, to be used with type="number" ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'max',
                      },
                      value: {
                        kind: 'number',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value:
                            'Standard input max attribute, to be used with type="number"',
                          raw:
                            '* Standard input max attribute, to be used with type="number" ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'placeholder',
                      },
                      value: {
                        kind: 'string',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value:
                            'Text to display in the input if the input is empty.',
                          raw:
                            '* Text to display in the input if the input is empty. ',
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
                          {
                            kind: 'string',
                          },
                          {
                            kind: 'number',
                          },
                        ],
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value: 'The value of the input.',
                          raw: '* The value of the input. ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'onBlur',
                      },
                      value: {
                        parameters: [
                          {
                            kind: 'param',
                            value: {
                              kind: 'generic',
                              value: {
                                kind: 'id',
                                name: 'SyntheticEvent',
                              },
                              typeParams: {
                                kind: 'typeParams',
                                params: [],
                              },
                            },
                            type: null,
                          },
                        ],
                        returnType: {
                          kind: 'mixed',
                        },
                        kind: 'function',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value:
                            'Handler to be called when the input loses focus.',
                          raw:
                            '* Handler to be called when the input loses focus. ',
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
                              kind: 'generic',
                              value: {
                                kind: 'id',
                                name: 'SyntheticInputEvent',
                              },
                              typeParams: {
                                kind: 'typeParams',
                                params: [
                                  {
                                    kind: 'generic',
                                    value: {
                                      kind: 'id',
                                      name: 'HTMLInputElement',
                                    },
                                  },
                                ],
                              },
                            },
                            type: null,
                          },
                        ],
                        returnType: {
                          kind: 'mixed',
                        },
                        kind: 'function',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value: 'Handler to be called when the input changes.',
                          raw:
                            '* Handler to be called when the input changes. ',
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
                        name: 'onFocus',
                      },
                      value: {
                        parameters: [
                          {
                            kind: 'param',
                            value: {
                              kind: 'generic',
                              value: {
                                kind: 'id',
                                name: 'SyntheticEvent',
                              },
                              typeParams: {
                                kind: 'typeParams',
                                params: [],
                              },
                            },
                            type: null,
                          },
                        ],
                        returnType: {
                          kind: 'mixed',
                        },
                        kind: 'function',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value:
                            'Handler to be called when the input receives focus.',
                          raw:
                            '* Handler to be called when the input receives focus. ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'onKeyDown',
                      },
                      value: {
                        parameters: [
                          {
                            kind: 'param',
                            value: {
                              kind: 'generic',
                              value: {
                                kind: 'id',
                                name: 'SyntheticKeyboardEvent',
                              },
                              typeParams: {
                                kind: 'typeParams',
                                params: [],
                              },
                            },
                            type: null,
                          },
                        ],
                        returnType: {
                          kind: 'mixed',
                        },
                        kind: 'function',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value: 'Standard input onkeydown event.',
                          raw: '* Standard input onkeydown event. ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'onKeyPress',
                      },
                      value: {
                        parameters: [
                          {
                            kind: 'param',
                            value: {
                              kind: 'generic',
                              value: {
                                kind: 'id',
                                name: 'SyntheticKeyboardEvent',
                              },
                              typeParams: {
                                kind: 'typeParams',
                                params: [],
                              },
                            },
                            type: null,
                          },
                        ],
                        returnType: {
                          kind: 'mixed',
                        },
                        kind: 'function',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value: 'Standard input onkeypress event.',
                          raw: '* Standard input onkeypress event. ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'onKeyUp',
                      },
                      value: {
                        parameters: [
                          {
                            kind: 'param',
                            value: {
                              kind: 'generic',
                              value: {
                                kind: 'id',
                                name: 'SyntheticKeyboardEvent',
                              },
                              typeParams: {
                                kind: 'typeParams',
                                params: [],
                              },
                            },
                            type: null,
                          },
                        ],
                        returnType: {
                          kind: 'mixed',
                        },
                        kind: 'function',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value: 'Standard input onkeyup event.',
                          raw: '* Standard input onkeyup event. ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'id',
                      },
                      value: {
                        kind: 'string',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value: 'Id value to be passed to the html input.',
                          raw: '* Id value to be passed to the html input. ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'isLabelHidden',
                      },
                      value: {
                        kind: 'boolean',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value: 'Sets whether to show or hide the label.',
                          raw: '* Sets whether to show or hide the label. ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'isMonospaced',
                      },
                      value: {
                        kind: 'boolean',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value: 'Sets content text value to monospace',
                          raw: '* Sets content text value to monospace ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'invalidMessage',
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
                            ' Provided component is rendered inside a modal dialogue when the field is\nselected.',
                          raw:
                            '* Provided component is rendered inside a modal dialogue when the field is\n   selected. ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'shouldFitContainer',
                      },
                      value: {
                        kind: 'boolean',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value:
                            'Ensure the input fits in to its containing element.',
                          raw:
                            '* Ensure the input fits in to its containing element. ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'isSpellCheckEnabled',
                      },
                      value: {
                        kind: 'boolean',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value:
                            'Sets whether to apply spell checking to the content.',
                          raw:
                            '* Sets whether to apply spell checking to the content. ',
                        },
                      ],
                      default: {
                        kind: 'boolean',
                        value: true,
                      },
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'autoFocus',
                      },
                      value: {
                        kind: 'boolean',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value:
                            ' Sets whether the component should be automatically focused on component\nrender.',
                          raw:
                            '* Sets whether the component should be automatically focused on component\n   render. ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'maxLength',
                      },
                      value: {
                        kind: 'number',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value:
                            'Set the maximum length that the entered text can be.',
                          raw:
                            '* Set the maximum length that the entered text can be. ',
                        },
                      ],
                    },
                    {
                      kind: 'property',
                      key: {
                        kind: 'id',
                        name: 'isValidationHidden',
                      },
                      value: {
                        kind: 'boolean',
                      },
                      optional: true,
                      leadingComments: [
                        {
                          type: 'commentBlock',
                          value:
                            'Hide the validation message and style. This is used by <Field> to disable Validation display handling by FieldBase',
                          raw:
                            '* Hide the validation message and style. This is used by <Field> to disable Validation display handling by FieldBase\n   ',
                        },
                      ],
                      default: {
                        kind: 'boolean',
                        value: false,
                      },
                    },
                  ],
                  referenceIdName: 'FieldTextProps',
                },
              },
              {
                kind: 'object',
                members: [
                  {
                    kind: 'property',
                    key: {
                      kind: 'id',
                      name: 'innerRef',
                    },
                    value: {
                      parameters: [
                        {
                          kind: 'param',
                          value: {
                            kind: 'nullable',
                            arguments: {
                              kind: 'generic',
                              value: {
                                kind: 'id',
                                name: 'HTMLInputElement',
                              },
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
                    default: {
                      kind: 'function',
                      id: null,
                      async: false,
                      generator: false,
                      parameters: [],
                      returnType: null,
                    },
                  },
                ],
              },
            ],
            referenceIdName: 'Props',
          },
          name: {
            kind: 'id',
            name: 'FieldTextStateless',
            type: null,
          },
        },
      }}
      heading="FieldTextStateless Props"
    />
  )}

`;
