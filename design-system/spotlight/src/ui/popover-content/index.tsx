import React, { type ReactNode } from 'react';

import { Popper } from '@atlaskit/popper';

import type { Placement } from '../../types';

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
	return (
		<Popper placement={placement}>
			{({ ref, style }) => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				<div ref={ref} style={style}>
					{children}
				</div>
			)}
		</Popper>
	);
};
