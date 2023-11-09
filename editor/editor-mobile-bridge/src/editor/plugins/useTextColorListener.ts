// eslint-disable-next-line import/no-extraneous-dependencies
import type { TextColorPluginState } from '@atlaskit/editor-plugin-text-color';
import { toNativeBridge } from '../web-to-native';
import { useListener } from './useListener';
import type WebBridgeImpl from '../native-to-web';

interface SerialisedTextColor {
  color: string | null;
  disabled?: boolean | undefined;
  borderColorPalette?: {
    [color: string]: string; // Hex
  };
  palette?: {
    [color: string]: string; // Hex
  };
}

export const useTextColorListener = (
  pluginState: TextColorPluginState | undefined,
  bridge: WebBridgeImpl,
) => {
  useListener(
    (initialPass) => {
      let color = pluginState?.color || null;
      let serialisedState: SerialisedTextColor = {
        color,
        disabled: pluginState?.disabled,
      };

      if (initialPass) {
        let palette = Object.create(null);
        let borderColorPalette = Object.create(null);

        for (let { value, label, border } of pluginState?.palette ?? []) {
          borderColorPalette[label.toLowerCase().replace(' ', '-')] = border;
          palette[label] = value;
        }

        serialisedState = {
          ...pluginState,
          color,
          borderColorPalette,
          palette,
        };
      }

      toNativeBridge.call('textFormatBridge', 'updateTextColor', {
        states: JSON.stringify(serialisedState),
      });
    },
    [pluginState],
    {
      bridge,
      key: 'textFormatBridgeState',
      // This is consistent with current behaviour to set the text format state from text color
      // even though it doesn't match the type - it gets overridden later by text formatting
      // eslint-disable-next-line
      state: (pluginState as any) ?? null,
    },
    true,
  );
};
