// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, keyframes } from '@emotion/react';

const pulseKeyframes = keyframes({
	to: {
		boxShadow: '0 0 0 7px rgba(0, 0, 0, 0)',
	},
});

// Styling from atlassian-frontend/packages/design-system/onboarding/src/styled/target.tsx
const pulseColor = 'rgb(101, 84, 192)';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const pulseStyles = css({
	display: 'inline-flex',
	borderRadius: '3px',
	boxShadow: `0 0 0 0 ${pulseColor}`,
	animation: `${pulseKeyframes} 1.45s cubic-bezier(0.5, 0, 0, 1) infinite`,
});
