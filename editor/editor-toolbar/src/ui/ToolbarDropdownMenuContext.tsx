import React, { createContext, useContext, useState } from 'react';
interface ToolbarDropdownMenuContextValue {
	closeMenu: () => void;
	isOpen: boolean;
	openMenu: () => void;
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

	const openMenu = () => {
		if (setIsOpen !== undefined) {
			setIsOpen(true);
		} else {
			setIsOpenInternal(true);
		}
	};
	const closeMenu = () => {
		if (setIsOpen !== undefined) {
			setIsOpen(false);
		} else {
			setIsOpenInternal(false);
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
