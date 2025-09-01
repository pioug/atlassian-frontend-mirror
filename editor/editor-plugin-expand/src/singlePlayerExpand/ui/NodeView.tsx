import type { IntlShape } from 'react-intl-next';

import { expandedState } from '@atlaskit/editor-common/expand';
import { expandClassNames } from '@atlaskit/editor-common/styles';
import { expandMessages } from '@atlaskit/editor-common/ui';
import type { DOMOutputSpec, Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

export const buildExpandClassName = (type: string, expanded: boolean) => {
	return `${expandClassNames.prefix} ${expandClassNames.type(type)} ${
		expanded ? expandClassNames.expanded : ''
	}`;
};

export const toDOM = (
	node: PmNode,
	__livePage: boolean,
	intl?: IntlShape,
	titleReadOnly?: boolean,
	contentEditable?: boolean,
): DOMOutputSpec => [
	'div',
	{
		// prettier-ignore
		'class': buildExpandClassName(
      node.type.name,
      expandedState.get(node) ?? false,
    ),
		'data-node-type': node.type.name,
		'data-title': node.attrs.title,
		...(fg('platform_editor_adf_with_localid') && { 'data-local-id': node.attrs.localId }),
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
		['div', { 'class': expandClassNames.icon, style: `display: flex; width: ${token('space.300', '24px')}; height: ${token('space.300', '24px')}` }],
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
					'aria-label':
						(intl && intl.formatMessage(expandMessages.expandArialabel)) ||
						expandMessages.expandArialabel.defaultMessage,
					value: node.attrs.title,
					placeholder:
						(intl &&
							typeof intl.formatMessage === 'function' &&
							intl.formatMessage(expandMessages.expandPlaceholderText)) ||
						expandMessages.expandPlaceholderText.defaultMessage,
					type: 'text',
					readonly: titleReadOnly ? 'true' : undefined,
				},
			],
		],
	],
	[
		'div',
		{
			// prettier-ignore
			class: expandClassNames.content,
			contenteditable:
				contentEditable !== undefined ? (contentEditable ? 'true' : 'false') : undefined,
		},
		0,
	],
];
