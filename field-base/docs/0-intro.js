import React from 'react';
import { code, md, Example, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage
    appearance="warning"
    title="Note: @atlaskit/field-base is deprecated."
  >
    Please use the Form/Textfield/Textarea/etc packages instead.
  </SectionMessage>
)}

This component contains all the common behaviour and styles for fields.

FieldBase provides an Atlassian Design Guidelines compatible implementation for:
* Labels: spacing, margins, accessibility.
* Fields: sizing, borders, colors, wrapping behaviour, hover/focus states.
* Validation: styles (built in validation coming soon!)

## Usage

${code`import FieldBase, {FieldBaseStateless,Label} from '@atlaskit/field-base';`}

FieldBase components *will* work by themselves, but are really meant to be extended into a full field component.

  ${(
    <Example
      packageName="@atlaskit/field-base"
      Component={require('../examples/00-basic-example').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-example')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/field-base"
      Component={require('../examples/01-stateless-example').default}
      title="With Stateless FieldBase"
      source={require('!!raw-loader!../examples/01-stateless-example')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/field-base"
      Component={require('../examples/02-label-example').default}
      title="With Label"
      source={require('!!raw-loader!../examples/02-label-example')}
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
                key: { kind: 'id', name: 'appearance' },
                value: {
                  kind: 'union',
                  types: [
                    { kind: 'string', value: 'standard' },
                    { kind: 'string', value: 'none' },
                    { kind: 'string', value: 'subtle' },
                  ],
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'controls the appearance of the field.\nsubtle shows styling on hover.\nnone hides all field styling.',
                    raw:
                      '*\n   * controls the appearance of the field.\n   * subtle shows styling on hover.\n   * none hides all field styling.\n   ',
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
                    value: 'children to render as dialog',
                    raw: '* children to render as dialog ',
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
                      'message to show on the dialog when isInvalid and isDialogOpen  are true',
                    raw:
                      '* message to show on the dialog when isInvalid and isDialogOpen  are true ',
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
                    value: 'applies compact styling, making the field smaller',
                    raw: '* applies compact styling, making the field smaller ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isDialogOpen' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'controls whether to show or hide the dialog',
                    raw: '* controls whether to show or hide the dialog ',
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
                    value: 'disable the field and apply disabled styling',
                    raw: '* disable the field and apply disabled styling ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isFitContainerWidthEnabled' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'whether the fit the field to the enclosing container',
                    raw:
                      '* whether the fit the field to the enclosing container ',
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
                      'set the field as invalid, triggering style and message',
                    raw:
                      '* set the field as invalid, triggering style and message ',
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
                    value: 'show a loading indicator',
                    raw: '* show a loading indicator ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isPaddingDisabled' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'disable padding styles',
                    raw: '* disable padding styles ',
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
                    value: 'apply read only styling',
                    raw: '* apply read only styling ',
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
                    value: 'mark the field as required',
                    raw: '* mark the field as required ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onBlur' },
                value: {
                  parameters: [
                    { kind: 'param', value: { kind: 'any' }, type: null },
                  ],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'handler for the onBlur event on the field element',
                    raw: '* handler for the onBlur event on the field element ',
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
                key: { kind: 'id', name: 'onDialogBlur' },
                value: {
                  parameters: [
                    { kind: 'param', value: { kind: 'any' }, type: null },
                  ],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'handler for the onBlur event on the dialog element',
                    raw:
                      '* handler for the onBlur event on the dialog element ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onDialogClick' },
                value: {
                  parameters: [
                    { kind: 'param', value: { kind: 'any' }, type: null },
                  ],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'handler for the click event on the dialog element',
                    raw: '* handler for the click event on the dialog element ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onDialogFocus' },
                value: {
                  parameters: [
                    { kind: 'param', value: { kind: 'any' }, type: null },
                  ],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'handler for the focus event on the dialog element',
                    raw: '* handler for the focus event on the dialog element ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onFocus' },
                value: {
                  parameters: [
                    { kind: 'param', value: { kind: 'any' }, type: null },
                  ],
                  returnType: { kind: 'void' },
                  kind: 'function',
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'handler for the focus event on the field element',
                    raw: '* handler for the focus event on the field element ',
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
                key: { kind: 'id', name: 'shouldReset' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'whether to call the onBlur handler inside componentDidUpdate',
                    raw:
                      '* whether to call the onBlur handler inside componentDidUpdate ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'maxWidth' },
                value: { kind: 'number' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'the maximum width of the field-base in pixels. Don\'t include the "px".',
                    raw:
                      '* the maximum width of the field-base in pixels. Don\'t include the "px". ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'isValidationHidden' },
                value: { kind: 'boolean' },
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
              {
                kind: 'property',
                key: { kind: 'id', name: 'defaultIsFocused' },
                value: { kind: 'boolean' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'focus the element when initially rendered',
                    raw: '* focus the element when initially rendered ',
                  },
                ],
                default: { kind: 'boolean', value: false },
              },
            ],
            referenceIdName: 'FieldBaseProps',
          },
          name: { kind: 'id', name: 'FieldBase', type: null },
        },
      }}
      heading="FieldBase Props"
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
                 key: { kind: 'id', name: 'appearance' },
                 value: {
                   kind: 'union',
                   types: [
                     { kind: 'string', value: 'standard' },
                     { kind: 'string', value: 'none' },
                     { kind: 'string', value: 'subtle' },
                   ],
                 },
                 optional: true,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value:
                       'controls the appearance of the field.\nsubtle shows styling on hover.\nnone hides all field styling.',
                     raw:
                       '*\n   * controls the appearance of the field.\n   * subtle shows styling on hover.\n   * none hides all field styling.\n   ',
                   },
                 ],
                 default: { kind: 'string', value: 'standard' },
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
                     value: 'children to render as dialog',
                     raw: '* children to render as dialog ',
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
                       'message to show on the dialog when isInvalid and isDialogOpen  are true',
                     raw:
                       '* message to show on the dialog when isInvalid and isDialogOpen  are true ',
                   },
                 ],
                 default: { kind: 'string', value: '' },
               },
               {
                 kind: 'property',
                 key: { kind: 'id', name: 'isCompact' },
                 value: { kind: 'boolean' },
                 optional: true,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value: 'applies compact styling, making the field smaller',
                     raw:
                       '* applies compact styling, making the field smaller ',
                   },
                 ],
                 default: { kind: 'boolean', value: false },
               },
               {
                 kind: 'property',
                 key: { kind: 'id', name: 'isDialogOpen' },
                 value: { kind: 'boolean' },
                 optional: true,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value: 'controls whether to show or hide the dialog',
                     raw: '* controls whether to show or hide the dialog ',
                   },
                 ],
                 default: { kind: 'boolean', value: false },
               },
               {
                 kind: 'property',
                 key: { kind: 'id', name: 'isDisabled' },
                 value: { kind: 'boolean' },
                 optional: true,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value: 'disable the field and apply disabled styling',
                     raw: '* disable the field and apply disabled styling ',
                   },
                 ],
                 default: { kind: 'boolean', value: false },
               },
               {
                 kind: 'property',
                 key: { kind: 'id', name: 'isFitContainerWidthEnabled' },
                 value: { kind: 'boolean' },
                 optional: true,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value:
                       'whether the fit the field to the enclosing container',
                     raw:
                       '* whether the fit the field to the enclosing container ',
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
                       'set the field as invalid, triggering style and message',
                     raw:
                       '* set the field as invalid, triggering style and message ',
                   },
                 ],
                 default: { kind: 'boolean', value: false },
               },
               {
                 kind: 'property',
                 key: { kind: 'id', name: 'isLoading' },
                 value: { kind: 'boolean' },
                 optional: true,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value: 'show a loading indicator',
                     raw: '* show a loading indicator ',
                   },
                 ],
                 default: { kind: 'boolean', value: false },
               },
               {
                 kind: 'property',
                 key: { kind: 'id', name: 'isPaddingDisabled' },
                 value: { kind: 'boolean' },
                 optional: true,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value: 'disable padding styles',
                     raw: '* disable padding styles ',
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
                     value: 'apply read only styling',
                     raw: '* apply read only styling ',
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
                     value: 'mark the field as required',
                     raw: '* mark the field as required ',
                   },
                 ],
               },
               {
                 kind: 'property',
                 key: { kind: 'id', name: 'onBlur' },
                 value: {
                   parameters: [
                     { kind: 'param', value: { kind: 'any' }, type: null },
                   ],
                   returnType: { kind: 'void' },
                   kind: 'function',
                 },
                 optional: false,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value: 'handler for the onBlur event on the field element',
                     raw:
                       '* handler for the onBlur event on the field element ',
                   },
                 ],
               },
               {
                 kind: 'property',
                 key: { kind: 'id', name: 'onDialogBlur' },
                 value: {
                   parameters: [
                     { kind: 'param', value: { kind: 'any' }, type: null },
                   ],
                   returnType: { kind: 'void' },
                   kind: 'function',
                 },
                 optional: true,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value:
                       'handler for the onBlur event on the dialog element',
                     raw:
                       '* handler for the onBlur event on the dialog element ',
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
                 key: { kind: 'id', name: 'onDialogClick' },
                 value: {
                   parameters: [
                     { kind: 'param', value: { kind: 'any' }, type: null },
                   ],
                   returnType: { kind: 'void' },
                   kind: 'function',
                 },
                 optional: true,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value: 'handler for the click event on the dialog element',
                     raw:
                       '* handler for the click event on the dialog element ',
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
                 key: { kind: 'id', name: 'onDialogFocus' },
                 value: {
                   parameters: [
                     { kind: 'param', value: { kind: 'any' }, type: null },
                   ],
                   returnType: { kind: 'void' },
                   kind: 'function',
                 },
                 optional: true,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value: 'handler for the focus event on the dialog element',
                     raw:
                       '* handler for the focus event on the dialog element ',
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
                 key: { kind: 'id', name: 'onFocus' },
                 value: {
                   parameters: [
                     { kind: 'param', value: { kind: 'any' }, type: null },
                   ],
                   returnType: { kind: 'void' },
                   kind: 'function',
                 },
                 optional: false,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value: 'handler for the focus event on the field element',
                     raw: '* handler for the focus event on the field element ',
                   },
                 ],
               },
               {
                 kind: 'property',
                 key: { kind: 'id', name: 'shouldReset' },
                 value: { kind: 'boolean' },
                 optional: true,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value:
                       'whether to call the onBlur handler inside componentDidUpdate',
                     raw:
                       '* whether to call the onBlur handler inside componentDidUpdate ',
                   },
                 ],
                 default: { kind: 'boolean', value: false },
               },
               {
                 kind: 'property',
                 key: { kind: 'id', name: 'maxWidth' },
                 value: { kind: 'number' },
                 optional: true,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value:
                       'the maximum width of the field-base in pixels. Don\'t include the "px".',
                     raw:
                       '* the maximum width of the field-base in pixels. Don\'t include the "px". ',
                   },
                 ],
               },
               {
                 kind: 'property',
                 key: { kind: 'id', name: 'isValidationHidden' },
                 value: { kind: 'boolean' },
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
                 default: { kind: 'boolean', value: false },
               },
               {
                 kind: 'property',
                 key: { kind: 'id', name: 'isFocused' },
                 value: { kind: 'boolean' },
                 optional: false,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value:
                       'apply styling based on whether the field is focused',
                     raw:
                       '* apply styling based on whether the field is focused ',
                   },
                 ],
                 default: { kind: 'boolean', value: false },
               },
             ],
             referenceIdName: 'FieldBaseStatelessProps',
           },
           name: { kind: 'id', name: 'FieldBaseStateless', type: null },
         },
       }}
       heading="FieldBaseStateless Props"
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
                 key: { kind: 'id', name: 'label' },
                 value: { kind: 'string' },
                 optional: false,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value: 'the label text to display',
                     raw: '* the label text to display ',
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
                     value: 'whether to hide the label',
                     raw: '* whether to hide the label ',
                   },
                 ],
               },
               {
                 kind: 'property',
                 key: { kind: 'id', name: 'onClick' },
                 value: {
                   parameters: [
                     { kind: 'param', value: { kind: 'any' }, type: null },
                   ],
                   returnType: { kind: 'mixed' },
                   kind: 'function',
                 },
                 optional: true,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value: 'onclick handler',
                     raw: '* onclick handler ',
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
                       'show a style indicating that the label is for a required field',
                     raw:
                       '* show a style indicating that the label is for a required field ',
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
                       'Sets whether the disabled style is applied to the label',
                     raw:
                       '* Sets whether the disabled style is applied to the label ',
                   },
                 ],
               },
               {
                 kind: 'property',
                 key: { kind: 'id', name: 'htmlFor' },
                 value: { kind: 'string' },
                 optional: true,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value: 'the labels control element',
                     raw: '* the labels control element ',
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
                       'any children to render, displayed underneath the label',
                     raw:
                       '* any children to render, displayed underneath the label ',
                   },
                 ],
               },
               {
                 kind: 'property',
                 key: { kind: 'id', name: 'appearance' },
                 value: {
                   kind: 'union',
                   types: [
                     { kind: 'string', value: 'default' },
                     { kind: 'string', value: 'inline-edit' },
                   ],
                 },
                 optional: true,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value: 'controls the appearance of the label',
                     raw: '* controls the appearance of the label ',
                   },
                 ],
                 default: { kind: 'string', value: 'default' },
               },
               {
                 kind: 'property',
                 key: { kind: 'id', name: 'isFirstChild' },
                 value: { kind: 'boolean' },
                 optional: true,
                 leadingComments: [
                   {
                     type: 'commentBlock',
                     value: 'controls the top margin of the label',
                     raw: '* controls the top margin of the label ',
                   },
                 ],
               },
             ],
             referenceIdName: 'Props',
           },
           name: { kind: 'id', name: 'Label', type: null },
         },
       }}
       heading="Label Props"
     />
   )}

`;
