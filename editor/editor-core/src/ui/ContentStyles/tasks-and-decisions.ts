// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { TaskDecisionSharedCssClassName } from '@atlaskit/editor-common/styles';
import {
	akEditorDeleteBackgroundWithOpacity,
	akEditorDeleteBorder,
	akEditorSelectedBorderSize,
	akEditorSelectedNodeClassName,
	getSelectionStyles,
	SelectionStyle,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const taskDecisionStyles = css`
	[data-decision-wrapper] {
		cursor: pointer;
	}

	.${akEditorSelectedNodeClassName} > [data-decision-wrapper],
	ol[data-node-type='decisionList'].${akEditorSelectedNodeClassName} {
		border-radius: 4px;
		${getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket])}
	}

	.danger {
		.${TaskDecisionSharedCssClassName.DECISION_CONTAINER}.${akEditorSelectedNodeClassName} > div {
			box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px
				${token('color.border.danger', akEditorDeleteBorder)};
			background-color: ${token('color.blanket.danger', akEditorDeleteBackgroundWithOpacity)};
			&::after {
				content: none; /* reset the Blanket selection style */
			}
		}
	}
`;

// Combine this with taskDecisionStyles (above) when cleaning up the platform_editor_vanilla_dom experiment.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const vanillaTaskDecisionStyles = css({
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
export const vanillaTaskDecisionIconWithVisualRefresh = css({
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
export const vanillaTaskDecisionIconWithoutVisualRefresh = css({
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
