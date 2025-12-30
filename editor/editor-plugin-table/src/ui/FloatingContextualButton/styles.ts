// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { N0, N20, N30A, N700 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { contextualMenuTriggerSize } from '../consts';

export const tableFloatingCellButtonStyles = () =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> div': {
			// Sits behind button to provide surface-color background
			background: token('elevation.surface', N20),
			borderRadius: token('radius.small', '3px'),
			display: 'flex',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			height: `${contextualMenuTriggerSize + 2}px`,
			width: token('space.250', '20px'),
			flexDirection: 'column',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button': {
			background: token('color.background.neutral', 'none'),
			flexDirection: 'column',
			margin: token('space.025', '2px'),
			outline: `2px solid ${token('elevation.surface', N0)}`,
			borderRadius: '1px',
			padding: 0,
			height: 'calc(100% - 4px)',
			display: 'flex',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button:hover': {
			background: token('color.background.neutral.hovered', N30A),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button:active': {
			background: token('color.background.neutral.pressed', 'rgba(179, 212, 255, 0.6)'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button > span': {
			margin: `0px ${token('space.negative.050', '-4px')}`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& span': {
			pointerEvents: 'none',
		},
	});

export const tableFloatingCellButtonSelectedStyles = () =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button': {
			background: token('color.background.selected', N700),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button:hover': {
			background: token('color.background.selected.hovered', N700),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button:active': {
			background: token('color.background.selected.pressed', N700),
		},
	});
