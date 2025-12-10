import React, { createContext, useContext } from 'react';

import type { OnOpenChangeArgs } from '@atlaskit/dropdown-menu';

import type { ToolbarKeyboardNavigationProviderConfig } from '../types';

type AnalyticsEventPayload = {
	action: string;
	actionSubject?: string;
	actionSubjectId?: string;
	eventType: string;
};

type FireAnalyticsEvent = (payload: AnalyticsEventPayload) => void | undefined;

export type ToolbarUIContextType = {
	fireAnalyticsEvent?: FireAnalyticsEvent;

	/**
	 * Indicates whether the toolbar is disabled when the editor is offline.
	 */
	isDisabled?: boolean;

	/**
	 * Configuration for Keyboard Shortcuts/ Navigation
	 */
	keyboardNavigation?: ToolbarKeyboardNavigationProviderConfig;
	/**
	 * Callback for when the dropdown is open/closed. Receives an object with `isOpen` state.
	 *
	 * If the dropdown was closed programmatically, the `event` parameter will be `null`.
	 */
	onDropdownOpenChanged: (args: OnOpenChangeArgs) => void;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	/**
	 * Whether to prevent default behavior on mouse down events on ToolbarButton.
	 */
	preventDefaultOnMouseDown?: boolean;
};

const ToolbarUIContext = createContext<ToolbarUIContextType>({
	onDropdownOpenChanged: () => {},
	preventDefaultOnMouseDown: false,
	isDisabled: false,
	popupsMountPoint: undefined,
	fireAnalyticsEvent: undefined,
	keyboardNavigation: undefined,
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
	popupsBoundariesElement,
	popupsScrollableElement,
	fireAnalyticsEvent,
	keyboardNavigation,
}: ToolbarUIProviderProps): React.JSX.Element => {
	return (
		<ToolbarUIContext.Provider
			value={{
				onDropdownOpenChanged,
				preventDefaultOnMouseDown,
				isDisabled,
				popupsMountPoint,
				popupsBoundariesElement,
				popupsScrollableElement,
				fireAnalyticsEvent,
				keyboardNavigation,
			}}
		>
			{children}
		</ToolbarUIContext.Provider>
	);
};
