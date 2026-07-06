/* eslint-disable @atlaskit/ui-styling-standard/use-compiled -- Pre-existing lint debt surfaced by this mechanical type-import-only PR. */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

// Wraps the navigation bar and extensionFrames
const mbeExtensionContainer = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	background: 'transparent !important',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'padding:': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		left: `${token('space.100')} !important`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		right: `${token('space.100')} !important`,
	},
	paddingBottom: token('space.100'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.remove-padding': {
		paddingBottom: 0,
	},
	position: 'relative',
	verticalAlign: 'middle',
	cursor: 'pointer',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.multiBodiedExtension-handler-result': {
		marginLeft: token('space.100'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	".multiBodiedExtension-content-dom-wrapper > [data-extension-frame='true'], .multiBodiedExtension--frames > [data-extension-frame='true']":
		{
			display: 'none',
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
	borderTopLeftRadius: token('radius.small', '3px'),
	borderTopRightRadius: token('radius.small', '3px'),
	userSelect: 'none',
	WebkitUserModify: 'read-only',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	borderBottom: 'none !important',
	background: token('elevation.surface'),
	marginLeft: token('space.100'),
	marginRight: token('space.100'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.remove-margins': {
		margin: token('space.negative.100'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.remove-border': {
		border: 'none',
	},
});

const extensionFrameContent = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	display: 'block !important',
	minHeight: '100px',
	background: 'transparent',
	borderBottomLeftRadius: token('radius.small', '3px'),
	borderBottomRightRadius: token('radius.small', '3px'),
	marginLeft: token('space.100'),
	marginRight: token('space.100'),
	cursor: 'initial',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.pm-table-with-controls': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginLeft: `${token('space.150')} !important`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		paddingRight: `${token('space.150')} !important`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.bodiedExtensionView-content-wrap': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginTop: `${token('space.150')} !important`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.extensionView-content-wrap': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginTop: `${token('space.100')} !important`,
	},
});

// Block spacing hook variant of extensionFrameContent. Identical to extensionFrameContent except
// the extension content margins read from the `--ak-editor-extension-block-spacing` CSS custom
// property (falling back to the original token values). Selected only when
// expValEquals('platform_editor_extension_block_spacing') is enabled.
const extensionFrameContentWithBlockSpacing = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	display: 'block !important',
	minHeight: '100px',
	background: 'transparent',
	borderBottomLeftRadius: token('radius.small', '3px'),
	borderBottomRightRadius: token('radius.small', '3px'),
	marginLeft: token('space.100'),
	marginRight: token('space.100'),
	cursor: 'initial',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.pm-table-with-controls': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginLeft: `${token('space.150')} !important`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		paddingRight: `${token('space.150')} !important`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.bodiedExtensionView-content-wrap': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		marginTop: `var(--ak-editor-extension-block-spacing, ${token('space.150')}) !important`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.extensionView-content-wrap': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		marginTop: `var(--ak-editor-extension-block-spacing, ${token('space.100')}) !important`,
	},
});

const extensionFrameContentOld = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	padding: `${token('space.100')} !important`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	display: 'block !important',
	minHeight: '100px',
	background: 'transparent',
	borderBottomLeftRadius: token('radius.small', '3px'),
	borderBottomRightRadius: token('radius.small', '3px'),
	marginLeft: token('space.100'),
	marginRight: token('space.100'),
	cursor: 'initial',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.pm-table-with-controls': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginLeft: `${token('space.150')} !important`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		paddingRight: `${token('space.150')} !important`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.bodiedExtensionView-content-wrap': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginTop: `${token('space.150')} !important`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.extensionView-content-wrap': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginTop: `${token('space.100')} !important`,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const removeMarginsAndBorder: SerializedStyles = css({
	marginLeft: 0,
	marginRight: 0,
	border: 'none',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports -- Ignored via go/DSP-18766
export const sharedMultiBodiedExtensionStyles: {
	extensionFrameContent: SerializedStyles;
	mbeExtensionContainer: SerializedStyles;
	mbeNavigation: SerializedStyles;
} = {
	mbeExtensionContainer,
	mbeNavigation,
	get extensionFrameContent() {
		if (!fg('confluence_frontend_native_tabs_extension')) {
			return extensionFrameContentOld;
		}
		// Block spacing hook — when the experiment is on, use the variant whose extension content
		// margins read from --ak-editor-extension-block-spacing (falling back to the originals).
		// expValEquals always fires an exposure event.
		return expValEquals('platform_editor_extension_block_spacing', 'isEnabled', true)
			? extensionFrameContentWithBlockSpacing
			: extensionFrameContent;
	},
};
