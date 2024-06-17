import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const loadingViewContainer = css({
	display: 'flex',
	flexDirection: 'column',
	padding: token('space.200', '1rem'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const skeletonContainer = css({
	display: 'flex',
	flexDirection: 'column',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space -- needs manual remediation
	gap: '0.625rem',
	alignItems: 'center',
});

export const getTitleStyles = (height: number): SerializedStyles => {
	return css({
		flex: '1 0 auto',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `${height}rem`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		span: {
			width: '100%',
		},
	});
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const titleBlockStyles = css({
	width: '100%',
	gap: token('space.100', '0.5rem'),
});
