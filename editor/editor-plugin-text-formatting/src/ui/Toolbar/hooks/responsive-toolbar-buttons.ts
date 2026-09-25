import { useMemo } from 'react';

import type { ToolbarSize } from '@atlaskit/editor-common/types';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';

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
import { useIconList } from './use-icon-list';
import type { IconsPositions } from './use-icon-list';

export const useResponsiveIconTypeButtons = ({
	toolbarSize,
	responsivenessEnabled,
}: {
	responsivenessEnabled: boolean;
	toolbarSize: ToolbarSize;
}): IconTypes[] => {
	let ResponsiveCustomButtonToolbar: Record<ToolbarSize, IconTypes[]> =
		ResponsiveCustomButtonToolbarCompact;
	if (editorExperiment('platform_editor_controls', 'variant1')) {
		ResponsiveCustomButtonToolbar = ResponsiveCustomButtonToolbarMinimal;
	}

	const iconTypeList = useMemo(
		() => ResponsiveCustomButtonToolbar[toolbarSize],
		[toolbarSize, ResponsiveCustomButtonToolbar],
	);

	if (responsivenessEnabled) {
		return iconTypeList;
	}

	if (editorExperiment('platform_editor_controls', 'variant1')) {
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
}): IconTypes[] => {
	let ResponsiveCustomMenu: Record<ToolbarSize, IconTypes[]> = ResponsiveCustomMenuCompact;
	if (editorExperiment('platform_editor_controls', 'variant1')) {
		ResponsiveCustomMenu = ResponsiveCustomMenuMinimal;
	}

	const iconTypeList = useMemo(
		() => ResponsiveCustomMenu[toolbarSize],
		[toolbarSize, ResponsiveCustomMenu],
	);

	if (responsivenessEnabled) {
		return iconTypeList;
	}

	if (editorExperiment('platform_editor_controls', 'variant1')) {
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
