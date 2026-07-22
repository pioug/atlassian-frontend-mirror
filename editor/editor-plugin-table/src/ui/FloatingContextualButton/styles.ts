// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import { contextualMenuTriggerSize } from '../consts';

// Excludes the inlined top-layer tooltip popover from the background box selector so it isn't squished.
const topLayerTooltipCellButtonStyles = (): SerializedStyles =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'> div:not([popover])': {
			// Sits behind button to provide surface-color background
			background: token('elevation.surface'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			borderRadius: expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true)
				? token('radius.small', '4px')
				: token('radius.small', '3px'),
			display: 'flex',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			height: `${contextualMenuTriggerSize + 2}px`,
			width: token('space.250'),
			flexDirection: 'column',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button': {
			background: token('color.background.neutral'),
			flexDirection: 'column',
			margin: token('space.025'),
			outline: `2px solid ${token('elevation.surface')}`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			borderRadius: expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true)
				? token('radius.xsmall', '2px')
				: '1px',
			padding: 0,
			height: 'calc(100% - 4px)',
			display: 'flex',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button:hover': {
			background: token('color.background.neutral.hovered'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button:active': {
			background: token('color.background.neutral.pressed'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button > span': {
			margin: `0px ${token('space.negative.050')}`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& span': {
			pointerEvents: 'none',
		},
	});

const legacyCellButtonStyles = (): SerializedStyles =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> div': {
			// Sits behind button to provide surface-color background
			background: token('elevation.surface'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			borderRadius: expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true)
				? token('radius.small', '4px')
				: token('radius.small', '3px'),
			display: 'flex',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			height: `${contextualMenuTriggerSize + 2}px`,
			width: token('space.250'),
			flexDirection: 'column',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button': {
			background: token('color.background.neutral'),
			flexDirection: 'column',
			margin: token('space.025'),
			outline: `2px solid ${token('elevation.surface')}`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			borderRadius: expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true)
				? token('radius.xsmall', '2px')
				: '1px',
			padding: 0,
			height: 'calc(100% - 4px)',
			display: 'flex',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button:hover': {
			background: token('color.background.neutral.hovered'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button:active': {
			background: token('color.background.neutral.pressed'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button > span': {
			margin: `0px ${token('space.negative.050')}`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& span': {
			pointerEvents: 'none',
		},
	});

export const tableFloatingCellButtonStyles = (): SerializedStyles =>
	fg('platform-dst-top-layer-tooltip')
		? topLayerTooltipCellButtonStyles()
		: legacyCellButtonStyles();

export const tableFloatingCellButtonSelectedStyles = (): SerializedStyles =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button': {
			background: token('color.background.selected'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button:hover': {
			background: token('color.background.selected.hovered'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button:active': {
			background: token('color.background.selected.pressed'),
		},
	});
