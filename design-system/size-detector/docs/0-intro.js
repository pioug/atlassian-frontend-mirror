import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage
    appearance="warning"
    title="Note: @atlaskit/size-detector is deprecated."
  >
    Please use @atlaskit/width-detector instead.
  </SectionMessage>
)}

  Size Detector is a utility component that informs the child function of the available width and height.

  ## Usage

  ${code`import SizeDetector from '@atlaskit/size-detector';`}

  ${(
    <Example
      packageName="@atlaskit/size-detector"
      Component={require('../examples/0-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-basic')}
    />
  )}

  ## SSR support

  When server side rendering, we cannot check the size of the container thus size-detector call children with 
  \`{ height: null, width: null }\`. Thus, enabling us to create DOM with proper checks and then hydrate on client with no errors.

  ${(
    <Props
      heading="SizeDetector Props"
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
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'generic',
                        value: {
                          kind: 'object',
                          members: [
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'width' },
                              value: {
                                kind: 'nullable',
                                arguments: { kind: 'number' },
                              },
                              optional: false,
                            },
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'height' },
                              value: {
                                kind: 'nullable',
                                arguments: { kind: 'number' },
                              },
                              optional: false,
                            },
                          ],
                          referenceIdName: 'SizeDetectorSizeMetricsType',
                        },
                      },
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
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      "Function that accepts an object parameter containing 'height' and 'width' properties",
                    raw:
                      "* Function that accepts an object parameter containing 'height' and 'width' properties ",
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'containerStyle' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Object' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Optional styles object to be applied to the containing element',
                    raw:
                      '* Optional styles object to be applied to the containing element ',
                  },
                ],
                default: { kind: 'object', members: [] },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onResize' },
                value: {
                  parameters: [
                    {
                      kind: 'param',
                      value: {
                        kind: 'generic',
                        value: {
                          kind: 'object',
                          members: [
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'width' },
                              value: {
                                kind: 'nullable',
                                arguments: { kind: 'number' },
                              },
                              optional: false,
                            },
                            {
                              kind: 'property',
                              key: { kind: 'id', name: 'height' },
                              value: {
                                kind: 'nullable',
                                arguments: { kind: 'number' },
                              },
                              optional: false,
                            },
                          ],
                          referenceIdName: 'SizeDetectorSizeMetricsType',
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
                    value: 'Called when the component is resized.',
                    raw: '* Called when the component is resized. ',
                  },
                ],
              },
            ],
            referenceIdName: 'SizeDetectorPropType',
          },
          name: { kind: 'id', name: 'SizeDetector', type: null },
        },
      }}
    />
  )}
`;
