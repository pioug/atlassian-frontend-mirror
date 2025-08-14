import React, { createContext, useContext, useState } from 'react';

interface ToolbarDropdownMenuContextValue {
	openMenu: () => void;
	closeMenu: () => void;
	isOpen: boolean;
}

const ToolbarDropdownMenuContext = createContext<ToolbarDropdownMenuContextValue | undefined>(
	undefined,
);

export const useToolbarDropdownMenu = () => {
	const context = useContext(ToolbarDropdownMenuContext);
	if (!context) {
		throw new Error('useToolbarDropdownMenu must be used within ToolbarDropdownMenuProvider');
	}
	return context;
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
