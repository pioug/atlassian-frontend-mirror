import { css } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled

import { token } from '@atlaskit/tokens';

export const shadowClassNames = {
	RIGHT_SHADOW: 'right-shadow',
	LEFT_SHADOW: 'left-shadow',
};

export const shadowObserverClassNames = {
	SENTINEL_LEFT: 'sentinel-left',
	SENTINEL_RIGHT: 'sentinel-right',
	SHADOW_CONTAINER: 'with-shadow-observer',
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const shadowStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`& .${shadowClassNames.RIGHT_SHADOW}::before, .${shadowClassNames.RIGHT_SHADOW}::after, .${shadowClassNames.LEFT_SHADOW}::before, .${shadowClassNames.LEFT_SHADOW}::after`]:
			{
				display: 'none',
				position: 'absolute',
				pointerEvents: 'none',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				zIndex: 2,
				width: 8,
				content: "''",
				height: 'calc(100%)',
			},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`& .${shadowClassNames.RIGHT_SHADOW}, .${shadowClassNames.LEFT_SHADOW}`]: {
			position: 'relative',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`& .${shadowClassNames.LEFT_SHADOW}::before`]: {
			background: `linear-gradient(to left, transparent 0, ${token('elevation.shadow.overflow.spread')} 140% ), linear-gradient( to right, ${token('elevation.shadow.overflow.perimeter', 'transparent')} 0px, transparent 1px)`,
			top: 0,
			left: 0,
			display: 'block',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`& .${shadowClassNames.RIGHT_SHADOW}::after`]: {
			background: `linear-gradient(to right, transparent 0, ${token('elevation.shadow.overflow.spread')} 140% ), linear-gradient( to left, ${token('elevation.shadow.overflow.perimeter', 'transparent')} 0px, transparent 1px)`,
			right: 0,
			top: 0,
			display: 'block',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`& .${shadowObserverClassNames.SENTINEL_LEFT}`]: {
			height: '100%',
			width: 0,
			minWidth: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`& .${shadowObserverClassNames.SENTINEL_RIGHT}`]: {
			height: '100%',
			width: 0,
			minWidth: 0,
		},
	},
});
