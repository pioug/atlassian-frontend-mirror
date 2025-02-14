import React, { createContext, useContext, useMemo, useState } from 'react';

import type { DisplayViewModes } from '../../../../common/types';

interface ViewModeHookState {
	currentViewMode: DisplayViewModes;
	setCurrentViewMode: (selectedMode: DisplayViewModes) => void;
	disableDisplayDropdown: boolean;
}

const ViewModeContext = createContext<ViewModeHookState | null>(null);

export const DatasourceViewModeProvider = ({
	viewMode: initialViewMode,
	disableDisplayDropdown,
	children,
}: {
	viewMode: DisplayViewModes;
	disableDisplayDropdown: boolean;
	children: React.ReactNode;
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
