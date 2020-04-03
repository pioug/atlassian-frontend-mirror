import React from 'react';
import { code, md, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage
    appearance="warning"
    title="Note: @atlaskit/input is deprecated."
  >
    This is an internal component and should not be used directly.
  </SectionMessage>
)}

  # This package is for internal consumption only. Use at your own risk.

  The layer is responsible for the positioning of an element on a page. For example, you wrap a tooltip with a layer to make its position relative to a target. You can specify up to 12 different positions.

  If you use a layer with a component that could be opened or closed, you have to make sure you re-render the layer the first time you open the component, otherwise it will end up with a wrong position.

  ![Example of Layer](https://i.imgur.com/f2UkGw8.gif)
 
  ## Usage

  ### HTML

  This package exports the Layer React component.

  Import the component in your React app as follows:

  ${code`import Layer from '@atlaskit/layer';
 
  const myContent = <div>I'm going to be aligned to the right!</div>;

  ReactDOM.render(
    <Layer position="right middle" content={myContent}>
      <div>Some content</div>
    </Layer>,
    container,
  );
  `}

  Any content that is passed to Layer as children will always be rendered and any content passed through the \`content\` prop will be rendered aligned to the internal content.

${(
  <Props
    heading="Layer Props"
    props={{
      kind: 'program',
      component: {
        kind: 'generic',
        value: {
          kind: 'object',
          members: [
            {
              kind: 'property',
              key: { kind: 'id', name: 'autoFlip' },
              value: {
                kind: 'union',
                types: [
                  { kind: 'boolean' },
                  {
                    kind: 'generic',
                    value: {
                      kind: 'union',
                      types: [
                        { kind: 'string', value: 'top' },
                        { kind: 'string', value: 'right' },
                        { kind: 'string', value: 'bottom' },
                        { kind: 'string', value: 'left' },
                      ],
                      referenceIdName: 'FlipPositionType',
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
                            kind: 'union',
                            types: [
                              { kind: 'string', value: 'top' },
                              { kind: 'string', value: 'right' },
                              { kind: 'string', value: 'bottom' },
                              { kind: 'string', value: 'left' },
                            ],
                            referenceIdName: 'FlipPositionType',
                          },
                        },
                      ],
                    },
                  },
                ],
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'Sets whether the content auto flip when it reaches the border set it as true for default flip or set the custom flip positions',
                  raw:
                    '* Sets whether the content auto flip when it reaches the border set it as true for default flip or set the custom flip positions ',
                },
              ],
              default: { kind: 'boolean', value: true },
            },
            {
              kind: 'property',
              key: { kind: 'id', name: 'boundariesElement' },
              value: {
                kind: 'generic',
                value: {
                  kind: 'union',
                  types: [
                    { kind: 'string', value: 'viewport' },
                    { kind: 'string', value: 'window' },
                    { kind: 'string', value: 'scrollParent' },
                  ],
                  referenceIdName: 'BoundariesElementType',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    "Element to act as a boundary for the Layer. The Layer will not sit outside this element if it can help it. If, through it's normal positoning, it would end up outside the boundary the layer will flip positions if the autoPosition prop is set.",
                  raw:
                    "* Element to act as a boundary for the Layer. The Layer will not sit outside this element if it can help it. If, through it's normal positoning, it would end up outside the boundary the layer will flip positions if the autoPosition prop is set. ",
                },
              ],
              default: { kind: 'string', value: 'viewport' },
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
                  value: 'Target to which layer is attached',
                  raw: '* Target to which layer is attached ',
                },
              ],
              default: { kind: 'null' },
            },
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
                    'HTML content to display in the layer. Will be aligned to the target according to the position prop.',
                  raw:
                    '* HTML content to display in the layer. Will be aligned to the target according to the position prop. ',
                },
              ],
              default: { kind: 'null' },
            },
            {
              kind: 'property',
              key: { kind: 'id', name: 'offset' },
              value: { kind: 'string' },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'String representing the offsets from the target element in the format "[x-offset][y-offset]", measured in pixels.',
                  raw:
                    '* String representing the offsets from the target element in the format "[x-offset][y-offset]", measured in pixels. ',
                },
              ],
              default: { kind: 'string', value: '0, 0' },
            },
            {
              kind: 'property',
              key: { kind: 'id', name: 'onFlippedChange' },
              value: {
                kind: 'generic',
                value: { kind: 'id', name: 'Function' },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'Callback that is used to know when the flipped state of Layer changes. This occurs when placing a Layered element in the requested position would cause Layer to be rendered outside of the boundariesElement (usually viewport).',
                  raw:
                    '* Callback that is used to know when the flipped state of Layer changes. This occurs when placing a Layered element in the requested position would cause Layer to be rendered outside of the boundariesElement (usually viewport). ',
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
              key: { kind: 'id', name: 'position' },
              value: {
                kind: 'generic',
                value: {
                  kind: 'union',
                  types: [
                    { kind: 'string', value: 'top left' },
                    { kind: 'string', value: 'top center' },
                    { kind: 'string', value: 'top right' },
                    { kind: 'string', value: 'right top' },
                    { kind: 'string', value: 'right middle' },
                    { kind: 'string', value: 'right bottom' },
                    { kind: 'string', value: 'bottom left' },
                    { kind: 'string', value: 'bottom center' },
                    { kind: 'string', value: 'bottom right' },
                    { kind: 'string', value: 'left top' },
                    { kind: 'string', value: 'left middle' },
                    { kind: 'string', value: 'left bottom' },
                  ],
                  referenceIdName: 'PositionType',
                },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'Position of a layer relative to its target. The position attribute takes two positional arguments in the format position="edge edge-position", where edge specifies what edge to align the layer to, and edge-position specifies where on that edge the layer should appear.',
                  raw:
                    '* Position of a layer relative to its target. The position attribute takes two positional arguments in the format position="edge edge-position", where edge specifies what edge to align the layer to, and edge-position specifies where on that edge the layer should appear. ',
                },
              ],
              default: { kind: 'string', value: 'right middle' },
            },
            {
              kind: 'property',
              key: { kind: 'id', name: 'zIndex' },
              value: { kind: 'number' },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'z-index for the layer component',
                  raw: '* z-index for the layer component ',
                },
              ],
              default: { kind: 'number', value: 400 },
            },
            {
              kind: 'property',
              key: { kind: 'id', name: 'lockScroll' },
              value: { kind: 'boolean' },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value: 'Lock scrolling behind the layer',
                  raw: '* Lock scrolling behind the layer ',
                },
              ],
              default: { kind: 'boolean', value: false },
            },
            {
              kind: 'property',
              key: { kind: 'id', name: 'isAlwaysFixed' },
              value: { kind: 'boolean' },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    'Force the layer to always be positioned fixed to the viewport. Note that the layer will become detached from the target element when scrolling so scroll lock or close on scroll handling may be necessary.',
                  raw:
                    '* Force the layer to always be positioned fixed to the viewport. Note that the layer will become detached from the target element when scrolling so scroll lock or close on scroll handling may be necessary. ',
                },
              ],
              default: { kind: 'boolean', value: false },
            },
            {
              kind: 'property',
              key: { kind: 'id', name: 'onPositioned' },
              value: {
                kind: 'generic',
                value: { kind: 'id', name: 'Function' },
              },
              optional: true,
              leadingComments: [
                {
                  type: 'commentBlock',
                  value:
                    "Callback that is used to know when the Layer positions it's content. This will only be called once soon after mounting when the Layer's transformed/flipped position is first calculated.",
                  raw:
                    "* Callback that is used to know when the Layer positions it's content. This will only be called once soon after mounting when the Layer's transformed/flipped position is first calculated. ",
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
          ],
          referenceIdName: 'Props',
        },
        name: { kind: 'id', name: 'Layer', type: null },
      },
    }}
  />
)}

`;
