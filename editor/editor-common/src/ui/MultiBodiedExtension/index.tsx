/** @jsx jsx */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// Wraps the navigation bar and extensionFrames
const mbeExtensionContainer = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	background: 'transparent !important',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'padding:': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		left: `${token('space.100', '8px')} !important`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		right: `${token('space.100', '8px')} !important`,
	},
	paddingBottom: token('space.100', '8px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.remove-padding': {
		paddingBottom: 0,
	},
	position: 'relative',
	verticalAlign: 'middle',
	cursor: 'pointer',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.multiBodiedExtension-handler-result': {
		marginLeft: token('space.100', '8px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	".multiBodiedExtension-content-dom-wrapper > [data-extension-frame='true'], .multiBodiedExtension--frames > [data-extension-frame='true']":
		{
			display: 'none',
			background: token('elevation.surface', 'white'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.multiBodiedExtension-content-dom-wrapper, .multiBodiedExtension--frames': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		"[data-extension-frame='true'] > :not(style):first-child, [data-extension-frame='true'] > style:first-child + *":
			{
				marginTop: 0,
			},
	},
});

const mbeNavigation = css({
	borderTopLeftRadius: token('border.radius', '3px'),
	borderTopRightRadius: token('border.radius', '3px'),
	userSelect: 'none',
	WebkitUserModify: 'read-only',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	borderBottom: 'none !important',
	background: token('elevation.surface', 'white'),
	marginLeft: token('space.100', '8px'),
	marginRight: token('space.100', '8px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.remove-margins': {
		margin: token('space.negative.100', '-8px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.remove-border': {
		border: 'none',
	},
});

const extensionFrameContent = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	padding: `${token('space.100', '8px')} !important`,
	display: 'block',
	minHeight: '100px',
	background: token('elevation.surface', 'white'),
	borderBottomLeftRadius: token('border.radius', '3px'),
	borderBottomRightRadius: token('border.radius', '3px'),
	marginLeft: token('space.100', '8px'),
	marginRight: token('space.100', '8px'),
	cursor: 'initial',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.pm-table-with-controls': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginLeft: `${token('space.150', '12px')} !important`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		paddingRight: `${token('space.150', '12px')} !important`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.bodiedExtensionView-content-wrap': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginTop: `${token('space.150', '12px')} !important`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.extensionView-content-wrap': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginTop: `${token('space.100', '8px')} !important`,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const removeMarginsAndBorder = css({
	marginLeft: 0,
	marginRight: 0,
	border: 'none',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const sharedMultiBodiedExtensionStyles = {
	mbeExtensionContainer,
	mbeNavigation,
	extensionFrameContent,
};
