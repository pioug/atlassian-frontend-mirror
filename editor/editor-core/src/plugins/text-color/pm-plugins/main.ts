import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';

import { Dispatch } from '../../../event-dispatcher';
import {
  textColorPalette,
  textColorPaletteExtended,
} from '../../../ui/ColorPalette/Palettes/textColorPalette';
import { PaletteColor } from '../../../ui/ColorPalette/Palettes/type';
import { DEFAULT_BORDER_COLOR } from '../../../ui/ColorPalette/Palettes/common';
import { DEFAULT_COLOR, getActiveColor } from '../utils/color';
import { getDisabledState } from '../utils/disabled';

export { DEFAULT_COLOR } from '../utils/color';

export type TextColorPluginState = {
  palette: Array<PaletteColor>;
  paletteExpanded?: Array<PaletteColor>;
  defaultColor: string;
  disabled?: boolean;
  color: string | null;
};

export type ActionHandlerParams = {
  dispatch: Dispatch;
  pluginState: TextColorPluginState;
  tr: Transaction;
  params?: {
    color?: string;
    disabled?: boolean;
  };
};

export type TextColorDefaultColor = {
  color: string;
  label: string;
};

export interface TextColorPluginConfig {
  defaultColor?: TextColorDefaultColor;
  // Allow "show more colours" option
  allowMoreTextColors?: boolean;
}

export function createInitialPluginState(
  editorState: EditorState,
  pluginConfig?: TextColorPluginConfig,
): TextColorPluginState {
  const defaultColor = pluginConfig?.defaultColor || DEFAULT_COLOR;
  const showMoreColorsToggle = pluginConfig?.allowMoreTextColors || false;

  const palette: Array<PaletteColor> = [
    {
      value: defaultColor.color,
      label: defaultColor.label,
      border: DEFAULT_BORDER_COLOR,
    },
    ...(showMoreColorsToggle ? textColorPaletteExtended : textColorPalette),
  ];

  const state = {
    color: getActiveColor(editorState),
    disabled: getDisabledState(editorState),
    palette,
    defaultColor: defaultColor.color,
  };

  // break up the palette for extended colors
  if (showMoreColorsToggle) {
    // defined palette order: [normal, dark, light] (but normal[0] is default/dark)
    // expanded palette: [dark, normal, light] with normal[0] on the dark row
    const normalRow = palette.slice(0, 7);
    const darkRow = palette.slice(7, 14);
    const lightRow = palette.slice(14);

    const paletteExpanded = darkRow.concat(normalRow).concat(lightRow);
    // swap default back and slot 7
    const defaultSwatch = paletteExpanded[0];
    paletteExpanded[0] = paletteExpanded[7];
    paletteExpanded[7] = defaultSwatch;

    return {
      ...state,
      palette: normalRow,
      paletteExpanded,
    };
  }

  return state;
}

export enum ACTIONS {
  RESET_COLOR,
  SET_COLOR,
  DISABLE,
}

export const pluginKey = new PluginKey<TextColorPluginState>('textColorPlugin');

export function createPlugin(
  dispatch: Dispatch,
  pluginConfig?: TextColorPluginConfig,
): Plugin {
  return new Plugin({
    key: pluginKey,
    state: {
      init(_config, editorState) {
        return createInitialPluginState(editorState, pluginConfig);
      },
      apply(tr, pluginState, _, newState) {
        const meta = tr.getMeta(pluginKey) || {};

        let nextState;
        switch (meta.action) {
          case ACTIONS.RESET_COLOR:
            nextState = { ...pluginState, color: pluginState.defaultColor };
            break;

          case ACTIONS.SET_COLOR:
            nextState = { ...pluginState, color: meta.color, disabled: false };
            break;

          case ACTIONS.DISABLE:
            nextState = { ...pluginState, disabled: true };
            break;

          default:
            nextState = {
              ...pluginState,
              color: getActiveColor(newState),
              disabled: getDisabledState(newState),
            };
        }

        if (
          (pluginState && pluginState.color !== nextState.color) ||
          (pluginState && pluginState.disabled !== nextState.disabled)
        ) {
          dispatch(pluginKey, nextState);
          return nextState;
        }

        return pluginState;
      },
    },
  });
}
