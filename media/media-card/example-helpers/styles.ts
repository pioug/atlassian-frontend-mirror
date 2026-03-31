import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const editableCardOptionsStyles = css({
	padding: token('space.250'),
	borderBottom: `${token('border.width', '1px')} solid ${token('color.border')}`,
	maxWidth: '700px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const sliderWrapperStyles = css({
	display: 'flex',
	width: '50%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		flex: 1,
		margin: token('space.100'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const editableCardContentStyles = css({
	padding: token('space.250'),
	border: '2px dashed',
	margin: `${token('space.0')} ${token('space.150')} ${token('space.600')} ${token('space.150')}`,
	overflow: 'hidden',
	background: token('color.background.accent.orange.subtlest'),
	boxSizing: 'border-box',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const optionsWrapperStyles = css({
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		flex: 1,
		margin: token('space.100'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const cardDimensionsWrapperStyles = css({
	margin: `${token('space.100')} ${token('space.100')} ${token('space.250')} ${token('space.100')}`,
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> div': {
		border: `${token('border.width', '1px')} solid ${token('color.border.bold')}`,
		margin: token('space.075'),
		padding: token('space.075'),
		// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
		borderRadius: token('radius.small', '3px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const flexWrapperStyles = css({
	display: 'flex',
});
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const cardPreviewWrapperStyles = css({
	flex: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const cardWrapperStyles = css({
	border: `${token('border.width', '1px')} solid ${token('color.border.bold')}`,
	padding: token('space.150'),
	margin: token('space.075'),
	flexDirection: 'column',
	width: '310px',
	height: '280px',
	overflow: 'auto',
	display: 'inline-block',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const cardFlowHeaderStyles = css({
	margin: `${token('space.250')} auto`,
	padding: `${token('space.150')} ${token('space.0')}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const externalIdentifierWrapperStyles = css({
	display: 'flex',
	justifyContent: 'space-around',
	margin: `${token('space.0')} auto`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	h2: {
		marginBottom: token('space.150'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const unhandledErrorCardWrapperStyles = css({
	padding: token('space.250'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'> div:first-child': {
		display: 'flex',
		marginBottom: token('space.250'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	label: {
		marginRight: token('space.250'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const inlineCardVideoWrapperItemStyles = css({
	padding: token('space.150'),
	border: `${token('border.width', '1px')} solid ${token('color.border.bold')}`,
	margin: token('space.150'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const mediaViewerExampleColumnStyles = css({
	flex: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const mediaViewerExampleWrapperStyles = css({
	display: 'flex',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const mediaInlineWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column',
	margin: token('space.1000'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const mediaInlineTableStyles = css({
	width: '800px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'tr, td': {
		border: `${token('border.width', '1px')} solid ${token('color.border')}`,
	},
});
