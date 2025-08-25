import React, { createContext, useContext, useMemo, useState } from 'react';

import type { DisplayViewModes } from '../../../../common/types';

interface ViewModeHookState {
	currentViewMode: DisplayViewModes;
	disableDisplayDropdown: boolean;
	setCurrentViewMode: (selectedMode: DisplayViewModes) => void;
}

const ViewModeContext = createContext<ViewModeHookState | null>(null);

export const DatasourceViewModeProvider = ({
	viewMode: initialViewMode,
	disableDisplayDropdown,
	children,
}: {
	children: React.ReactNode;
	disableDisplayDropdown: boolean;
	viewMode: DisplayViewModes;
}) => {
	const [currentViewMode, setCurrentViewMode] = useState<DisplayViewModes>(initialViewMode);

	const value = useMemo(
		() => ({ currentViewMode, setCurrentViewMode, disableDisplayDropdown }),
		[currentViewMode, setCurrentViewMode, disableDisplayDropdown],
	);

	return <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>;
};

export const useViewModeContext = () => {
	const value = useContext(ViewModeContext);
	if (!value) {
		throw new Error('useViewModeContext must be called within DatasourceViewModeProvider');
	}
	return value;
};
