import React from 'react';
import { md, Example, code, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage
    appearance="warning"
    title="Note: @atlaskit/analytics is deprecated."
  >
    Please use the @atlaskit/analytics-next package instead.
  </SectionMessage>
)}

  The analytics package exports several components and functions that work together
  to enable other components to fire analytics, extend event data, and process events.

## Usage

${code`
import {
  AnalyticsDecorator,
  AnalyticsListener,
  cleanProps,
  withAnalytics
} from '@atlaskit/analytics';
`}

  Using this library components can fire public and private events:

  * Public events should be used by component consumers to track how customers are
    using their application.
  * Private events should be used by component authors to monitor how customers are
    using their components.

  Components that want to fire private events and support public events for consumers
  will need to be wrapped using the \`withAnalytics\` higher-order component.
  This will provide the wrapped component with several props that should be filtered
  out using the \`cleanProps\` function before passing to any children.

  As a general guideline component authors should follow the 'Integrating Components'
  example to add both public and private events. For these components consumers should
  only need to set the \`analyticsId\` for public events to fire. If a consumer finds
  a component that does not have analytics they can call \`fireAnalyticsEvent\` in
  their component or look at the 'Wrapping Components' example.

  If your component needs to always fire public events then you can set a default
  \`analyticsId\`, see the 'Setting Default Analytics Props' example. Please be aware
  that consumers can still override this default.

  \`AnalyticsDecorator\` can be used to extend the event data of child components. It
  can be configured to only intercept certain events based on event name and/or type
  (public or private). Decorators can also be nested within one another enabling
  different combinations of filtering and extending. With this events will continue
  to bubble up to the next decorator in the hierarchy.

  \`AnalyticsListener\` is used to capture child events for processing (e.g. sending to a
  web service). Similarly to \`AnalyticsDecorator\` it has options for filtering (event
  name and type) and can be nested within other listeners.

  If you are using a state manager like Redux and need to fire events in the stores with the
  decorated analyticsData then you can use \`getParentAnalyticsData(analyticsId)\`. This
  function will traverse the hierarchy for \`AnalyticsDecorators\` and build the extended
  analyticsData that would have been generated based on all the filtering logic. This
  parentAnalyticsData can then be passed to the stores as a property on the action.

  Open up the browser console to see the analytic events in the examples.

  ${(
    <Example
      packageName="@atlaskit/analytics"
      Component={require('../examples/01-basic-example').default}
      title="Basic"
      source={require('!!raw-loader!../examples/01-basic-example')}
    />
  )}

  ${(
    <Props
      heading="AnalyticsDecorator Props"
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
                    value: 'A single element, either Component or DOM node',
                    raw: '* A single element, either Component or DOM node ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'data' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'Object' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Key/values used to extend event data.',
                    raw: '* Key/values used to extend event data. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'getData' },
                value: {
                  parameters: [
                    { kind: 'param', value: { kind: 'string' }, type: null },
                    {
                      kind: 'param',
                      value: {
                        kind: 'generic',
                        value: { kind: 'id', name: 'Object' },
                      },
                      type: null,
                    },
                  ],
                  returnType: {
                    kind: 'generic',
                    value: { kind: 'id', name: 'Object' },
                  },
                  kind: 'function',
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Function called to get the key/values used to extend event data.\nOccurs after event data has been extended with `data`.',
                    raw:
                      '* Function called to get the key/values used to extend event data.\n   Occurs after event data has been extended with `data`. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'match' },
                value: {
                  kind: 'union',
                  types: [
                    { kind: 'string' },
                    {
                      parameters: [
                        {
                          kind: 'param',
                          value: { kind: 'string' },
                          type: null,
                        },
                      ],
                      returnType: { kind: 'boolean' },
                      kind: 'function',
                    },
                    { kind: 'generic', value: { kind: 'id', name: 'RegExp' } },
                  ],
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      "String, regex, or function filter to limit what events are extended\nbased on event name. String filters use exact matching unless they end\nwith a '.', in which case a partial match on the beginning of the event\nname will be used.",
                    raw:
                      "* String, regex, or function filter to limit what events are extended\n  based on event name. String filters use exact matching unless they end\n  with a '.', in which case a partial match on the beginning of the event\n  name will be used.\n  ",
                  },
                ],
                default: { kind: 'string', value: '*' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'matchPrivate' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Sets wether to extended private or public events.',
                    raw: '* Sets wether to extended private or public events. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
              },
            ],
            leadingComments: [
              {
                type: 'commentBlock',
                value:
                  'he Decorator component extends analytics event data for any events fired by\nits descendents, then passes the event up the hierarchy',
                raw:
                  ' The Decorator component extends analytics event data for any events fired by\nits descendents, then passes the event up the hierarchy ',
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'AnalyticsDecorator', type: null },
        },
      }}
    />
  )}

  ${(
    <Props
      heading="AnalyticsListener Props"
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
                    value: 'A single element, either Component or DOM node',
                    raw: '* A single element, either Component or DOM node ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'onEvent' },
                value: {
                  parameters: [
                    { kind: 'param', value: { kind: 'string' }, type: null },
                    {
                      kind: 'param',
                      value: {
                        kind: 'generic',
                        value: { kind: 'id', name: 'Object' },
                      },
                      type: null,
                    },
                  ],
                  returnType: { kind: 'any' },
                  kind: 'function',
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' Function called when an event has been triggered within this\nlistener.',
                    raw:
                      '* Function called when an event has been triggered within this\n   listener. ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'match' },
                value: {
                  kind: 'union',
                  types: [
                    { kind: 'string' },
                    {
                      parameters: [
                        {
                          kind: 'param',
                          value: { kind: 'string' },
                          type: null,
                        },
                      ],
                      returnType: { kind: 'boolean' },
                      kind: 'function',
                    },
                    { kind: 'generic', value: { kind: 'id', name: 'RegExp' } },
                  ],
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      "String, regex, or function filter to limit what events call\n`onEvent` based on event name. String filters use exact matching\nunless they end with a '.', in which case a partial match on the beginning\nof the event name will be used.",
                    raw:
                      "* String, regex, or function filter to limit what events call\n  `onEvent` based on event name. String filters use exact matching\n  unless they end with a '.', in which case a partial match on the beginning\n  of the event name will be used. ",
                  },
                ],
                default: { kind: 'string', value: '*' },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'matchPrivate' },
                value: { kind: 'boolean' },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Sets wether to call `onEvent` for private or public events.',
                    raw:
                      '* Sets wether to call `onEvent` for private or public events. ',
                  },
                ],
                default: { kind: 'boolean', value: false },
              },
            ],
            leadingComments: [
              {
                type: 'commentBlock',
                value:
                  'The Listener component is responsible for calling its `onEvent` handler when a\nchild component fires an analytics event, and passing the event up the hierarchy',
                raw:
                  '\nThe Listener component is responsible for calling its `onEvent` handler when a\nchild component fires an analytics event, and passing the event up the hierarchy\n',
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'AnalyticsListener', type: null },
        },
      }}
    />
  )}
`;
