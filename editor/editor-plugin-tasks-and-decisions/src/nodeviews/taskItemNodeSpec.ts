import { type IntlShape } from 'react-intl-next';

import { taskItem, blockTaskItemStage0 as blockTaskItem } from '@atlaskit/adf-schema';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import { TaskDecisionSharedCssClassName } from '@atlaskit/editor-common/styles';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import { isContentEmpty } from './utils';

type HTMLInputElementAttrs = {
	'aria-label'?: string;
	checked?: 'true';
	id: string;
	name: string;
	type: 'checkbox';
};

/**
 * Wrapper for ADF taskItem node spec to augment toDOM implementation
 * with fallback UI for lazy node view rendering / window virtualization
 * @nodeSpecException:toDOM patch
 * @returns
 * @example
 */
export const taskItemNodeSpec = () => {
	if (editorExperiment('platform_editor_exp_lazy_node_views', false)) {
		return taskItem;
	}

	return {
		...taskItem,
		toDOM: (node: PMNode): DOMOutputSpec => lazyTaskItemToDom(node),
	};
};

/**
 * Wrapper for ADF blockTaskItem node spec to augment toDOM implementation
 * with fallback UI for lazy node view rendering / window virtualization
 * @nodeSpecException:toDOM patch
 * @returns
 * @example
 */
export const blockTaskItemNodeSpec = () => {
	if (editorExperiment('platform_editor_exp_lazy_node_views', false)) {
		return blockTaskItem;
	}

	return {
		...blockTaskItem,
		toDOM: (node: PMNode): DOMOutputSpec => lazyTaskItemToDom(node),
	};
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

	if (expValEquals('platform_editor_blocktaskitem_node', 'isEnabled', true)) {
		contentDomDataAttrs = isContentEmpty(node) ? { 'data-empty': 'true' } : {};
	}

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
				[
					'span',
					{
						'aria-hidden': true,
						'data-component': 'checkbox-icon-wrap',
					},
					[
						'http://www.w3.org/2000/svg svg',
						{
							viewBox: `0 0 16 16`,
							width: '16',
							height: '16',
							role: 'presentation',
							fill: 'none',
							'data-component': 'checkbox-unchecked-icon',
						},
						[
							'http://www.w3.org/2000/svg rect',
							{
								width: '12.5',
								height: '12.5',
								x: '1.75',
								y: '1.75',
								stroke: 'currentcolor',
								'stroke-width': '1.5',
								rx: '1.25',
							},
						],
					],
					[
						'http://www.w3.org/2000/svg svg',
						{
							viewBox: `0 0 16 16`,
							width: '16',
							height: '16',
							role: 'presentation',
							fill: 'none',
							'data-component': 'checkbox-checked-icon',
						},
						[
							'http://www.w3.org/2000/svg path',
							{
								fill: 'currentcolor',
								'fill-rule': 'evenodd',
								'clip-rule': 'evenodd',
								d: 'M3 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm9.326 4.48-1.152-.96L6.75 9.828 4.826 7.52l-1.152.96 2.5 3a.75.75 0 0 0 1.152 0z',
							},
						],
					],
				],
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

export const lazyTaskItemToDom = (node: PMNode): DOMOutputSpec => {
	const checked = node.attrs.state === 'DONE';
	const inputAttrs: HTMLInputElementAttrs = {
		name: node.attrs.localId,
		id: node.attrs.localId,
		type: 'checkbox',
	};
	if (checked) {
		inputAttrs.checked = 'true';
	}

	const dataAttrs = {
		'data-task-local-id': node.attrs.localId,
		'data-task-state': node.attrs.state,
		...(node.type.name === 'blockTaskItem' ? { 'data-task-is-block': 'true' } : {}),
	};

	return [
		'div',
		{
			class: TaskDecisionSharedCssClassName.TASK_CONTAINER,
			...dataAttrs,
			style: convertToInlineCss({
				listStyleType: 'none',
				lineHeight: '24px',
				minWidth: '48px',
				position: 'relative',
			}),
		},
		[
			'div',
			{
				style: convertToInlineCss({
					display: 'flex',
				}),
			},
			[
				'span',
				{
					contenteditable: 'false',
					style: convertToInlineCss({
						width: '24px',
						height: '24px',
						lineHeight: '24px',
						display: 'grid',
						placeContent: 'center center',
					}),
				},
				[
					'input',
					{
						...inputAttrs,
						'data-input-type': 'lazy-task-item',
						style: convertToInlineCss({
							width: '13px',
							height: '13px',
							margin: '1px 0 0 0',
							padding: 0,
							accentColor: token('color.background.selected.bold'),
						}),
					},
				],
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
						style: convertToInlineCss({
							display: 'block',
							fontSize: '16px',
							fontFamily: token('font.body'),
							color: token('color.text'),
						}),
					},
					0,
				],
			],
		],
	];
};
