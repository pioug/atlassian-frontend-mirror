import React from 'react';
import { md, Example, code, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ${(
    <SectionMessage
      appearance="warning"
      title="Note: @atlaskit/field-range is being deprecated in favor of @atlaskit/range."
    >
      This is part of our forms update which will modernize all our form fields.
    </SectionMessage>
  )}

  Component which renders a slider and is a substitute of the native input[range] element.

    ## Usage

  ${code`import FieldRange from '@atlaskit/field-range';`}

  The onChange prop provides a way to subscribe to changes in the value.

  ${(
    <Example
      packageName="@atlaskit/field-range"
      Component={require('../examples/00-basic-example').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-example')}
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
                  name: 'disabled',
                },
                value: {
                  kind: 'boolean',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'if the field range needs to be disabled',
                    raw: '* if the field range needs to be disabled ',
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
                  name: 'max',
                },
                value: {
                  kind: 'number',
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Maximum value of the range',
                    raw: '* Maximum value of the range ',
                  },
                ],
                default: {
                  kind: 'number',
                  value: 100,
                },
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
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Minimum value of the range',
                    raw: '* Minimum value of the range ',
                  },
                ],
                default: {
                  kind: 'number',
                  value: 0,
                },
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
                        kind: 'number',
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
                    value: 'Hook to be invoked on change of the range',
                    raw: '* Hook to be invoked on change of the range ',
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
                  name: 'step',
                },
                value: {
                  kind: 'number',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Step value for the range',
                    raw: '* Step value for the range ',
                  },
                ],
                default: {
                  kind: 'number',
                  value: 0.1,
                },
              },
              {
                kind: 'property',
                key: {
                  kind: 'id',
                  name: 'value',
                },
                value: {
                  kind: 'number',
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Value of the range',
                    raw: '* Value of the range ',
                  },
                ],
                default: {
                  kind: 'number',
                  value: 0,
                },
              },
            ],
            referenceIdName: 'Props',
          },
          name: {
            kind: 'id',
            name: 'Slider',
            type: null,
          },
        },
      }}
      heading="FieldRange Props"
    />
  )}

`;
