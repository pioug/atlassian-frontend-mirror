import React, { createContext, useContext } from 'react';

import type { OnOpenChangeArgs } from '@atlaskit/dropdown-menu';

export type ToolbarUIContextType = {
	/**
	 * Callback for when the dropdown is open/closed. Receives an object with `isOpen` state.
	 *
	 * If the dropdown was closed programmatically, the `event` parameter will be `null`.
	 */
	onDropdownOpenChanged: (args: OnOpenChangeArgs) => void;

	/**
	 * Whether to prevent default behavior on mouse down events on ToolbarButton.
	 */
	preventDefaultOnMouseDown?: boolean;

	/**
	 * Indicates whether the toolbar is disabled when the editor is offline.
	 */
	isDisabled?: boolean;
	popupsMountPoint?: HTMLElement;
};

const ToolbarUIContext = createContext<ToolbarUIContextType>({
	onDropdownOpenChanged: () => {},
	preventDefaultOnMouseDown: false,
	isDisabled: false,
	popupsMountPoint: undefined,
});

/**
 * Access consumer specific config and state within a toolbar component
 */
export const useToolbarUI = () => {
	const context = useContext(ToolbarUIContext);

	if (!context) {
		throw new Error('useToolbarUI must be used within ToolbarUIContext');
	}

	return context;
};

type ToolbarUIProviderProps = {
	children: React.ReactNode;
} & ToolbarUIContextType;

export const ToolbarUIProvider = ({
	children,
	onDropdownOpenChanged,
	preventDefaultOnMouseDown,
	isDisabled,
	popupsMountPoint,
}: ToolbarUIProviderProps) => {
	return (
		<ToolbarUIContext.Provider
			value={{ onDropdownOpenChanged, preventDefaultOnMouseDown, isDisabled, popupsMountPoint }}
		>
			{children}
		</ToolbarUIContext.Provider>
	);
};
