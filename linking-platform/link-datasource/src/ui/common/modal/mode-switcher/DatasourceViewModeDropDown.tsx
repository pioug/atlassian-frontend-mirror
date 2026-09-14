/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import { DatasourceAction } from '../../../../analytics/types';
import type { DisplayViewModes } from '../../../../common/types';
import { useUserInteractions } from '../../../../contexts/user-interactions/use-user-interactions';
import { DisplayViewDropDown } from '../display-view-dropdown/display-view-drop-down';

import { useViewModeContext } from './useViewModeContext';

export const DatasourceViewModeDropDown = (): JSX.Element | null => {
	const userInteractions = useUserInteractions();
	const { currentViewMode, setCurrentViewMode, disableDisplayDropdown } = useViewModeContext();
	if (disableDisplayDropdown) {
		return null;
	}

	const handleViewModeChange = (selectedMode: DisplayViewModes) => {
		userInteractions.add(DatasourceAction.DISPLAY_VIEW_CHANGED);
		setCurrentViewMode(selectedMode);
	};

	return <DisplayViewDropDown onViewModeChange={handleViewModeChange} viewMode={currentViewMode} />;
};
