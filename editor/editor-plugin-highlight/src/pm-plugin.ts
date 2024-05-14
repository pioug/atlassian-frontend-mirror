import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { REMOVE_HIGHLIGHT_COLOR } from '@atlaskit/editor-common/ui-color';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import type { HighlightPlugin } from './plugin';

export const highlightPluginKey = new PluginKey<HighlightPluginState>(
  'highlight',
);

export type HighlightPluginState = {
  activeColor: string; // Hex value color, lowercase
  disabled: boolean;
};

const initialState = {
  activeColor: REMOVE_HIGHLIGHT_COLOR,
  disabled: false, // TODO: Should probably be true, but we can tackle it once we tackle disabled state
};

export enum HighlightPluginAction {
  CHANGE_COLOR,
}

export const createPlugin = ({
  api,
}: {
  api: ExtractInjectionAPI<HighlightPlugin> | undefined;
}) => {
  return new SafePlugin({
    key: highlightPluginKey,
    state: {
      init: (): HighlightPluginState => initialState,
      apply: (
        tr: ReadonlyTransaction,
        pluginState: HighlightPluginState,
      ): HighlightPluginState => {
        const action = tr.getMeta(highlightPluginKey)?.type;

        switch (action) {
          case HighlightPluginAction.CHANGE_COLOR:
            const { color } = tr.getMeta(highlightPluginKey);

            return {
              ...pluginState,
              activeColor: color,
            };
          default:
            return pluginState;
        }
      },
    },
  });
};
