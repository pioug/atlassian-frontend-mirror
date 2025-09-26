// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const scrollbarStyles: SerializedStyles = css({
	msOverflowStyle: '-ms-autohiding-scrollbar',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&::-webkit-scrollbar-corner': {
		display: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&::-webkit-scrollbar-thumb': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		backgroundColor: token('color.background.neutral.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:hover::-webkit-scrollbar-thumb': {
		backgroundColor: token('color.background.neutral.bold'),
		borderRadius: token('radius.large'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&::-webkit-scrollbar-thumb:hover': {
		backgroundColor: token('color.background.neutral.bold.hovered'),
	},
});
