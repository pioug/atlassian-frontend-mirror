/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { jsx } from '@atlaskit/css';
import { Manager } from '@atlaskit/popper';

import { SpotlightContextProvider } from '../../controllers/context';

interface PopoverProviderProps {
	/**
	 * The to be rendered in `PopoverProvider`. This is intended to be `PopoverContent`, and `PopoverTarget`.
	 */
	children: ReactNode;
}

/**
 * __Popover provider__
 *
 * A popover provider provides necesary context for the `PopoverContent` and `PopoverTarget` components.
 *
 */
export const PopoverProvider = ({ children }: PopoverProviderProps) => {
	return (
		<SpotlightContextProvider>
			<Manager>{children}</Manager>
		</SpotlightContextProvider>
	);
};
