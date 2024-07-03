/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { akEditorShadowZIndex } from '@atlaskit/editor-shared-styles';
import { N40A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { shadowClassNames } from '../../ui/OverflowShadow';
import { shadowObserverClassNames } from '../../ui/OverflowShadow/shadowObserver';

const shadowWidth = 8;

/**
 * TODO: This is close to working and removes a tone of JS from OverflowShadow component
 *
 *  background: linear-gradient(to right, white 30%, rgba(255, 255, 255, 0)),
 *         linear-gradient(to right, rgba(255, 255, 255, 0), white 70%) 100% 0,
 *        linear-gradient(to right, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)),
 *         linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2)) 100% 0;
 *       background-repeat: no-repeat;
 *       background-color: white;
 *       background-size: 40px 100%, 40px 100%, 14px 100%, 14px 100%;
 *
 *      background-attachment: local, local, scroll, scroll;
 */

const shadowSharedStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`& .${shadowClassNames.RIGHT_SHADOW}::before, .${shadowClassNames.RIGHT_SHADOW}::after, .${shadowClassNames.LEFT_SHADOW}::before, .${shadowClassNames.LEFT_SHADOW}::after`]:
		{
			display: 'none',
			position: 'absolute',
			pointerEvents: 'none',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			zIndex: akEditorShadowZIndex,
			width: `${shadowWidth}px`,
			content: "''",
			height: 'calc(100%)',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`& .${shadowClassNames.RIGHT_SHADOW}, .${shadowClassNames.LEFT_SHADOW}`]: {
		position: 'relative',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`& .${shadowClassNames.LEFT_SHADOW}::before`]: {
		background: `linear-gradient( to left, transparent 0, ${token(
			'elevation.shadow.overflow.spread',
			N40A,
		)} 140% ), linear-gradient( to right, ${token(
			'elevation.shadow.overflow.perimeter',
			'transparent',
		)} 0px, transparent 1px )`,
		top: '0px',
		left: 0,
		display: 'block',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`& .${shadowClassNames.RIGHT_SHADOW}::after`]: {
		background: `linear-gradient( to right, transparent 0, ${token(
			'elevation.shadow.overflow.spread',
			N40A,
		)} 140% ), linear-gradient( to left, ${token(
			'elevation.shadow.overflow.perimeter',
			'transparent',
		)} 0px, transparent 1px )`,
		right: '0px',
		top: '0px',
		display: 'block',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`& .${shadowObserverClassNames.SENTINEL_LEFT}`]: {
		height: '100%',
		width: '0px',
		minWidth: '0px',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`& .${shadowObserverClassNames.SENTINEL_RIGHT}`]: {
		height: '100%',
		width: '0px',
		minWidth: '0px',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export { shadowSharedStyle };
