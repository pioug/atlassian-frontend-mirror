import { useMemo } from 'react';

import type { ToolbarSize } from '@atlaskit/editor-common/types';

import {
  DefaultButtonsMenu,
  DefaultButtonsToolbar,
  ResponsiveCustomButtonToolbar,
  ResponsiveCustomMenu,
} from '../constants';
import type { MenuIconItem } from '../types';

export const useResponsiveIconTypeButtons = ({
  toolbarSize,
  responsivenessEnabled,
}: {
  toolbarSize: ToolbarSize;
  responsivenessEnabled: boolean;
}) => {
  const iconTypeList = useMemo(
    () => ResponsiveCustomButtonToolbar[toolbarSize],
    [toolbarSize],
  );

  return responsivenessEnabled ? iconTypeList : DefaultButtonsToolbar;
};

export const useResponsiveIconTypeMenu = ({
  toolbarSize,
  responsivenessEnabled,
}: {
  toolbarSize: ToolbarSize;
  responsivenessEnabled: boolean;
}) => {
  const iconTypeList = useMemo(
    () => ResponsiveCustomMenu[toolbarSize],
    [toolbarSize],
  );

  return responsivenessEnabled ? iconTypeList : DefaultButtonsMenu;
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
