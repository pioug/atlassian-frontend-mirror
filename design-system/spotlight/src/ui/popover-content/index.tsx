/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useContext, useEffect } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Popper, type Placement as PopperPlacement } from '@atlaskit/popper';

import { SpotlightContext } from '../../controllers/context';
import type { Placement } from '../../types';

const styles = cssMap({
	root: {
		zIndex: 700,
	},
});

const visibilityStyles = cssMap({
	visible: {
		pointerEvents: 'auto',
		visibility: 'visible',
	},
	hidden: {
		pointerEvents: 'none',
		visibility: 'hidden',
	},
});

/**
 * The `transform: rotate(45deg);` styles used to rotate the `Caret` component result in the corners of
 * the caret extending beyond the bounding box (by roughly 2px). So, apply an offset to ensure
 * the caret points to the very edge of the target element.
 *
 * Note: `@atlaskit/popper` maps the offset to to the placement, so we only need to define `[0, 2]` and
 * the offset will get correctly rotated depending on the placement.
 */
const offset: [number, number] = [0, 2];

interface PopoverContentProps {
	placement: Placement;
	isVisible?: boolean;
	children: ReactNode;
}

/**
 * The Spotlight card can be positioned in many different configurations, but the caret should always point to
 * the center of the target element. `@atlaskit/popper` uses `'top' | 'right' | 'bottom' | 'left'` values for
 * this center alignment along the respective face. So we translate between the Spotlight position, and the
 * Popper position using this map.
 */
const popperPlacementMap: Record<
	Placement,
	Extract<PopperPlacement, 'top' | 'right' | 'bottom' | 'left'>
> = {
	'top-start': 'top',
	'top-end': 'top',
	'bottom-start': 'bottom',
	'bottom-end': 'bottom',
	'right-start': 'right',
	'right-end': 'right',
	'left-start': 'left',
	'left-end': 'left',
};

/**
 * __PopoverContent__
 *
 * A `PopoverContent` is the element that is shown as a popover.
 */
export const PopoverContent = ({ children, placement, isVisible = true }: PopoverContentProps) => {
	const { setPlacement } = useContext(SpotlightContext);
	const visibility = isVisible ? 'visible' : 'hidden';

	useEffect(() => {
		setPlacement(placement);
	}, [placement, setPlacement]);

	return (
		<Popper offset={offset} placement={popperPlacementMap[placement]}>
			{({ ref, style }) => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				<div ref={ref} style={style} css={[styles.root, visibilityStyles[visibility]]}>
					{children}
				</div>
			)}
		</Popper>
	);
};
