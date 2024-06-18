// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { N30, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { wrapperDefault } from '../Extension/styles';

// Wrapper the extension title and extensionContainer
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const mbeExtensionWrapperCSSStyles = css(wrapperDefault, {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.with-margin-styles': {
		marginTop: 0,
		marginLeft: token('space.negative.150', '-12px'),
		marginRight: token('space.negative.150', '-12px'),
	},
	cursor: 'pointer',
	marginTop: token('space.250', '24px'),
	marginBottom: token('space.200', '16px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.extension-title': {
		display: 'flex',
		alignItems: 'center',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		lineHeight: '16px !important',
		marginBottom: token('space.100', '8px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginLeft: `${token('space.050', '4px')} !important`,
		marginRight: token('space.100', '8px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		paddingTop: `${token('space.100', '8px')} !important`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.with-border': {
		boxShadow: `0 0 0 1px ${token('color.border', N30)}`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.with-hover-border': {
		boxShadow: `0 0 0 1px ${token('color.border.input', N500)}`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.with-padding-background-styles': {
		padding: token('space.100', '8px'),
		background: 'transparent',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const overlayStyles = css({
	borderRadius: token('border.radius', '3px'),
	position: 'absolute',
	width: '100%',
	height: '100%',
	opacity: 0,
	pointerEvents: 'none',
	transition: 'opacity 0.3s',
	zIndex: 1,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.with-margin': {
		margin: token('space.negative.100', '-8px'),
	},
});
