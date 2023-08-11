import EditorConfiguration from './editor-configuration';

import type { PaletteColor } from '@atlaskit/editor-common/ui-color';
import {
  Command,
  FloatingToolbarConfig,
  FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
import type { ConfigWithNodeInfo } from '@atlaskit/editor-plugin-floating-toolbar';
import { PanelType } from '@atlaskit/adf-schema/schema';

import { panelDarkModeBackgroundPalette } from '@atlaskit/editor-core/src/ui/ColorPalette/Palettes/panelBackgroundPalette';
import {
  darkPanelColors,
  getPanelDarkColor,
} from '@atlaskit/editor-common/panel';

const setColorInPalette = (color: string) => {
  return (
    panelDarkModeBackgroundPalette.find((item) => item.value === color) ||
    ({
      label: 'Custom',
      value: color,
      border: 'rgba(23, 43, 77, 0.12)',
    } as PaletteColor)
  );
};

export const createFloatingToolbarConfigForPanel = (
  editorConfiguration: EditorConfiguration,
  toolbarConfig: ConfigWithNodeInfo,
): FloatingToolbarConfig | undefined => {
  const themeMode = editorConfiguration.getMode();
  let config = toolbarConfig.config;
  if (themeMode === 'dark' && config) {
    const { panelType, panelColor } = toolbarConfig.node.attrs;

    let activePanelColor =
      panelType === PanelType.CUSTOM
        ? getPanelDarkColor(panelColor)
        : darkPanelColors[panelType as Exclude<PanelType, PanelType.CUSTOM>];

    const toolbarConfigItems = config.items as FloatingToolbarItem<Command>[];
    toolbarConfigItems.forEach((Item) => {
      if (Item.type === 'select' && Item.id === 'editor.panel.colorPicker') {
        Item.options = panelDarkModeBackgroundPalette;
        Item.defaultValue = setColorInPalette(activePanelColor);
      }
    });
    config.items = toolbarConfigItems;
  }
  return config;
};
