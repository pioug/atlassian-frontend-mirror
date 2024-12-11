// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { wrapperDefault } from '../styles';

export const widerLayoutClassName = 'wider-layout';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const wrapperStyle = css(wrapperDefault, {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.without-frame': {
		background: 'transparent',
	},
	cursor: 'pointer',
	width: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.extension-overflow-wrapper:not(.with-body)': {
		overflowX: 'auto',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.with-bodied-border': {
		boxShadow: `0 0 0 1px ${token('color.border')}`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.with-hover-border': {
		boxShadow: `0 0 0 1px ${token('color.border.input')}`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.with-margin-styles': {
		margin: `0 ${token('space.negative.250', '-20px')}`,
		padding: `0 ${token('space.250', '20px')}`,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const header = css({
	padding: `${token('space.050', '4px')} ${token('space.050', '4px')} 0px`,
	verticalAlign: 'middle',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&.with-children:not(.without-frame)': {
		padding: `${token('space.050', '4px')} ${token('space.100', '8px')} ${token(
			'space.100',
			'8px',
		)}`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.without-frame': {
		padding: 0,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const content = css({
	padding: token('space.100', '8px'),
	background: token('elevation.surface', 'white'),
	border: `1px solid ${token('color.border')}`,
	borderRadius: token('border.radius', '3px'),
	cursor: 'initial',
	width: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.remove-border': {
		border: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.hide-content': {
		display: 'none',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const contentWrapper = css({
	padding: `0 ${token('space.100', '8px')} ${token('space.100', '8px')}`,
	display: 'flex',
	justifyContent: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.with-padding-styles': {
		padding: token('space.100', '8px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.with-bodied-padding-styles': {
		padding: `${token('space.100', '8px')} ${token('space.250', '20px')}`, // account for upcoming editor elements drag & drop feature
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const overflowWrapperStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.with-margin-styles': {
		margin: `0 ${token('space.negative.250', '-20px')}`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.with-padding-styles': {
		padding: token('space.100', '8px'),
	},
});
