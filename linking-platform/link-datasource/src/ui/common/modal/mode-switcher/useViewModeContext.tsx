import React, { createContext, useContext } from 'react';

import type { DisplayViewModes } from '../../../../common/types';

interface ViewModeHookState {
	currentViewMode: DisplayViewModes;
	disableDisplayDropdown: boolean;
	setCurrentViewMode: (selectedMode: DisplayViewModes) => void;
}

export const ViewModeContext: React.Context<ViewModeHookState | null> =
	createContext<ViewModeHookState | null>(null);

export const useViewModeContext = (): ViewModeHookState => {
	const value = useContext(ViewModeContext);
	if (!value) {
		throw new Error('useViewModeContext must be called within DatasourceViewModeProvider');
	}
	return value;
};
