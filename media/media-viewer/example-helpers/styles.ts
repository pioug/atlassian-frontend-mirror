// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const containerStyles = css({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
});
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const groupStyles = css({
	width: '250px',
	padding: token('space.250', '20px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const buttonListStyles = css({
	paddingLeft: 0,
	listStyle: 'none',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const mVSidebarStyles = css({
	height: 'calc(100vh - 64px)',
	padding: token('space.400', '32px'),
	overflow: 'auto',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	h2: {
		color: token('color.text', '#c7d1db'),
		marginBottom: token('space.200', '16px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	tbody: {
		borderBottom: 'none',
		verticalAlign: 'top',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const mVSidebarHeaderStyles = css({
	display: 'flex',
	width: '100%',
	justifyContent: 'space-between',
});
