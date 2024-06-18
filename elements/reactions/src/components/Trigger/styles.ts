/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { N70, N20, N40, B100 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';

export const DISABLED_BUTTON_COLOR = `${token('color.text.disabled', N70)} !important`;

export const triggerStyle = ({ miniMode = false, disabled = false }) =>
	css({
		minWidth: '32px',
		height: '24px',
		padding: 0,
		border: `1px solid ${token('color.border', N40)}`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		borderRadius: '20px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		lineHeight: '16px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		...(miniMode && {
			minWidth: '24px',
			padding: token('space.050', '4px'),
			border: 'none',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			borderRadius: `${borderRadius()}px`,
		}),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		...(disabled && {
			color: DISABLED_BUTTON_COLOR,
			cursor: 'not-allowed',
		}),
		'&:hover': {
			background: `${token('color.background.neutral.subtle.hovered', N20)}`,
		},
		'&:focus': {
			boxShadow: `0 0 0 2px ${token('color.border.focused', B100)}`,
			transitionDuration: '0s, 0.2s',
			outline: 'none',
		},
	});
