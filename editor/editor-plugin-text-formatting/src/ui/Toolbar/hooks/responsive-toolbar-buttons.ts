import { useMemo } from 'react';

import type { ToolbarSize } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import {
	ButtonsMenuMinimal,
	ButtonsMenuCompact,
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
	toolbarSize: ToolbarSize;
	responsivenessEnabled: boolean;
}) => {
	let ResponsiveCustomButtonToolbar: Record<ToolbarSize, IconTypes[]> =
		ResponsiveCustomButtonToolbarCompact;
	if (expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1')) {
		if (fg('platform_editor_controls_patch_13')) {
			ResponsiveCustomButtonToolbar = ResponsiveCustomButtonToolbarMinimal;
		} else {
			ResponsiveCustomButtonToolbar = ResponsiveCustomButtonToolbarCompact;
		}
	}

	const iconTypeList = useMemo(
		() => ResponsiveCustomButtonToolbar[toolbarSize],
		[toolbarSize, ResponsiveCustomButtonToolbar],
	);

	if (responsivenessEnabled) {
		return iconTypeList;
	}

	if (expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1')) {
		if (fg('platform_editor_controls_patch_13')) {
			return ToolbarButtonsStrong;
		} else {
			return ToolbarButtonsStrongItalic;
		}
	} else {
		return ToolbarButtonsStrongItalic;
	}
};

export const useResponsiveIconTypeMenu = ({
	toolbarSize,
	responsivenessEnabled,
}: {
	toolbarSize: ToolbarSize;
	responsivenessEnabled: boolean;
}) => {
	let ResponsiveCustomMenu: Record<ToolbarSize, IconTypes[]> = ResponsiveCustomMenuCompact;
	if (expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1')) {
		if (fg('platform_editor_controls_patch_13')) {
			ResponsiveCustomMenu = ResponsiveCustomMenuMinimal;
		} else {
			ResponsiveCustomMenu = ResponsiveCustomMenuCompact;
		}
	}

	const iconTypeList = useMemo(
		() => ResponsiveCustomMenu[toolbarSize],
		[toolbarSize, ResponsiveCustomMenu],
	);

	if (responsivenessEnabled) {
		return iconTypeList;
	}

	if (expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1')) {
		if (fg('platform_editor_controls_patch_13')) {
			return ButtonsMenuMinimal;
		} else {
			return ButtonsMenuCompact;
		}
	} else {
		return ToolbarButtonsStrongItalic;
	}
};

export const useResponsiveToolbarButtons = ({
	icons,
	toolbarSize,
	responsivenessEnabled,
}: {
	responsivenessEnabled: boolean;
	toolbarSize: ToolbarSize;
	icons: Array<MenuIconItem | null>;
}): IconsPositions => {
	const iconTypeList = useResponsiveIconTypeButtons({
		toolbarSize,
		responsivenessEnabled,
	});

	const iconsPosition = useIconList({ icons, iconTypeList });

	return iconsPosition;
};
