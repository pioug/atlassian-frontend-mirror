/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import {
	BANNER_HEIGHT,
	DEFAULT_TOP_NAVIGATION_HEIGHT,
	LEFT_PANEL_WIDTH,
	RIGHT_PANEL_WIDTH,
	TOP_NAVIGATION,
	TOP_NAVIGATION_HEIGHT,
	VAR_TOP_NAVIGATION_HEIGHT,
} from '../../common/constants';
import { type SlotHeightProps } from '../../common/types';
import { getPageLayoutSlotSelector, resolveDimension } from '../../common/utils';
import { publishGridState, useSkipLink } from '../../controllers';

import SlotFocusRing from './internal/slot-focus-ring';
import SlotDimensions from './slot-dimensions';

const topNavigationStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: TOP_NAVIGATION_HEIGHT,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	gridArea: TOP_NAVIGATION,
});

const fixedStyles = css({
	position: 'fixed',
	zIndex: 2,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	insetBlockStart: BANNER_HEIGHT,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	insetInlineEnd: RIGHT_PANEL_WIDTH,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	insetInlineStart: LEFT_PANEL_WIDTH,
});

/**
 * __Top navigation__
 *
 * Provides a slot for top navigation within the PageLayout.
 *
 * - [Examples](https://atlassian.design/components/page-layout/examples)
 * - [Code](https://atlassian.design/components/page-layout/code)
 */
const TopNavigation = (props: SlotHeightProps) => {
	const {
		children,
		height = DEFAULT_TOP_NAVIGATION_HEIGHT,
		isFixed = true,
		shouldPersistHeight,
		testId,
		id,
		skipLinkTitle,
	} = props;

	const topNavigationHeight = resolveDimension(
		VAR_TOP_NAVIGATION_HEIGHT,
		height,
		shouldPersistHeight,
	);

	useEffect(() => {
		publishGridState({ [VAR_TOP_NAVIGATION_HEIGHT]: topNavigationHeight });
		return () => {
			publishGridState({ [VAR_TOP_NAVIGATION_HEIGHT]: 0 });
		};
	}, [topNavigationHeight]);

	useSkipLink(id, skipLinkTitle);

	return (
		<SlotFocusRing>
			{({ className }) => (
				<div
					css={[topNavigationStyles, isFixed && fixedStyles]}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={className}
					data-testid={testId}
					id={id}
					{...getPageLayoutSlotSelector('top-navigation')}
				>
					<SlotDimensions variableName={VAR_TOP_NAVIGATION_HEIGHT} value={topNavigationHeight} />
					{children}
				</div>
			)}
		</SlotFocusRing>
	);
};

export default TopNavigation;
