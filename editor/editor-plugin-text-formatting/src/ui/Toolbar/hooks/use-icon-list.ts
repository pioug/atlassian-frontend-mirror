import { useMemo } from 'react';

import type { IconTypes, MenuIconItem } from '../types';

interface UseIconsParams {
	icons: Array<MenuIconItem | null>;
	iconTypeList: IconTypes[];
}

export type IconsPositions = {
	dropdownItems: Array<MenuIconItem>;
	singleItems: Array<MenuIconItem>;
};

export const useIconList = ({ icons, iconTypeList }: UseIconsParams) => {
	return useMemo(() => {
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
};
