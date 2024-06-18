// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const richMediaClassName = 'rich-media-item';

const wrappedMediaBreakoutPoint = 410;

const mediaSingleSharedStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`li .${richMediaClassName}`]: {
		margin: 0,
	},
	// Hack for chrome to fix media single position inside a list when media is the first child
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.ua-chrome li > .mediaSingleView-content-wrap::before': {
		content: "''",
		display: 'block',
		height: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.ua-firefox': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.mediaSingleView-content-wrap': {
			userSelect: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.captionView-content-wrap': {
			userSelect: 'text',
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	".mediaSingleView-content-wrap[layout='center']": {
		clear: 'both',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`table .${richMediaClassName}`]: {
		marginTop: token('space.150', '12px'),
		marginBottom: token('space.150', '12px'),
		clear: 'both',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&.image-wrap-left, &.image-wrap-right': {
			clear: 'none',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'&:first-child': {
				marginTop: token('space.150', '12px'),
			},
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`.${richMediaClassName}.image-wrap-right + .${richMediaClassName}.image-wrap-left`]: {
		clear: 'both',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`.${richMediaClassName}.image-wrap-left + .${richMediaClassName}.image-wrap-right, .${richMediaClassName}.image-wrap-right + .${richMediaClassName}.image-wrap-left, .${richMediaClassName}.image-wrap-left + .${richMediaClassName}.image-wrap-left, .${richMediaClassName}.image-wrap-right + .${richMediaClassName}.image-wrap-right`]:
		{
			marginRight: 0,
			marginLeft: 0,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`@media all and (max-width: ${wrappedMediaBreakoutPoint}px)`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		"div.mediaSingleView-content-wrap[layout='wrap-left'], div.mediaSingleView-content-wrap[data-layout='wrap-left'], div.mediaSingleView-content-wrap[layout='wrap-right'], div.mediaSingleView-content-wrap[data-layout='wrap-right']":
			{
				float: 'none',
				overflow: 'auto',
				margin: `${token('space.150', '12px')} 0`,
			},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export { mediaSingleSharedStyle, richMediaClassName };
