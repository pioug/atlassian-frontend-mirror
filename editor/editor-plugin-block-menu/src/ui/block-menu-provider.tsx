import React, { useCallback, createContext, useContext } from 'react';

import type { BlockMenuEventPayload } from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

type BlockMenuProviderProps = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	children: React.ReactNode;
};

type FireAnalyticsEvent = (payload: BlockMenuEventPayload) => void | undefined;

export type BlockMenuContextType = {
	fireAnalyticsEvent?: FireAnalyticsEvent;
	/**
	 * Callback for when the dropdown is open/closed. Receives an object with `isOpen` state.
	 *
	 * If the dropdown was closed programmatically, the `event` parameter will be `null`.
	 */
	onDropdownOpenChanged: (isOpen: boolean) => void;
};

const BlockMenuContext = createContext<BlockMenuContextType>({
	onDropdownOpenChanged: () => {},
	fireAnalyticsEvent: () => {},
});

export const useBlockMenu = () => {
	const context = useContext(BlockMenuContext);

	if (!context) {
		throw new Error('useBlockMenu must be used within BlockMenuProvider');
	}

	return context;
};

export const BlockMenuProvider = ({ children, api }: BlockMenuProviderProps) => {
	const onDropdownOpenChanged = useCallback(
		(isOpen: boolean) => {
			if (!isOpen) {
				// On Dropdown closed, return focus to editor
				setTimeout(
					() =>
						requestAnimationFrame(() => {
							api?.core.actions.focus({ scrollIntoView: false });
						}),
					1,
				);
			}
		},
		[api],
	);

	const fireAnalyticsEvent = useCallback(
		(payload: BlockMenuEventPayload) => {
			api?.analytics?.actions.fireAnalyticsEvent(payload);
		},
		[api],
	);

	return (
		<BlockMenuContext.Provider
			value={{
				onDropdownOpenChanged,
				fireAnalyticsEvent,
			}}
		>
			{children}
		</BlockMenuContext.Provider>
	);
};
