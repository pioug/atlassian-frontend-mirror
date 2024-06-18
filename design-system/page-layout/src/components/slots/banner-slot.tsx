/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { useEffect } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import {
	BANNER,
	BANNER_HEIGHT,
	DEFAULT_BANNER_HEIGHT,
	LEFT_PANEL_WIDTH,
	RIGHT_PANEL_WIDTH,
	VAR_BANNER_HEIGHT,
} from '../../common/constants';
import { type SlotHeightProps } from '../../common/types';
import { getPageLayoutSlotSelector, resolveDimension } from '../../common/utils';
import { publishGridState, useSkipLink } from '../../controllers';

import SlotFocusRing from './internal/slot-focus-ring';
import SlotDimensions from './slot-dimensions';

const bannerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: BANNER_HEIGHT,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	gridArea: BANNER,
});

const bannerFixedStyles = css({
	position: 'fixed',
	zIndex: 2,
	insetBlockStart: 0,
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	insetInlineEnd: RIGHT_PANEL_WIDTH,
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	insetInlineStart: LEFT_PANEL_WIDTH,
});

/**
 * __Banner__
 *
 * Provides a slot for a Banner within the PageLayout.
 *
 * - [Examples](https://atlassian.design/components/page-layout/examples)
 * - [Code](https://atlassian.design/components/page-layout/code)
 */
const Banner = (props: SlotHeightProps) => {
	const {
		children,
		height = DEFAULT_BANNER_HEIGHT,
		isFixed = true,
		shouldPersistHeight,
		testId,
		skipLinkTitle,
		id,
	} = props;

	const bannerHeight = resolveDimension(VAR_BANNER_HEIGHT, height, shouldPersistHeight);

	useEffect(() => {
		publishGridState({ [VAR_BANNER_HEIGHT]: bannerHeight });
		return () => {
			publishGridState({ [VAR_BANNER_HEIGHT]: 0 });
		};
	}, [bannerHeight]);

	useSkipLink(id, skipLinkTitle);

	return (
		<SlotFocusRing>
			{({ className }) => (
				<div
					css={[bannerStyles, isFixed && bannerFixedStyles]}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={className}
					data-testid={testId}
					id={id}
					{...getPageLayoutSlotSelector('banner')}
				>
					<SlotDimensions variableName={VAR_BANNER_HEIGHT} value={bannerHeight} />
					{children}
				</div>
			)}
		</SlotFocusRing>
	);
};

export default Banner;
