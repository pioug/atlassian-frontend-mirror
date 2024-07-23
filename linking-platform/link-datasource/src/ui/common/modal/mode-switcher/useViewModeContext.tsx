/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { createContext, useContext, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { DisplayViewModes } from '../../../../common/types';

interface ViewModeHookState {
	currentViewMode: DisplayViewModes;
	setCurrentViewMode: (selectedMode: DisplayViewModes) => void;
}

const ViewModeContext = createContext<ViewModeHookState | null>(null);

export const DatasourceViewModeProvider = ({
	viewMode: initialViewMode,
	children,
}: {
	viewMode: DisplayViewModes;
	children: React.ReactNode;
}) => {
	const [currentViewMode, setCurrentViewMode] = useState<DisplayViewModes>(initialViewMode);

	const value = useMemo(
		() => ({ currentViewMode, setCurrentViewMode }),
		[currentViewMode, setCurrentViewMode],
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
