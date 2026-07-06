/* eslint-disable @atlaskit/ui-styling-standard/use-compiled -- Pre-existing lint debt surfaced by this mechanical type-import-only PR. */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

/**
 * CSS custom property that controls the vertical margin between editor block elements
 *
 * Consumers can opt in to custom block spacing by setting this property on any ancestor of the
 * editor content (typically `:root` or the editor wrapper). When the property is unset, every block
 * margin rule falls back to its original token/value, so this is a no-op for all existing consumers.
 *
 * The editor only emits the `var(...)` block-margin rules when the
 * `platform_editor_extension_block_spacing` editor experiment is enabled, so the hook can be
 * disabled centrally and its SSR/layout performance impact can be tracked. Setting this property
 * has no effect while the experiment is off.
 */
export const EXTENSION_BLOCK_SPACING_VAR = '--ak-editor-extension-block-spacing';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const wrapperDefault: SerializedStyles = css({
	background: token('color.background.neutral'),
	borderRadius: token('radius.small', '3px'),
	position: 'relative',
	verticalAlign: 'middle',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.with-overlay': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.extension-overlay': {
			background: token('color.background.neutral.hovered'),
			color: 'transparent',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&:hover .extension-overlay': {
			opacity: 1,
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports -- Ignored via go/DSP-18766
export const overlay: SerializedStyles = css({
	borderRadius: token('radius.small', '3px'),
	position: 'absolute',
	width: '100%',
	height: '100%',
	opacity: 0,
	pointerEvents: 'none',
	transition: 'opacity 0.3s',
	top: 0,
	left: 0,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports -- Ignored via go/DSP-18766
export const placeholderFallback: SerializedStyles = css({
	display: 'inline-flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > img': {
		margin: `0 ${token('space.050')}`,
	},
	/* TODO: fix in develop: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E */
	/* stylelint-disable-next-line */
	label: 'placeholder-fallback',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports -- Ignored via go/DSP-18766
export const placeholderFallbackParams: SerializedStyles = css({
	display: 'inline-block',
	maxWidth: '200px',
	marginLeft: token('space.050'),
	color: token('color.text.subtlest'),
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports -- Ignored via go/DSP-18766
export const styledImage: SerializedStyles = css({
	maxHeight: '16px',
	maxWidth: '16px',
	/* TODO: fix in develop: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E */
	/* stylelint-disable-next-line */
	label: 'lozenge-image',
});
