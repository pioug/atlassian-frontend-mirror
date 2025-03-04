import { useMemo } from 'react';

import type { ToolbarSize } from '@atlaskit/editor-common/types';
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

export const useResponsiveIconTypeButtons = ({
	toolbarSize,
	responsivenessEnabled,
}: {
	toolbarSize: ToolbarSize;
	responsivenessEnabled: boolean;
}) => {
	const ResponsiveCustomButtonToolbar = editorExperiment('platform_editor_controls', 'variant1')
		? ResponsiveCustomButtonToolbarNext
		: ResponsiveCustomButtonToolbarLegacy;
	const iconTypeList = useMemo(
		() => ResponsiveCustomButtonToolbar[toolbarSize],
		[toolbarSize, ResponsiveCustomButtonToolbar],
	);

	if (responsivenessEnabled) {
		return iconTypeList;
	}

	return editorExperiment('platform_editor_controls', 'variant1')
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
	const ResponsiveCustomMenu = editorExperiment('platform_editor_controls', 'variant1')
		? ResponsiveCustomMenuNext
		: ResponsiveCustomMenuLegacy;
	const iconTypeList = useMemo(
		() => ResponsiveCustomMenu[toolbarSize],
		[toolbarSize, ResponsiveCustomMenu],
	);

	if (responsivenessEnabled) {
		return iconTypeList;
	}

	return editorExperiment('platform_editor_controls', 'variant1')
		? DefaultButtonsMenuNext
		: DefaultButtonsMenu;
};

type IconsPositions = {
	dropdownItems: Array<MenuIconItem>;
	singleItems: Array<MenuIconItem>;
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
	const iconsPosition = useMemo(() => {
		return icons.reduce<IconsPositions>(
			(acc, icon) => {
				if (!icon || !icon.iconMark) {
					return acc;
				}

				const isIconSingleButton = iconTypeList.includes(icon.iconMark);

				if (isIconSingleButton) {
					return {
						dropdownItems: acc.dropdownItems,
						singleItems: [...acc.singleItems, icon],
					};
				}

				return {
					dropdownItems: [...acc.dropdownItems, icon],
					singleItems: acc.singleItems,
				};
			},
			{ dropdownItems: [], singleItems: [] },
		);
	}, [icons, iconTypeList]);

	return iconsPosition;
};
