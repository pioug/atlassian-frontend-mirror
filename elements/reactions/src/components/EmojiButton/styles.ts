/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiButtonStyle = css({
	outline: 'none',
	display: 'flex',
	backgroundColor: 'transparent',
	border: 0,
	borderRadius: '5px',
	cursor: 'pointer',
	margin: '0',
	padding: `10px ${token('space.100', '8px')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&:hover > span': {
		transition: 'transform cubic-bezier(0.23, 1, 0.32, 1) 200ms',
		transform: 'scale(1.33)',
	},
});
