// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, keyframes } from '@emotion/react';

import { token } from '@atlaskit/tokens';

/**
 * @deprecated remove on FF cleanup of bandicoots-compiled-migration-smartcard
 */
export const getPulseStyles = () => {
	const color = token('color.border.discovery', '#8270DB');
	const pulseKeyframes = keyframes({
		to: {
			boxShadow: '0 0 0 7px rgba(0, 0, 0, 0)',
		},
	});

	return css({
		display: 'inline-flex',
		borderRadius: '3px',
		boxShadow: `0 0 0 0 ${color}`,
		animation: `${pulseKeyframes} 2s cubic-bezier(0.5, 0, 0, 1) 0.25s both 2`,
	});
};
