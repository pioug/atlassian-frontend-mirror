import React from 'react';
import { code, md, Example, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ${(
    <SectionMessage
      appearance="warning"
      title="Note: @atlaskit/layer-manager is deprecated."
    >
      {md`
        As of component versions:

        - \`@atlaskit/modal-dialog@7.0.0\`
        - \`@atlaskit/tooltip@12.0.2\`
        - \`@atlaskit/flag@9.0.6\`
        - \`@atlaskit/onboarding@6.0.0\`

        No component requires global coordination to layer correctly.
        All of these components are built using \`@atlaskit/portal\` which has full support for React Context.
      `}
      <p>
        If you are after a scroll lock component we recommend{' '}
        <a href="https://github.com/jossmac/react-scrolllock">
          react-scrolllock
        </a>
        , if you need a focus lock component check out{' '}
        <a href="https://github.com/theKashey/react-focus-lock">
          react-focus-lock
        </a>
        .
      </p>
    </SectionMessage>
  )}

  ## Why?
  The layer manager is used to render React DOM into a new context (aka "Portal").
  This can be used to implement various UI components such as modals.

  The impetus for creating this package was the constant war with z-indexes.
  When you wrap your app in a \`<LayerManager />\` it will create slots for each
  package that is supported, and portal each instance to the correct slot when
  rendered inside your react app.

  ## Usage
  Super simple to use, just wrap your app with the default export -- we'll listen
  to the context it broadcasts, and inject your components where they belong.

${code`
import LayerManager from '@atlaskit/layer-manager';

export default class App extends Component {
  render() {
    return (
      <LayerManager>
        ...
      </LayerManager>
    );
  }
}
`}

  ${(
    <Example
      packageName="@atlaskit/layer-manager"
      Component={require('../examples/0-basic').default}
      source={require('!!raw-loader!../examples/0-basic')}
      title="Supported Components"
    />
  )}

  ## Focus Lock

  This component is used to trap focus inside an area of the screen. The main use
  case for this FocusLock component is to keep focus inside modal dialogs.

  ${(
    <Example
      packageName="@atlaskit/layer-manager"
      Component={require('../examples/2-focus-lock').default}
      source={require('!!raw-loader!../examples/2-focus-lock')}
      title="Focus Lock"
    />
  )}

  ${(
    <Props
      heading="Focus Lock Props"
      props={{
        kind: 'program',
        component: {
          kind: 'generic',
          value: {
            kind: 'object',
            members: [
              {
                kind: 'property',
                key: { kind: 'id', name: 'ariaHiddenNode' },
                value: {
                  kind: 'generic',
                  value: { kind: 'id', name: 'HTMLElement' },
                },
                optional: true,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'DOM Element to apply `aria-hidden=true` to when this component gains focus.\nThis is provided via context when used within @atlaskit/layer-manager.',
                    raw:
                      '*\n    DOM Element to apply `aria-hidden=true` to when this component gains focus.\n    This is provided via context when used within @atlaskit/layer-manager.\n  ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'autoFocus' },
                value: {
                  kind: 'union',
                  types: [
                    { kind: 'boolean' },
                    {
                      parameters: [],
                      returnType: {
                        kind: 'union',
                        types: [
                          {
                            kind: 'generic',
                            value: { kind: 'id', name: 'HTMLElement' },
                          },
                          { kind: 'null' },
                        ],
                      },
                      kind: 'function',
                    },
                  ],
                },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Boolean indicating whether to focus on the first tabbable element inside the focus lock.',
                    raw:
                      '*\n    Boolean indicating whether to focus on the first tabbable element inside the focus lock.\n  ',
                  },
                ],
                default: { kind: 'boolean', value: true },
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
                    value: 'Content inside the focus lock.',
                    raw: '*\n    Content inside the focus lock.\n  ',
                  },
                ],
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'enabled' },
                value: { kind: 'boolean' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'Whether the focus lock is active or not.',
                    raw: '*\n    Whether the focus lock is active or not.\n  ',
                  },
                ],
                default: { kind: 'boolean', value: true },
              },
              {
                kind: 'property',
                key: { kind: 'id', name: 'returnFocus' },
                value: { kind: 'boolean' },
                optional: false,
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'Whether to return the focus to the previous active element.',
                    raw:
                      '*\n    Whether to return the focus to the previous active element.\n  ',
                  },
                ],
                default: { kind: 'boolean', value: true },
              },
            ],
            trailingComments: [
              {
                type: 'commentBlock',
                value: 'eslint-disable react/sort-comp',
                raw: ' eslint-disable react/sort-comp ',
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'FocusLock', type: null },
        },
      }}
    />
  )}

  ### Auto focusing an element

  There are a couple of options to focus an element that is not focused by default.
  The first is to use the autoFocus attribute on React dom elements. In the example below,
  'button one' is the default but 'button two' will have focus.

${code`
const App = () => (
  <FocusLock>
    <button>button one</button>
    <button autoFocus>button two</button>
  </FocusLock>
)
`}

  The other option is to attach a ref to the dom element and imperatively call \`focus()\`.
  This technique is described in [this section](https://reactjs.org/docs/refs-and-the-dom.html#adding-a-ref-to-a-dom-element)
  of the React documentation.

  ## Scroll Lock

  Component used to lock scroll positioning.

  ${(
    <React.Fragment>
      <SectionMessage appearance="warning">
        <p>
          <strong>ScrollLock is deprecated.</strong>
        </p>
        <p>
          Please use{' '}
          <a href="https://github.com/jossmac/react-scrolllock">
            react-scrolllock
          </a>{' '}
          instead.
        </p>
      </SectionMessage>
      <Example
        packageName="@atlaskit/layer-manager"
        Component={require('../examples/1-scroll-lock').default}
        source={require('!!raw-loader!../examples/1-scroll-lock')}
        title="Scroll Lock - DEPRECATED"
      />
    </React.Fragment>
  )}

  ## Other Helpers

  There are a few patterns that are common among the supported packages, and have
  been abstracted into discrete components. While primarily for use internally,
  they're available as named exports from \`@atlaskit/layer-manager\`.

  ${(
    <Example
      packageName="@atlaskit/layer-manager"
      Component={require('../examples/3-with-context').default}
      source={require('!!raw-loader!../examples/3-with-context')}
      title="With Context from Props"
    />
  )}

  ${(
    <Props
      heading="LayerManager Props"
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
              },
            ],
            referenceIdName: 'Props',
          },
          name: { kind: 'id', name: 'LayerManager', type: null },
        },
      }}
    />
  )}
`;
