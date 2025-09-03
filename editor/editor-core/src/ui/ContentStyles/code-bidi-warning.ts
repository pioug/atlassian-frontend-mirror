// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const codeBidiWarningStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="code-bidi-warning"]': {
		display: 'inline-block',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="code-bidi-warning"] [data-bidi-component="code-bidi-warning-decorator"]':
		{
			paddingInlineStart: token('space.050'),
			paddingInlineEnd: token('space.050'),
			font: token('font.body'),
			fontStyle: 'normal',
			fontFamily: token('font.family.code'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			paddingTop: '0.05rem',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			paddingBottom: '0.05rem',
			color: token('color.text.warning'),
			backgroundColor: token('color.background.warning'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="code-bidi-warning"] [data-bidi-component="code-bidi-warning-decorator"]:hover':
		{
			color: token('color.text.warning'),
			backgroundColor: token('color.background.warning.hovered'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="code-bidi-warning"] [data-bidi-component="code-bidi-warning-tooltip"]':
		{
			visibility: 'hidden',
			boxSizing: 'border-box',
			width: '15pc',
			backgroundColor: token('color.background.neutral.bold'),
			color: token('color.text.inverse'),
			overflowWrap: 'break-word',
			cursor: 'default',
			borderRadius: token('radius.small'),
			margin: token('space.0'),
			padding: `${token('space.025')} ${token('space.075')}`,
			position: 'fixed',
			// The character label will be ~80px and this is positioned from the end of that label
			// We also use this instead of top: 24px to make sure the tooltip maintains its initial position
			// instead of being positioned relative to the viewport.
			// We need to use position: fixed so that the tooltip bypasses the overflow settings of the code block
			// and is always visible.
			// We also offset a little extra here to account for the transition behavior (to replicate ADS fade-in-from-top)
			transform: 'translate(calc(-50% - 40px), calc(24px - 4px))',
			opacity: 0,
			whiteSpace: 'normal',
			font: token('font.body.small'),
			zIndex: 9999,
			// Exit animation timings
			// - Mark invisible after 0.475s
			// - After 0.3s, fade out and move up over 0.175s
			transition:
				'visibility 0s linear 0.475s, opacity 0.175s cubic-bezier(0.15,1,0.3,1) 0.3s, transform 0.175s cubic-bezier(0.15,1,0.3,1) 0.3s',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="code-bidi-warning"]:hover [data-bidi-component="code-bidi-warning-tooltip"]':
		{
			visibility: 'visible',
			transform: 'translate(calc(-50% - 40px), calc(24px))',
			opacity: 1,
			// Enter animation timings
			// - Mark visible after 0.3s of hovering
			// - After 0.3s, fade in over 0.175s
			// - After 0.3s, move down over 0.35s
			transition:
				'visibility 0s linear 0.3s, opacity 0.175s cubic-bezier(0.15,1,0.3,1) 0.3s, transform 0.35s cubic-bezier(0.15,1,0.3,1) 0.3s',
		},
});
