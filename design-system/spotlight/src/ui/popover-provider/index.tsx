import React, { type ReactNode } from 'react';

import { Manager } from '@atlaskit/popper';

/**
 * __Popover provider__
 *
 * A popover provider provides necesary context for the `PopoverContent` and `PopoverTarget` components.
 *
 */
export const PopoverProvider = ({ children }: { children: ReactNode }) => {
	return <Manager>{children}</Manager>;
};
