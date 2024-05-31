import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const richMediaClassName = 'rich-media-item';

const wrappedMediaBreakoutPoint = 410;

const mediaSingleSharedStyle = css({
	[`li .${richMediaClassName}`]: {
		margin: 0,
	},
	// Hack for chrome to fix media single position inside a list when media is the first child
	'&.ua-chrome li > .mediaSingleView-content-wrap::before': {
		content: "''",
		display: 'block',
		height: 0,
	},
	'&.ua-firefox': {
		'.mediaSingleView-content-wrap': {
			userSelect: 'none',
		},
		'.captionView-content-wrap': {
			userSelect: 'text',
		},
	},
	".mediaSingleView-content-wrap[layout='center']": {
		clear: 'both',
	},
	[`table .${richMediaClassName}`]: {
		marginTop: token('space.150', '12px'),
		marginBottom: token('space.150', '12px'),
		clear: 'both',
		'&.image-wrap-left, &.image-wrap-right': {
			clear: 'none',
			'&:first-child': {
				marginTop: token('space.150', '12px'),
			},
		},
	},
	[`.${richMediaClassName}.image-wrap-right + .${richMediaClassName}.image-wrap-left`]: {
		clear: 'both',
	},
	[`.${richMediaClassName}.image-wrap-left + .${richMediaClassName}.image-wrap-right, .${richMediaClassName}.image-wrap-right + .${richMediaClassName}.image-wrap-left, .${richMediaClassName}.image-wrap-left + .${richMediaClassName}.image-wrap-left, .${richMediaClassName}.image-wrap-right + .${richMediaClassName}.image-wrap-right`]:
		{
			marginRight: 0,
			marginLeft: 0,
		},
	[`@media all and (max-width: ${wrappedMediaBreakoutPoint}px)`]: {
		"div.mediaSingleView-content-wrap[layout='wrap-left'], div.mediaSingleView-content-wrap[data-layout='wrap-left'], div.mediaSingleView-content-wrap[layout='wrap-right'], div.mediaSingleView-content-wrap[data-layout='wrap-right']":
			{
				float: 'none',
				overflow: 'auto',
				margin: `${token('space.150', '12px')} 0`,
			},
	},
});

export { mediaSingleSharedStyle, richMediaClassName };
