import React, { createContext, useContext, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

import { useToolbarUI } from '../hooks/ui-context';

interface ToolbarDropdownMenuContextValue {
	closeMenu: (event: Event | MouseEvent | KeyboardEvent | null) => void;
	isOpen: boolean;
	openMenu: (event: Event | MouseEvent | KeyboardEvent | null) => void;
}

const ToolbarDropdownMenuContext = createContext<ToolbarDropdownMenuContextValue | undefined>(
	undefined,
);

export const useToolbarDropdownMenu = (): ToolbarDropdownMenuContextValue | undefined => {
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
}: ToolbarDropdownMenuProviderProps): React.JSX.Element => {
	const [isOpenInternal, setIsOpenInternal] = useState(false);
	const { onDropdownOpenChanged } = useToolbarUI();

	const openMenu = (event: Event | MouseEvent | KeyboardEvent | null) => {
		if (setIsOpen !== undefined) {
			setIsOpen(true);
		} else {
			setIsOpenInternal(true);
		}
		onDropdownOpenChanged({ isOpen: true, event: event });
	};
	const closeMenu = (event: Event | MouseEvent | KeyboardEvent | null) => {
		if (setIsOpen !== undefined) {
			setIsOpen(false);
		} else {
			setIsOpenInternal(false);
		}
		onDropdownOpenChanged({ isOpen: false, event: event });
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
