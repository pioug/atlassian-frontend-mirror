import React, {
	createContext,
	useContext,
	useState,
	type KeyboardEvent,
	type MouseEvent,
} from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { useToolbarUI } from '../hooks/ui-context';

interface ToolbarDropdownMenuContextValue {
	closeMenu: (event: Event | MouseEvent | KeyboardEvent | null) => void;
	isOpen: boolean;
	openMenu: (event: Event | MouseEvent | KeyboardEvent | null) => void;
}

const ToolbarDropdownMenuContext = createContext<ToolbarDropdownMenuContextValue | undefined>(
	undefined,
);

export const useToolbarDropdownMenu = () => {
	return useContext(ToolbarDropdownMenuContext);
};

interface ToolbarDropdownMenuProviderProps {
	children: React.ReactNode;
	isOpen?: boolean;
	setIsOpen?: (isOpen: boolean) => void;
}

export const ToolbarDropdownMenuProvider = ({
	children,
	isOpen,
	setIsOpen,
}: ToolbarDropdownMenuProviderProps) => {
	const [isOpenInternal, setIsOpenInternal] = useState(false);
	const { onDropdownOpenChanged } = useToolbarUI();

	const openMenu = (event: Event | MouseEvent | KeyboardEvent | null) => {
		if (setIsOpen !== undefined) {
			setIsOpen(true);
		} else {
			setIsOpenInternal(true);
		}
		if (fg('platform_editor_toolbar_highlight_bug_fix')) {
			onDropdownOpenChanged({ isOpen: true, event: event });
		}
	};
	const closeMenu = (event: Event | MouseEvent | KeyboardEvent | null) => {
		if (setIsOpen !== undefined) {
			setIsOpen(false);
		} else {
			setIsOpenInternal(false);
		}
		if (fg('platform_editor_toolbar_highlight_bug_fix')) {
			onDropdownOpenChanged({ isOpen: false, event: event });
		}
	};

	const contextValue: ToolbarDropdownMenuContextValue = {
		openMenu,
		closeMenu,
		isOpen: isOpen !== undefined ? isOpen : isOpenInternal,
	};

	return (
		<ToolbarDropdownMenuContext.Provider value={contextValue}>
			{children}
		</ToolbarDropdownMenuContext.Provider>
	);
};
