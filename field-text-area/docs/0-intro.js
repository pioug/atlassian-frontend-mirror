import React from 'react';
import { md, Example, code, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ${(
    <SectionMessage
      appearance="warning"
      title="Note: @atlaskit/field-text-area is being deprecated in favor of @atlaskit/textarea."
    >
      This is part of our forms update which will modernize all our form fields.
    </SectionMessage>
  )}

  Provides a standard way to create a text-based form input with an associated label.

  ## Usage

${code`
import FieldTextArea, { FieldTextAreaStateless } from '@atlaskit/field-text-area';
`}

  Text Field Area exports both a stateful default component, and a stateless
  component. The stateful component manages the value of the input for you
  and passes all other props on to the stateless version.

  ${(
    <Example
      packageName="@atlaskit/field-text-area"
      Component={require('../examples/00-basic-usage').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-usage')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/field-text-area"
      Component={require('../examples/01-stateless-example').default}
      title="Stateless Example"
      source={require('!!raw-loader!../examples/01-stateless-example')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/field-text-area"
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
                key: { kind: 'id', name: 'compact' },
                value: { kind: 'boolean' },
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
                key: { kind: 'id', name: 'disabled' },
                value: { kind: 'boolean' },
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
                key: { kind: 'id', name: 'isReadOnly' },
                value: { kind: 'boolean' },
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
                key: { kind: 'id', name: 'required' },
                value: { kind: 'boolean' },
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
                key: { kind: 'id', name: 'isInvalid' },
                value: { kind: 'boolean' },
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
                key: { kind: 'id', name: 'label' },
                value: { kind: 'string' },
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
                key: { kind: 'id', name: 'name' },
                value: { kind: 'string' },
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
                key: { kind: 'id', name: 'placeholder' },
                value: { kind: 'string' },
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
                key: { kind: 'id', name: 'value' },
                value: {
                  kind: 'union',
                  types: [{ kind: 'string' }, { kind: 'number' }],
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
                key: { kind: 'id', name: 'onChange' },
                value: { kind: 'any' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Handler to be called when the input changes.',
                    raw: '* Handler to be called when the input changes. ',
                  },
                  {
                    type: 'commentLine',
                    value: 'onChange?: (event: Event) => mixed,',
                    raw: ' onChange?: (event: Event) => mixed,',
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
                key: { kind: 'id', name: 'id' },
                value: { kind: 'string' },
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
                key: { kind: 'id', name: 'isLabelHidden' },
                value: { kind: 'boolean' },
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
                key: { kind: 'id', name: 'isMonospaced' },
                value: { kind: 'boolean' },
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
                      ' Provided component is rendered inside a modal dialogue when the field is\nselected.',
                    raw:
                      '* Provided component is rendered inside a modal dialogue when the field is\n   selected. ',
                  },
                ],
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
                      ' Ensure the input fits in to its containing element. If the field is still\nresizable, it will not be hotizontally resizable.',
                    raw:
                      '* Ensure the input fits in to its containing element. If the field is still\n   resizable, it will not be hotizontally resizable. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isSpellCheckEnabled' },
                value: { kind: 'boolean' },
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
                key: { kind: 'id', name: 'autoFocus' },
                value: { kind: 'boolean' },
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
                key: { kind: 'id', name: 'maxLength' },
                value: { kind: 'number' },
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
                key: { kind: 'id', name: 'minimumRows' },
                value: { kind: 'number' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'The minimum number of rows of text to display',
                    raw: '* The minimum number of rows of text to display ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'enableResize' },
                value: {
                  kind: 'union',
                  types: [
                    { kind: 'boolean' },
                    { kind: 'string', value: 'horizontal' },
                    { kind: 'string', value: 'vertical' },
                  ],
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Enables the resizing of the textarea (in both directions, or restricted to one axis)',
                    raw:
                      '* Enables the resizing of the textarea (in both directions, or restricted to one axis) ',
                  },
                ],
                default: { kind: 'boolean', value: false },
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'FieldTextArea', type: null },
        },
      }}
      heading="FieldTextArea Props"
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
                key: { kind: 'id', name: 'compact' },
                value: { kind: 'boolean' },
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
                default: { kind: 'boolean', value: false },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'disabled' },
                value: { kind: 'boolean' },
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
                default: { kind: 'boolean', value: false },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isReadOnly' },
                value: { kind: 'boolean' },
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
                default: { kind: 'boolean', value: false },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'required' },
                value: { kind: 'boolean' },
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
                      'Sets styling to indicate that the input is invalid.',
                    raw:
                      '* Sets styling to indicate that the input is invalid. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'label' },
                value: { kind: 'string' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Label to be displayed above the input.',
                    raw: '* Label to be displayed above the input. ',
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
                    value: 'Name value to be passed to the html input.',
                    raw: '* Name value to be passed to the html input. ',
                  },
                ],
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
                      'Text to display in the input if the input is empty.',
                    raw:
                      '* Text to display in the input if the input is empty. ',
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
                key: { kind: 'id', name: 'onBlur' },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'generic',
                        value: { kind: 'id', name: 'SyntheticInputEvent' },
                        typeParams: {
                          kind: 'typeParams',
                          params: [
                            {
                              kind: 'generic',
                              value: {
                                kind: 'id',
                                name: 'HTMLTextAreaElement',
                              },
                            },
                          ],
                        },
                      },
                      type: null,
                    },
                  ],
                  returnType: { kind: 'mixed' },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Handler to be called when the input is blurred',
                    raw: '* Handler to be called when the input is blurred ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onChange' },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'generic',
                        value: { kind: 'id', name: 'SyntheticInputEvent' },
                        typeParams: {
                          kind: 'typeParams',
                          params: [
                            {
                              kind: 'generic',
                              value: {
                                kind: 'id',
                                name: 'HTMLTextAreaElement',
                              },
                            },
                          ],
                        },
                      },
                      type: null,
                    },
                  ],
                  returnType: { kind: 'mixed' },
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
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onFocus' },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'generic',
                        value: { kind: 'id', name: 'SyntheticInputEvent' },
                        typeParams: {
                          kind: 'typeParams',
                          params: [
                            {
                              kind: 'generic',
                              value: {
                                kind: 'id',
                                name: 'HTMLTextAreaElement',
                              },
                            },
                          ],
                        },
                      },
                      type: null,
                    },
                  ],
                  returnType: { kind: 'mixed' },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Handler to be called when the input is focused',
                    raw: '* Handler to be called when the input is focused ',
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
                    value: 'Id value to be passed to the html input.',
                    raw: '* Id value to be passed to the html input. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isLabelHidden' },
                value: { kind: 'boolean' },
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
                key: { kind: 'id', name: 'isMonospaced' },
                value: { kind: 'boolean' },
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
                      ' Provided component is rendered inside a modal dialogue when the field is\nselected.',
                    raw:
                      '* Provided component is rendered inside a modal dialogue when the field is\n   selected. ',
                  },
                ],
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
                      ' Ensure the input fits in to its containing element. If the field is still\nresizable, it will not be hotizontally resizable.',
                    raw:
                      '* Ensure the input fits in to its containing element. If the field is still\n   resizable, it will not be hotizontally resizable. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isSpellCheckEnabled' },
                value: { kind: 'boolean' },
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
                default: { kind: 'boolean', value: true },
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
                      ' Sets whether the component should be automatically focused on component\nrender.',
                    raw:
                      '* Sets whether the component should be automatically focused on component\n   render. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'maxLength' },
                value: { kind: 'number' },
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
                key: { kind: 'id', name: 'minimumRows' },
                value: { kind: 'number' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'The minimum number of rows of text to display',
                    raw: '* The minimum number of rows of text to display ',
                  },
                ],
                default: { kind: 'number', value: 1 },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'enableResize' },
                value: {
                  kind: 'union',
                  types: [
                    { kind: 'boolean' },
                    { kind: 'string', value: 'horizontal' },
                    { kind: 'string', value: 'vertical' },
                  ],
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Enables the resizing of the textarea (in both directions, or restricted to one axis)',
                    raw:
                      '* Enables the resizing of the textarea (in both directions, or restricted to one axis) ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'type' },
                value: { kind: 'string' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Type of field',
                    raw: '* Type of field ',
                  },
                ],
                default: { kind: 'string', value: 'text' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isValidationHidden' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentLine',
                    value: 'eslint-disable-line react/no-unused-prop-types',
                    raw: 'eslint-disable-line react/no-unused-prop-types',
                  },
                  {
                    type: 'commentBlock',
                    value:
                      'Hide the validation message and style. This is used by <Field> to disable Validation display handling by FieldBase',
                    raw:
                      '* Hide the validation message and style. This is used by <Field> to disable Validation display handling by FieldBase\n   ',
                  },
                ],
                default: { kind: 'boolean', value: false },
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'FieldTextAreaStateless', type: null },
        },
      }}
      heading="FieldTextAreaStateless Props"
    />
  )}

`;
