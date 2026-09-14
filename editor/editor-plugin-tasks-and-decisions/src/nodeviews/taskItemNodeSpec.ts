import type { IntlShape } from 'react-intl';

import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import { TaskDecisionSharedCssClassName } from '@atlaskit/editor-common/styles';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { isContentEmpty } from './utils';

type HTMLInputElementAttrs = {
	'aria-label'?: string;
	checked?: 'true';
	id: string;
	name: string;
	type: 'checkbox';
};

const getCheckBoxId = (localId: string) => `task-checkbox-${localId}`;

// eslint-disable-next-line jsdoc/require-example
/**
 * Converts a task item node to a DOM output specification.
 * This is used for rendering the task item in the editor.
 *
 * @param {Node} node - The ProseMirror node representing the task item.
 * @param {string} placeholder - The placeholder text to display when the task item is empty.
 * @returns A DOMOutputSpec representing the task item.
 */
export function taskItemToDom(node: PMNode, placeholder: string, intl: IntlShape): DOMOutputSpec {
	const checked = node.attrs.state === 'DONE';
	const checkboxId = getCheckBoxId(node.attrs.localId);
	const inputAttrs: HTMLInputElementAttrs = {
		name: checkboxId,
		id: checkboxId,
		type: 'checkbox',
		'aria-label': intl.formatMessage(
			checked
				? tasksAndDecisionsMessages.markTaskAsNotCompleted
				: tasksAndDecisionsMessages.markTaskAsCompleted,
		),
	};
	if (checked) {
		inputAttrs.checked = 'true';
	}

	const dataAttrs = {
		'data-task-local-id': node.attrs.localId,
		'data-task-state': node.attrs.state,
		'data-prosemirror-node-name': 'taskItem',
		...(node.type.name === 'blockTaskItem' ? { 'data-task-is-block': 'true' } : {}),
	};

	let contentDomDataAttrs = node.content.childCount > 0 ? {} : { 'data-empty': 'true' };

	if (expValEquals('platform_editor_blocktaskitem_node_tenantid', 'isEnabled', true)) {
		contentDomDataAttrs = isContentEmpty(node) ? { 'data-empty': 'true' } : {};
	}

	const checkboxIcons = [
		'http://www.w3.org/2000/svg svg',
		{
			width: '20',
			height: '20',
			viewBox: '2 2 20 20',
			role: 'presentation',
			'data-component': 'checkbox-icon',
		},
		[
			'http://www.w3.org/2000/svg g',
			{
				'fill-rule': 'evenodd',
			},
			[
				'http://www.w3.org/2000/svg rect',
				{
					fill: 'currentcolor',
					x: '5.5',
					y: '5.5',
					width: '13',
					height: '13',
					rx: '1.5',
				},
			],
			[
				'http://www.w3.org/2000/svg path',
				{
					'fill-rule': 'evenodd',
					'clip-rule': 'evenodd',
					d: 'm16.326 9.48-1.152-.96-4.424 5.308-1.924-2.308-1.152.96 2.5 3a.75.75 0 0 0 1.152 0z',
					fill: 'inherit',
				},
			],
		],
	];

	return [
		'div',
		{
			class: `${TaskDecisionSharedCssClassName.TASK_CONTAINER}`,
			...dataAttrs,
			state: node.attrs.state,
		},
		[
			'div',
			{
				'data-component': 'task-item-main',
			},
			[
				'span',
				{
					contenteditable: 'false',
					class: `${TaskDecisionSharedCssClassName.TASK_CHECKBOX_CONTAINER}`,
					'data-component': 'task-item-input-wrap',
				},
				[
					'input',
					{
						...inputAttrs,
						'data-input-type': 'task-item',
						'data-task-input': true,
						'data-testid': 'task-item-checkbox',
						'data-component': 'task-item-input',
						role: 'checkbox',
					},
				],
				checkboxIcons,
			],
			[
				'span',
				{
					class: 'placeholder-node-view',
					'data-testid': 'task-decision-item-placeholder',
					'data-component': 'placeholder',
					contenteditable: 'false',
				},
				placeholder,
			],
			[
				'div',
				{
					'data-component': 'content',
				},
				[
					'div',
					{
						class: TaskDecisionSharedCssClassName.TASK_ITEM,
						...contentDomDataAttrs,
					},
					0,
				],
			],
		],
	];
}
