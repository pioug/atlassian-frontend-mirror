import React from 'react';

import ReactDOM from 'react-dom';
import type { IntlShape } from 'react-intl-next';

import { expandClassNames } from '@atlaskit/editor-common/styles';
import { expandMessages } from '@atlaskit/editor-common/ui';
import type {
  DOMOutputSpec,
  Node as PmNode,
} from '@atlaskit/editor-prosemirror/model';

import { ExpandButton } from '../ui/ExpandButton';

// TODO: https://product-fabric.atlassian.net/browse/ED-22841
export const buildExpandClassName = (type: string) => {
  return `${expandClassNames.prefix} ${expandClassNames.type(type)}
  ${expandClassNames.expanded}`;
};

export const toDOM = (
  node: PmNode,
  __livePage: boolean,
  intl?: IntlShape,
): DOMOutputSpec => [
  'div',
  {
    // prettier-ignore
    'class': buildExpandClassName(
      node.type.name,
    ),
    'data-node-type': node.type.name,
    'data-title': node.attrs.title,
  },
  [
    'div',
    {
      // prettier-ignore
      'class': expandClassNames.titleContainer,
      contenteditable: 'false',
      // Element gains access to focus events.
      // This is needed to prevent PM gaining access
      // on interacting with our controls.
      tabindex: '-1',
    },
    // prettier-ignore
    ['div', { 'class': expandClassNames.icon }],
    [
      'div',
      {
        // prettier-ignore
        'class': expandClassNames.inputContainer,
      },
      [
        'input',
        {
          // prettier-ignore
          'class': expandClassNames.titleInput,
          value: node.attrs.title,
          placeholder:
            (intl &&
              intl.formatMessage(expandMessages.expandPlaceholderText)) ||
            expandMessages.expandPlaceholderText.defaultMessage,
          type: 'text',
        },
      ],
    ],
  ],
  // prettier-ignore
  ['div', { 'class': expandClassNames.content }, 0],
];

export const renderIcon = (
  icon: HTMLElement | null,
  allowInteractiveExpand: boolean,
  intl?: IntlShape,
  node?: PmNode,
) => {
  if (!icon) {
    return;
  }

  ReactDOM.render(
    <ExpandButton
      intl={intl}
      allowInteractiveExpand={allowInteractiveExpand}
      expanded={true} // TO-DO https://product-fabric.atlassian.net/browse/ED-22841
    />,
    icon,
  );
};
