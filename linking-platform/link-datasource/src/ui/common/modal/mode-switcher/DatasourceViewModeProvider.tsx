import React, { useMemo, useState } from 'react';

import type { DisplayViewModes } from '../../../../common/types';

import { ViewModeContext } from './useViewModeContext';

export const DatasourceViewModeProvider = ({
	viewMode: initialViewMode,
	disableDisplayDropdown,
	children,
}: {
	children: React.ReactNode;
	disableDisplayDropdown: boolean;
	viewMode: DisplayViewModes;
}): React.JSX.Element => {
	const [currentViewMode, setCurrentViewMode] = useState<DisplayViewModes>(initialViewMode);

	const value = useMemo(
		() => ({ currentViewMode, setCurrentViewMode, disableDisplayDropdown }),
		[currentViewMode, setCurrentViewMode, disableDisplayDropdown],
	);

	return <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>;
};
