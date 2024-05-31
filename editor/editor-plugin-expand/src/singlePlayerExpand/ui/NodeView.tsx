import React from 'react';

import ReactDOM from 'react-dom';
import type { IntlShape } from 'react-intl-next';

import { expandedState } from '@atlaskit/editor-common/expand';
import { expandClassNames } from '@atlaskit/editor-common/styles';
import { expandMessages } from '@atlaskit/editor-common/ui';
import type { DOMOutputSpec, Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { ExpandButton } from '../ui/ExpandButton';

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
							typeof intl.formatMessage === 'function' &&
							intl.formatMessage(expandMessages.expandPlaceholderText)) ||
						expandMessages.expandPlaceholderText.defaultMessage,
					type: 'text',
					readonly:
						getBooleanFF('platform.editor.live-view.disable-editing-in-view-mode_fi1rx') &&
						titleReadOnly
							? 'true'
							: undefined,
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
				getBooleanFF('platform.editor.live-view.disable-editing-in-view-mode_fi1rx') &&
				contentEditable
					? contentEditable
						? 'true'
						: 'false'
					: undefined,
		},
		0,
	],
];

export const renderIcon = (
	icon: HTMLElement | null,
	allowInteractiveExpand: boolean,
	expanded: boolean,
	intl?: IntlShape,
) => {
	if (!icon) {
		return;
	}

	ReactDOM.render(
		<ExpandButton
			intl={intl}
			allowInteractiveExpand={allowInteractiveExpand}
			expanded={expanded}
		/>,
		icon,
	);
};
