import { useMemo } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { IconTypes, MenuIconItem } from '../types';

interface UseIconsParams {
	icons: Array<MenuIconItem | null>;
	iconTypeList: IconTypes[];
	shouldUnselect?: boolean;
}

export type IconsPositions = {
	dropdownItems: Array<MenuIconItem>;
	singleItems: Array<MenuIconItem>;
};

export const useIconList = ({ icons, iconTypeList, shouldUnselect }: UseIconsParams) => {
	return useMemo(() => {
		return icons.reduce<IconsPositions>(
			(acc, icon) => {
				if (!icon || !icon.iconMark) {
					return acc;
				}
				if (
					// eslint-disable-next-line @atlaskit/platform/no-preconditioning
					shouldUnselect &&
					icon.isActive &&
					editorExperiment('platform_editor_controls', 'variant1') &&
					!fg('platform_editor_controls_patch_10')
				) {
					icon.isActive = false;
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
	}, [icons, shouldUnselect, iconTypeList]);
};
