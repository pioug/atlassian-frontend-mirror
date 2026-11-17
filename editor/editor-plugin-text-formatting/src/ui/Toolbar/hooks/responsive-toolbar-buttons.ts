import { useMemo } from 'react';

import type { ToolbarSize } from '@atlaskit/editor-common/types';

import { ToolbarButtonsStrong, ResponsiveCustomButtonToolbarMinimal } from '../constants';
import type { IconTypes, MenuIconItem } from '../types';
import { useIconList } from './use-icon-list';
import type { IconsPositions } from './use-icon-list';

export const useResponsiveIconTypeButtons = ({
	toolbarSize,
	responsivenessEnabled,
}: {
	responsivenessEnabled: boolean;
	toolbarSize: ToolbarSize;
}): IconTypes[] => {
	const iconTypeList = useMemo(
		() => ResponsiveCustomButtonToolbarMinimal[toolbarSize],
		[toolbarSize],
	);

	if (responsivenessEnabled) {
		return iconTypeList;
	}

	return ToolbarButtonsStrong;
};

export const useResponsiveToolbarButtons = ({
	icons,
	toolbarSize,
	responsivenessEnabled,
}: {
	icons: Array<MenuIconItem | null>;
	responsivenessEnabled: boolean;
	toolbarSize: ToolbarSize;
}): IconsPositions => {
	const iconTypeList = useResponsiveIconTypeButtons({
		toolbarSize,
		responsivenessEnabled,
	});

	const iconsPosition = useIconList({ icons, iconTypeList });

	return iconsPosition;
};
