// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const containerStyles: SerializedStyles = css({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
});
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const groupStyles: SerializedStyles = css({
	width: '250px',
	padding: token('space.250'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const buttonListStyles: SerializedStyles = css({
	paddingLeft: 0,
	listStyle: 'none',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const mVSidebarStyles: SerializedStyles = css({
	height: 'calc(100vh - 64px)',
	padding: token('space.400'),
	overflow: 'auto',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	h2: {
		color: token('color.text'),
		marginBottom: token('space.200'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	tbody: {
		borderBottom: 'none',
		verticalAlign: 'top',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const mVSidebarHeaderStyles: SerializedStyles = css({
	display: 'flex',
	width: '100%',
	justifyContent: 'space-between',
});
