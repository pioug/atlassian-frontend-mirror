import { type IntlShape } from 'react-intl-next';

import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import { type DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';

// This value can be a fixed constant as it doesn't depend on runtime values or arguments.
const iconDOM = [
	'span',
	{
		contentEditable: false,
		'data-component': 'icon',
	},
	[
		'span',
		{
			role: 'img',
			'aria-label': 'Decision',
		},
		[
			'http://www.w3.org/2000/svg svg',
			{
				viewBox: `0 0 24 24`,
				role: 'presentation',
				width: '24',
				height: '24',
				'data-icon-source': 'legacy',
			},
			[
				'http://www.w3.org/2000/svg path',
				{
					fill: 'currentcolor',
					'fill-rule': 'evenodd',
					d: 'm9.414 8 3.293 3.293c.187.187.293.442.293.707v5a1 1 0 0 1-2 0v-4.586l-3-3V10.5a1 1 0 0 1-2 0V7a1 1 0 0 1 1-1h3.5a1 1 0 0 1 0 2zm8.293-1.707a1 1 0 0 1 0 1.414l-2.5 2.5a.997.997 0 0 1-1.414 0 1 1 0 0 1 0-1.414l2.5-2.5a1 1 0 0 1 1.414 0',
				},
			],
		],
		[
			'http://www.w3.org/2000/svg svg',
			{
				viewBox: `-4 -4 24 24`,
				fill: 'none',
				role: 'presentation',
				width: '24',
				height: '24',
				'data-icon-source': 'refreshed',
			},
			[
				'http://www.w3.org/2000/svg path',
				{
					fill: 'currentcolor',
					'fill-rule': 'evenodd',
					d: 'm13.97.97-4.5 4.5 1.06 1.06 4.5-4.5zM3.56 2.5H8V1H1.75a.75.75 0 0 0-.75.75V8h1.5V3.56l4.604 4.604a.5.5 0 0 1 .146.354V15h1.5V8.518a2 2 0 0 0-.586-1.414z',
				},
			],
		],
	],
] satisfies DOMOutputSpec;

export const decisionItemToDOM = (node: PMNode, intl: IntlShape) => {
	const contentDomDataAttrs = node.childCount > 0 ? {} : { 'data-empty': 'true' };

	return [
		'li',
		{
			'data-decision-local-id': node.attrs.localId || 'local-decision',
			'data-decision-state': node.attrs.state,
			'data-prosemirror-node-name': 'decisionItem',
			class: 'decisionItemView-content-wrap',
		},
		[
			'div',
			{
				'data-testid': 'elements-decision-item',
				'data-decision-wrapper': true,
			},
			iconDOM,
			// renderPlaceholder
			[
				'span',
				{
					'data-testid': 'task-decision-item-placeholder',
					'data-component': 'placeholder',
					contentEditable: false,
				},
				intl.formatMessage(tasksAndDecisionsMessages.decisionPlaceholder),
			],
			[
				'div',
				{
					'data-component': 'content',
				},
				[
					'div',
					{
						class: 'decision-item',
						...contentDomDataAttrs,
					},
					0,
				],
			],
		],
	] satisfies DOMOutputSpec;
};
