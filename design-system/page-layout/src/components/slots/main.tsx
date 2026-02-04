/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useContext } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';

import { prefersReducedMotion } from '@atlaskit/motion/accessibility';
import { easeOut } from '@atlaskit/motion/curves';

import {
	COLLAPSED_LEFT_SIDEBAR_WIDTH,
	DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH,
	TRANSITION_DURATION,
	VAR_LEFT_SIDEBAR_FLYOUT,
} from '../../common/constants';
import { useIsSidebarDragging } from '../../common/hooks';
import { type SlotWidthProps } from '../../common/types';
import { getPageLayoutSlotSelector } from '../../common/utils';
import { SidebarResizeContext, useSkipLink } from '../../controllers';

import SlotFocusRing from './internal/slot-focus-ring';

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const prefersReducedMotionStyles = css(prefersReducedMotion());

const mainStyles = css({
	minWidth: 0,
	flexGrow: 1,
	marginInlineStart: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	transition: `margin-left ${TRANSITION_DURATION}ms ${easeOut} 0s`,
});

const draggingStyles = css({
	// Make sure drag to resize remains snappy.
	transition: 'none',
});

/**
 * Adds a negative left margin to main,
 * which transitions at the same speed as the left sidebar's width increase.
 * This give an illusion that the flyout is appearing on top of the main content,
 * while main remains in place.
 */
const flyoutStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginInlineStart: `calc(-1 * var(--${VAR_LEFT_SIDEBAR_FLYOUT}, ${DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH}px) + ${COLLAPSED_LEFT_SIDEBAR_WIDTH}px)`,
});

/**
 * __Main__
 *
 * Provides a slot for main content within the PageLayout.
 *
 * - [Examples](https://atlassian.design/components/page-layout/examples)
 * - [Code](https://atlassian.design/components/page-layout/code)
 */
const Main = (props: SlotWidthProps): jsx.JSX.Element => {
	const { children, testId, id, skipLinkTitle } = props;

	useSkipLink(id, skipLinkTitle);

	const isDragging = useIsSidebarDragging();
	const {
		leftSidebarState: { isFlyoutOpen, isFixed },
	} = useContext(SidebarResizeContext);

	return (
		<SlotFocusRing>
			{({ className }) => (
				<main
					data-testid={testId}
					css={[
						mainStyles,
						isDragging && draggingStyles,
						isFlyoutOpen && !isFixed && flyoutStyles,
						prefersReducedMotionStyles,
					]}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={className}
					id={id}
					{...getPageLayoutSlotSelector('main')}
				>
					{children}
				</main>
			)}
		</SlotFocusRing>
	);
};

export default Main;
