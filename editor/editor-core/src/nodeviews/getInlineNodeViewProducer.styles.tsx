import { css } from '@emotion/react';

import { inlineNodeViewClassname } from '@atlaskit/editor-common/react-node-view';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';

// For reasoning behind styles, see comments in:
// ./getInlineNodeViewProducer -> portalChildren()

export const InlineNodeViewSharedStyles = css({
	[`.${inlineNodeViewClassname}`]: {
		display: 'inline',
		userSelect: 'all',
		whiteSpace: 'nowrap',
		'& > *:not(.zeroWidthSpaceContainer)': {
			whiteSpace: 'pre-wrap',
		},
		'& > .assistive': {
			userSelect: 'none',
		},
	},
	'&.ua-safari': {
		[`.${inlineNodeViewClassname}`]: {
			'::selection, *::selection': {
				background: 'transparent',
			},
		},
	},
	[`&.ua-chrome .${inlineNodeViewClassname} > span`]: {
		userSelect: 'none',
	},
	[`.${inlineNodeViewClassname}AddZeroWidthSpace`]: {
		'::after': {
			content: `'${ZERO_WIDTH_SPACE}'`,
		},
	},
});
