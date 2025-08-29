import React, { createContext, useContext, useState } from 'react';

import { conditionalHooksFactory } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

interface ToolbarDropdownMenuContextValue {
	closeMenu: () => void;
	isOpen: boolean;
	openMenu: () => void;
}

const ToolbarDropdownMenuContext = createContext<ToolbarDropdownMenuContextValue | undefined>(
	undefined,
);

export const useToolbarDropdownMenuOld = () => {
	const context = useContext(ToolbarDropdownMenuContext);
	if (!context) {
		throw new Error('useToolbarDropdownMenu must be used within ToolbarDropdownMenuProvider');
	}
	return context;
};

export const useToolbarDropdownMenuNew = () => {
	return useContext(ToolbarDropdownMenuContext);
};

export const useToolbarDropdownMenu = conditionalHooksFactory(
	() => expValEquals('platform_editor_toolbar_aifc_patch_1', 'isEnabled', true),
	useToolbarDropdownMenuNew,
	useToolbarDropdownMenuOld,
);

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
