// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const wrapperDefault = css({
	background: token('color.background.neutral'),
	borderRadius: token('border.radius', '3px'),
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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const overlay = css({
	borderRadius: token('border.radius', '3px'),
	position: 'absolute',
	width: '100%',
	height: '100%',
	opacity: 0,
	pointerEvents: 'none',
	transition: 'opacity 0.3s',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const placeholderFallback = css({
	display: 'inline-flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > img': {
		margin: `0 ${token('space.050', '4px')}`,
	},
	/* TODO: fix in develop: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E */
	/* stylelint-disable-next-line */
	label: 'placeholder-fallback',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const placeholderFallbackParams = css({
	display: 'inline-block',
	maxWidth: '200px',
	marginLeft: token('space.050', '4px'),
	color: token('color.text.subtlest'),
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const styledImage = css({
	maxHeight: '16px',
	maxWidth: '16px',
	/* TODO: fix in develop: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E */
	/* stylelint-disable-next-line */
	label: 'lozenge-image',
});
