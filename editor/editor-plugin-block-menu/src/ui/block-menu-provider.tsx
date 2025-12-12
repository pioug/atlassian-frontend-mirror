import React, { useCallback, createContext, useContext, useRef } from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

export type Direction = 'moveUp' | 'moveDown';

type BlockMenuProviderProps = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	children: React.ReactNode;
};

export type BlockMenuContextType = {
	moveDownRef: React.MutableRefObject<HTMLButtonElement | null>;
	moveUpRef: React.MutableRefObject<HTMLButtonElement | null>;
	/**
	 * Callback for when the dropdown is open/closed. Receives an object with `isOpen` state.
	 *
	 * If the dropdown was closed programmatically, the `event` parameter will be `null`.
	 */
	onDropdownOpenChanged: (isOpen: boolean) => void;
};

const BlockMenuContext = createContext<BlockMenuContextType>({
	onDropdownOpenChanged: () => {},
	moveDownRef: React.createRef<HTMLButtonElement>(),
	moveUpRef: React.createRef<HTMLButtonElement>(),
});

export const useBlockMenu = () => {
	const context = useContext(BlockMenuContext);

	if (!context) {
		throw new Error('useBlockMenu must be used within BlockMenuProvider');
	}

	return context;
};

export const BlockMenuProvider = ({ children, api }: BlockMenuProviderProps): React.JSX.Element => {
	const moveUpRef = useRef<HTMLButtonElement | null>(null);
	const moveDownRef = useRef<HTMLButtonElement | null>(null);

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

	return (
		<BlockMenuContext.Provider
			value={{
				onDropdownOpenChanged,
				moveDownRef,
				moveUpRef,
			}}
		>
			{children}
		</BlockMenuContext.Provider>
	);
};
