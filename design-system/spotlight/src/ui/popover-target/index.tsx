import React, { type ReactNode } from 'react';

import { Reference } from '@atlaskit/popper';

/**
 * __Target__
 *
 * A target is the element that the popover content will be positioned in relation to.
 */
export const PopoverTarget = ({ children }: { children: ReactNode }) => {
	return <Reference>{({ ref }) => <div ref={ref}>{children}</div>}</Reference>;
};
