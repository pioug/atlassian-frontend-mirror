import React, { type ReactNode, useContext } from 'react';

import { Popper, type Placement as PopperPlacement } from '@atlaskit/popper';

import { SpotlightContext } from '../../controllers/context';
import type { Placement } from '../../types';

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
export const PopoverContent = ({
	children,
	placement,
}: {
	children: ReactNode;
	placement: Placement;
}) => {
	const { setPlacement } = useContext(SpotlightContext);
	setPlacement(placement);

	return (
		<Popper offset={[0, 0]} placement={popperPlacementMap[placement]}>
			{({ ref, style }) => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				<div ref={ref} style={style}>
					{children}
				</div>
			)}
		</Popper>
	);
};
