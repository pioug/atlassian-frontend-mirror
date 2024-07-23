/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import {
	BANNER_HEIGHT,
	DEFAULT_RIGHT_SIDEBAR_WIDTH,
	RIGHT_PANEL_WIDTH,
	RIGHT_SIDEBAR_WIDTH,
	TOP_NAVIGATION_HEIGHT,
	VAR_RIGHT_SIDEBAR_WIDTH,
} from '../../common/constants';
import { type SlotWidthProps } from '../../common/types';
import { getPageLayoutSlotSelector, resolveDimension } from '../../common/utils';
import { publishGridState, useSkipLink } from '../../controllers';

import SlotFocusRing from './internal/slot-focus-ring';
import SlotDimensions from './slot-dimensions';

/**
 * This inner wrapper is required to allow the sidebar to be `position: fixed`.
 *
 * If we were to apply `position: fixed` to the outer wrapper, it will be popped
 * out of its flex container and Main would stretch to occupy all the space.
 */
const fixedInnerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: RIGHT_SIDEBAR_WIDTH,
	position: 'fixed',
	insetBlockEnd: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	insetBlockStart: `calc(${BANNER_HEIGHT} + ${TOP_NAVIGATION_HEIGHT})`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	insetInlineEnd: `calc(${RIGHT_PANEL_WIDTH})`,
});

const staticInnerStyles = css({ height: '100%' });

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const outerStyles = css({ width: RIGHT_SIDEBAR_WIDTH });

/**
 * In fixed mode this element's child is taken out of the document flow.
 * It doesn't take up the width as expected,
 * so the pseudo element forces it to take up the necessary width.
 */
const fixedOuterStyles = css({
	'&::after': {
		display: 'inline-block',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: RIGHT_SIDEBAR_WIDTH,
		content: "''",
	},
});

/**
 * __Right sidebar__
 *
 * Provides a slot for a right sidebar within the PageLayout.
 *
 * - [Examples](https://atlassian.design/components/page-layout/examples)
 * - [Code](https://atlassian.design/components/page-layout/code)
 */
const RightSidebar = (props: SlotWidthProps) => {
	const {
		children,
		width = DEFAULT_RIGHT_SIDEBAR_WIDTH,
		isFixed,
		shouldPersistWidth,
		testId,
		id,
		skipLinkTitle,
	} = props;

	const rightSidebarWidth = resolveDimension(VAR_RIGHT_SIDEBAR_WIDTH, width, shouldPersistWidth);

	useEffect(() => {
		publishGridState({ [VAR_RIGHT_SIDEBAR_WIDTH]: rightSidebarWidth });
		return () => {
			publishGridState({ [VAR_RIGHT_SIDEBAR_WIDTH]: 0 });
		};
	}, [rightSidebarWidth, id]);

	useSkipLink(id, skipLinkTitle);

	return (
		<SlotFocusRing isSidebar>
			{({ className }) => (
				<div
					data-testid={testId}
					css={[outerStyles, isFixed && fixedOuterStyles]}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={className}
					id={id}
					{...getPageLayoutSlotSelector('right-sidebar')}
				>
					<SlotDimensions variableName={VAR_RIGHT_SIDEBAR_WIDTH} value={rightSidebarWidth} />
					<div css={[isFixed && fixedInnerStyles, !isFixed && staticInnerStyles]}>{children}</div>
				</div>
			)}
		</SlotFocusRing>
	);
};

export default RightSidebar;
