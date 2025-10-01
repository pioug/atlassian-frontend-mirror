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
}

export const ToolbarDropdownMenuProvider = ({ children }: ToolbarDropdownMenuProviderProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const openMenu = () => setIsOpen(true);
	const closeMenu = () => {
		setIsOpen(false);
	};

	const contextValue: ToolbarDropdownMenuContextValue = {
		openMenu,
		closeMenu,
		isOpen,
	};

	return (
		<ToolbarDropdownMenuContext.Provider value={contextValue}>
			{children}
		</ToolbarDropdownMenuContext.Provider>
	);
};
