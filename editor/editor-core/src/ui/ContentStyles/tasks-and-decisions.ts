// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { TaskDecisionSharedCssClassName } from '@atlaskit/editor-common/styles';
import { getSelectionStyles, SelectionStyle } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const taskDecisionStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-selected-node > [data-decision-wrapper], ol[data-node-type="decisionList"].ak-editor-selected-node':
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[
			{
				borderRadius: '4px',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket]),
		],
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.danger decisionItemView-content-wrap.ak-editor-selected-node > div': {
		boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
		backgroundColor: token('color.blanket.danger'),
		'&::after': {
			content: 'none', // reset the Blanket selection style
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="decisionItem"]': {
		listStyleType: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper]': {
		cursor: 'pointer',
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
	'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"]':
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
	'[data-prosemirror-node-name="decisionItem"]:not(:has([data-empty]):not(:has([data-type-ahead]))) > [data-decision-wrapper] > [data-component="icon"]':
		{
			color: token('color.icon.success'),
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span':
		{
			display: 'inline-block',
			flexShrink: 0,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography -- Mirroring icon styles
			lineHeight: 1,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span > svg':
		{
			overflow: 'hidden',
			pointerEvents: 'none',
			color: 'currentColor',
			verticalAlign: 'bottom',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="placeholder"]':
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
	'[data-prosemirror-node-name="decisionItem"]:not(:has([data-empty]):not(:has([data-type-ahead]))) > [data-decision-wrapper] > [data-component="placeholder"]':
		{
			display: 'none',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="content"]':
		{
			margin: 0,
			wordWrap: 'break-word',
			minWidth: 0,
			flex: '1 1 auto',
		},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const taskDecisionIconWithVisualRefresh = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span >  svg[data-icon-source="legacy"]':
		{
			display: 'none',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span':
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
	'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span > svg':
		{
			width: token('space.300'),
			height: token('space.300'),
		},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const taskDecisionIconWithoutVisualRefresh = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span >  svg[data-icon-source="refreshed"]':
		{
			display: 'none',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span':
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
	'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span > svg':
		{
			maxWidth: '100%',
			maxHeight: '100%',
			fill: token('elevation.surface'),
			width: '32px',
			height: '32px',
		},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const taskItemStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="taskItem"]': {
		listStyle: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="taskItem"] [data-component="task-item-main"]': {
		display: 'flex',
		flexDirection: 'row',
		position: 'relative',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="taskItem"] [data-component="placeholder"]': {
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
	"[data-prosemirror-node-name='taskItem']:has([data-empty]):not(:has([data-type-ahead])) [data-component='placeholder']":
		{
			display: 'block',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="taskItem"] [data-component="content"]': {
		margin: 0,
		wordWrap: 'break-word',
		minWidth: 0,
		flex: '1 1 auto',
	},

	// copied styles from packages/design-system/icon/src/components/icon-new.tsx
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="taskItem"] [data-component="checkbox-icon-wrap"]': {
		display: 'inline-block',
		boxSizing: 'border-box',
		flexShrink: 0,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 1,
		paddingInlineEnd: 'var(--ds--button--new-icon-padding-end, 0)',
		paddingInlineStart: 'var(--ds--button--new-icon-padding-start, 0)',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="taskItem"] [data-component="checkbox-icon-wrap"] svg': {
		overflow: 'hidden',
		pointerEvents: 'none',
		color: 'currentColor',
		verticalAlign: 'bottom',
		width: token('space.200', '16px'),
		height: token('space.200', '16px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-prosemirror-node-name="taskItem"] input[type=checkbox]:not(:checked) + span [data-component=checkbox-checked-icon]':
		{
			display: 'none',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-prosemirror-node-name="taskItem"] input[type=checkbox]:not(:checked) + span [data-component=checkbox-unchecked-icon]':
		{
			display: 'inline',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="taskItem"] input[type=checkbox]:checked + span [data-component=checkbox-checked-icon]':
		{
			display: 'inline',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="taskItem"] input[type=checkbox]:checked + span [data-component=checkbox-unchecked-icon]':
		{
			display: 'none',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`[data-prosemirror-node-name="taskItem"] .${TaskDecisionSharedCssClassName.TASK_CHECKBOX_CONTAINER}`]:
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
