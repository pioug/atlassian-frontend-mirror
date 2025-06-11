// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const InlineNodeViewSharedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.inlineNodeView': {
			display: 'inline',
			userSelect: 'all',
			whiteSpace: 'nowrap',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'& > *:not(.zeroWidthSpaceContainer)': {
				whiteSpace: 'pre-wrap',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& > .assistive': {
				userSelect: 'none',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.ua-safari': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.inlineNodeView': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'&::selection, *::selection': {
					background: 'transparent',
				},
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.ua-chrome .inlineNodeView > span': {
			userSelect: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.inlineNodeViewAddZeroWidthSpace': {
			'&::after': {
				content: "'\u200b'", // ZERO_WIDTH_SPACE
			},
		},
	},
});
