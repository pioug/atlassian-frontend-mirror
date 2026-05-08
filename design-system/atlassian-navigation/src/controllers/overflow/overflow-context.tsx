/* eslint-disable @repo/internal/react/require-jsdoc */
import React, { createContext } from 'react';

import noop from '@atlaskit/ds-lib/noop';

export interface OverflowContext {
	/**
	 * Returns `true` when the navigation item is visible,
	 * and `false` when the navigation item has been pushed into the overflow menu.
	 */
	isVisible: boolean;
	/**
	 * Method that can be used to programmatically open the overflow menu
	 */
	openOverflowMenu: () => void;
	/**
	 * Method that can be used to programmatically close the overflow menu
	 */
	closeOverflowMenu: () => void;
}

export const OverflowContext: React.Context<OverflowContext> = createContext({
	isVisible: true as boolean,
	openOverflowMenu: noop,
	closeOverflowMenu: noop,
});
