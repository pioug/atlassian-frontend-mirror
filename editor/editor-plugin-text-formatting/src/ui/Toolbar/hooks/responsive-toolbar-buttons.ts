import { useMemo } from 'react';

import type { ToolbarSize } from '@atlaskit/editor-common/types';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import {
	ButtonsMenuMinimal,
	ToolbarButtonsStrong,
	ToolbarButtonsStrongItalic,
	ResponsiveCustomButtonToolbarMinimal,
	ResponsiveCustomButtonToolbarCompact,
	ResponsiveCustomMenuMinimal,
	ResponsiveCustomMenuCompact,
} from '../constants';
import type { IconTypes, MenuIconItem } from '../types';

import { type IconsPositions, useIconList } from './use-icon-list';

export const useResponsiveIconTypeButtons = ({
	toolbarSize,
	responsivenessEnabled,
}: {
	responsivenessEnabled: boolean;
	toolbarSize: ToolbarSize;
}) => {
	let ResponsiveCustomButtonToolbar: Record<ToolbarSize, IconTypes[]> =
		ResponsiveCustomButtonToolbarCompact;
	if (expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1')) {
		ResponsiveCustomButtonToolbar = ResponsiveCustomButtonToolbarMinimal;
	}

	const iconTypeList = useMemo(
		() => ResponsiveCustomButtonToolbar[toolbarSize],
		[toolbarSize, ResponsiveCustomButtonToolbar],
	);

	if (responsivenessEnabled) {
		return iconTypeList;
	}

	if (expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1')) {
		return ToolbarButtonsStrong;
	} else {
		return ToolbarButtonsStrongItalic;
	}
};

export const useResponsiveIconTypeMenu = ({
	toolbarSize,
	responsivenessEnabled,
}: {
	responsivenessEnabled: boolean;
	toolbarSize: ToolbarSize;
}) => {
	let ResponsiveCustomMenu: Record<ToolbarSize, IconTypes[]> = ResponsiveCustomMenuCompact;
	if (expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1')) {
		ResponsiveCustomMenu = ResponsiveCustomMenuMinimal;
	}

	const iconTypeList = useMemo(
		() => ResponsiveCustomMenu[toolbarSize],
		[toolbarSize, ResponsiveCustomMenu],
	);

	if (responsivenessEnabled) {
		return iconTypeList;
	}

	if (expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1')) {
		return ButtonsMenuMinimal;
	} else {
		return ToolbarButtonsStrongItalic;
	}
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
