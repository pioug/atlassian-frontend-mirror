/* eslint-disable @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766 */
import { css, keyframes } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

const fadeIn = keyframes({
	from: {
		opacity: 0,
		transform: 'translateY(16px)',
	},
	to: {
		opacity: 1,
		transform: 'translateY(0)',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const selectionToolbarAnimationStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	"[aria-label='Selection toolbar']": {
		animationName: fadeIn,
		animationDuration: `0.2s`,
		animationTimingFunction: `cubic-bezier(0.6, 0, 0, 1)`,
	},
});
