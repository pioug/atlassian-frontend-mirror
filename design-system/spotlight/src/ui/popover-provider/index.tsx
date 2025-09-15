/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { jsx } from '@atlaskit/css';
import { Manager } from '@atlaskit/popper';

import { SpotlightContextProvider } from '../../controllers/context';

/**
 * __Popover provider__
 *
 * A popover provider provides necesary context for the `PopoverContent` and `PopoverTarget` components.
 *
 */
export const PopoverProvider = ({ children }: { children: ReactNode }) => {
	return (
		<SpotlightContextProvider>
			<Manager>{children}</Manager>
		</SpotlightContextProvider>
	);
};
