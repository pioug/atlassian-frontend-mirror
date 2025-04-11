import { useMemo } from 'react';

import type { ToolbarSize } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import {
	DefaultButtonsMenu,
	DefaultButtonsMenuNext,
	DefaultButtonsToolbar,
	DefaultButtonsToolbarNext,
	ResponsiveCustomButtonToolbar as ResponsiveCustomButtonToolbarLegacy,
	ResponsiveCustomButtonToolbarNext,
	ResponsiveCustomMenu as ResponsiveCustomMenuLegacy,
	ResponsiveCustomMenuNext,
} from '../constants';
import type { MenuIconItem } from '../types';

import { type IconsPositions, useIconList } from './use-icon-list';

export const useResponsiveIconTypeButtons = ({
	toolbarSize,
	responsivenessEnabled,
}: {
	toolbarSize: ToolbarSize;
	responsivenessEnabled: boolean;
}) => {
	const ResponsiveCustomButtonToolbar =
		editorExperiment('platform_editor_controls', 'variant1') &&
		!fg('platform_editor_controls_patch_4')
			? ResponsiveCustomButtonToolbarNext
			: ResponsiveCustomButtonToolbarLegacy;
	const iconTypeList = useMemo(
		() => ResponsiveCustomButtonToolbar[toolbarSize],
		[toolbarSize, ResponsiveCustomButtonToolbar],
	);

	if (responsivenessEnabled) {
		return iconTypeList;
	}

	return editorExperiment('platform_editor_controls', 'variant1') &&
		!fg('platform_editor_controls_patch_4')
		? DefaultButtonsToolbarNext
		: DefaultButtonsToolbar;
};

export const useResponsiveIconTypeMenu = ({
	toolbarSize,
	responsivenessEnabled,
}: {
	toolbarSize: ToolbarSize;
	responsivenessEnabled: boolean;
}) => {
	const ResponsiveCustomMenu =
		editorExperiment('platform_editor_controls', 'variant1') &&
		!fg('platform_editor_controls_patch_4')
			? ResponsiveCustomMenuNext
			: ResponsiveCustomMenuLegacy;
	const iconTypeList = useMemo(
		() => ResponsiveCustomMenu[toolbarSize],
		[toolbarSize, ResponsiveCustomMenu],
	);

	if (responsivenessEnabled) {
		return iconTypeList;
	}

	return editorExperiment('platform_editor_controls', 'variant1') &&
		!fg('platform_editor_controls_patch_4')
		? DefaultButtonsMenuNext
		: DefaultButtonsMenu;
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
