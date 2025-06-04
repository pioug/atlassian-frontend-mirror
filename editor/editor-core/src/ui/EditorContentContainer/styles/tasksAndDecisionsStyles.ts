import { css } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled

import { token } from '@atlaskit/tokens';

import {
	blanketSelectionStyles,
	boxShadowSelectionStyles,
	hideNativeBrowserTextSelectionStyles,
} from './selectionStyles';

const akEditorLineHeight = 1.714;
const akEditorSelectedBorderSize = 1;
const akEditorSelectedNodeClassName = 'ak-editor-selected-node';

export const TaskDecisionSharedCssClassName = {
	DECISION_CONTAINER: 'decisionItemView-content-wrap',
	TASK_CONTAINER: 'taskItemView-content-wrap',
	TASK_ITEM: 'task-item',
	TASK_CHECKBOX_CONTAINER: 'task-item-checkbox-wrap',
};

const decisionSelectionStyles = css({
	borderRadius: '4px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const decisionStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-decision-wrapper]': {
		cursor: 'pointer',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[`.${akEditorSelectedNodeClassName} > [data-decision-wrapper], ol[data-node-type='decisionList'].${akEditorSelectedNodeClassName}`]:
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[
			decisionSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			boxShadowSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			blanketSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			hideNativeBrowserTextSelectionStyles,
		],
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.danger': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[`.${TaskDecisionSharedCssClassName.DECISION_CONTAINER}.${akEditorSelectedNodeClassName} > div`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 ${akEditorSelectedBorderSize}px ${token('color.border.danger')}`,
				backgroundColor: token('color.blanket.danger'),
				'&::after': {
					content: 'none', // reset the Blanket selection style
				},
			},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const tasksAndDecisionsStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.taskItemView-content-wrap, .${TaskDecisionSharedCssClassName.DECISION_CONTAINER}`]: {
			position: 'relative',
			minWidth: 48,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${TaskDecisionSharedCssClassName.DECISION_CONTAINER}`]: {
			marginTop: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${TaskDecisionSharedCssClassName.TASK_CONTAINER}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			"span[contenteditable='false']": {
				height: `${akEditorLineHeight}em`,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${TaskDecisionSharedCssClassName.TASK_ITEM}`]: {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: akEditorLineHeight,
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'div[data-task-local-id]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		"span[contenteditable='false']": {
			height: `${akEditorLineHeight}em`,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		"span[contenteditable='false'] + div": {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: `${akEditorLineHeight}em`,
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'div[data-task-list-local-id]': {
		margin: `${token('space.150', '12px')} 0 0 0`,

		// If task item is not first in the list then set margin top to 4px.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'div + div': {
			marginTop: token('space.050', '4px'),
		},
	},

	// If task list is not first in the document then set margin top to 4px.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'div[data-task-list-local-id] div[data-task-list-local-id]': {
		marginTop: token('space.050', '4px'),
		marginLeft: token('space.300', '24px'),
	},

	// When action list is inside panel
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-panel__content': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
		'> div[data-task-list-local-id]:first-child': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			margin: '0 !important',
		},
	},
});

// Combine this with taskDecisionStyles (above) when cleaning up the platform_editor_vanilla_dom experiment.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const vanillaDecisionStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="decisionItem"]': {
		listStyleType: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper]':
		{
			display: 'flex',
			flexDirection: 'row',
			margin: `${token('space.100')} 0 0 0`,
			padding: token('space.100'),
			paddingLeft: token('space.150'),
			borderRadius: token('border.radius.100'),
			backgroundColor: token('color.background.neutral'),
			position: 'relative',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"]':
		{
			flex: '0 0 16px',
			height: '16px',
			width: '16px',
			margin: `${token('space.050')} ${token('space.150')} 0 0`,
			color: token('color.icon.subtle'),
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="decisionItem"]:not(:has([data-empty]):not(:has([data-type-ahead]))) > [data-decision-wrapper] > [data-component="icon"]':
		{
			color: token('color.icon.success'),
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span':
		{
			display: 'inline-block',
			flexShrink: 0,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography -- Mirroring icon styles
			lineHeight: 1,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span > svg':
		{
			overflow: 'hidden',
			pointerEvents: 'none',
			color: 'currentColor',
			verticalAlign: 'bottom',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="placeholder"]':
		{
			margin: `0 0 0 calc(${token('space.100', '8px')} * 3.5)`,
			position: 'absolute',
			color: token('color.text.subtlest'),
			pointerEvents: 'none',
			textOverflow: 'ellipsis',
			overflow: 'hidden',
			whiteSpace: 'nowrap',
			maxWidth: 'calc(100% - 50px)',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="decisionItem"]:not(:has([data-empty]):not(:has([data-type-ahead]))) > [data-decision-wrapper] > [data-component="placeholder"]':
		{
			display: 'none',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="content"]':
		{
			margin: 0,
			wordWrap: 'break-word',
			minWidth: 0,
			flex: '1 1 auto',
		},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const vanillaDecisionIconWithVisualRefresh = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span >  svg[data-icon-source="legacy"]':
		{
			display: 'none',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span':
		{
			boxSizing: 'border-box',
			paddingInlineEnd: 'var(--ds--button--new-icon-padding-end, 0)',
			paddingInlineStart: 'var(--ds--button--new-icon-padding-start, 0)',
			'@media screen and (forced-colors: active)': {
				color: 'canvastext',
				filter: 'grayscale(1)',
			},
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span > svg':
		{
			width: token('space.300'),
			height: token('space.300'),
		},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const vanillaDecisionIconWithoutVisualRefresh = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span >  svg[data-icon-source="refreshed"]':
		{
			display: 'none',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span':
		{
			width: '32px',
			height: '32px',
			'@media screen and (forced-colors: active)': {
				filter: 'grayscale(1)',
				color: 'canvastext',
				fill: 'canvas',
			},
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span > svg':
		{
			maxWidth: '100%',
			maxHeight: '100%',
			fill: token('elevation.surface'),
			width: '32px',
			height: '32px',
		},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const vanillaTaskItemStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="taskItem"]': {
		listStyle: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="taskItem"] [data-component="task-item-main"]':
		{
			display: 'flex',
			flexDirection: 'row',
			position: 'relative',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="taskItem"] [data-component="placeholder"]':
		{
			position: 'absolute',
			color: token('color.text.subtlest'),
			margin: `0 0 0 calc(${token('space.100', '8px')} * 3)`,
			pointerEvents: 'none',
			textOverflow: 'ellipsis',
			overflow: 'hidden',
			whiteSpace: 'nowrap',
			maxWidth: 'calc(100% - 50px)',
			display: 'none',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="taskItem"]:has([data-empty]):not(:has([data-type-ahead])) [data-component="placeholder"]':
		{
			display: 'block',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="taskItem"] [data-component="content"]':
		{
			margin: 0,
			wordWrap: 'break-word',
			minWidth: 0,
			flex: '1 1 auto',
		},

	// copied styles from packages/design-system/icon/src/components/icon-new.tsx
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="taskItem"] [data-component="checkbox-icon-wrap"]':
		{
			display: 'inline-block',
			boxSizing: 'border-box',
			flexShrink: 0,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 1,
			paddingInlineEnd: 'var(--ds--button--new-icon-padding-end, 0)',
			paddingInlineStart: 'var(--ds--button--new-icon-padding-start, 0)',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="taskItem"] [data-component="checkbox-icon-wrap"] svg':
		{
			overflow: 'hidden',
			pointerEvents: 'none',
			color: 'currentColor',
			verticalAlign: 'bottom',
			width: token('space.200', '16px'),
			height: token('space.200', '16px'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="taskItem"] input[type=checkbox]:not(:checked) + span [data-component=checkbox-checked-icon]':
		{
			display: 'none',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="taskItem"] input[type=checkbox]:not(:checked) + span [data-component=checkbox-unchecked-icon]':
		{
			display: 'inline',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="taskItem"] input[type=checkbox]:checked + span [data-component=checkbox-checked-icon]':
		{
			display: 'inline',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="taskItem"] input[type=checkbox]:checked + span [data-component=checkbox-unchecked-icon]':
		{
			display: 'none',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="taskItem"] .${TaskDecisionSharedCssClassName.TASK_CHECKBOX_CONTAINER}`]:
		{
			flex: '0 0 24px',
			width: '24px',
			height: '24px',
			position: 'relative',
			alignSelf: 'start',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			"& > input[type='checkbox']": {
				width: '16px',
				height: '16px',
				zIndex: 1,
				cursor: 'pointer',
				outline: 'none',
				margin: 0,
				opacity: 0,
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'&[disabled]': {
					cursor: 'default',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'+ span': {
					width: '24px',
					height: '24px',
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'+ span > svg': {
					boxSizing: 'border-box',
					display: 'inline',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					maxWidth: 'unset',
					maxHeight: 'unset',
					position: 'absolute',
					overflow: 'hidden',
					color: token('color.background.input'),
					transition: 'color 0.2s ease-in-out, fill 0.2s ease-in-out',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
					'path:first-of-type': {
						visibility: 'hidden',
					},
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
					'rect:first-of-type': {
						stroke: token('color.border.input'),
						strokeWidth: 1,
						transition: 'stroke 0.2s ease-in-out',
					},
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'&:hover + span > svg': {
					color: token('color.background.input.hovered'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
					'rect:first-of-type': {
						stroke: token('color.border.input'),
					},
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'&:checked:hover + span > svg': {
					color: token('color.background.selected.bold.hovered'),
					fill: token('color.icon.inverse'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
					'rect:first-of-type': {
						stroke: token('color.background.selected.bold.hovered'),
					},
				},
				'&:checked': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
					'+ span > svg': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
						'path:first-of-type': {
							visibility: 'visible',
						},
						color: token('color.background.selected.bold'),
						fill: token('color.icon.inverse'),
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
						'rect:first-of-type': {
							stroke: token('color.background.selected.bold'),
						},
					},
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'&:active + span > svg': {
					color: token('color.background.input.pressed'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
					'rect:first-of-type': {
						stroke: token('color.border'),
					},
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'&:checked:active + span > svg': {
					color: token('color.background.input.pressed'),
					fill: token('color.icon.inverse'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
					'rect:first-of-type': {
						stroke: token('color.border'),
					},
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'&:disabled + span > svg, &:disabled:hover + span > svg, &:disabled:focus + span > svg, &:disabled:active + span > svg':
					{
						color: token('color.background.disabled'),
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
						'rect:first-of-type': {
							stroke: token('color.background.disabled'),
						},
					},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'&:disabled:checked + span > svg': {
					fill: token('color.icon.disabled'),
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'&:focus + span::after': {
					position: 'absolute',
					width: token('space.200', '16px'),
					height: token('space.200', '16px'),
					border: `2px solid ${token('color.border.focused')}`,
					borderRadius: token('space.050', '4px'),
					content: "''",
					display: 'block',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				},
			},
		},
});
