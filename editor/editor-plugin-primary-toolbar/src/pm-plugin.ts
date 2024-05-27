import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { getToolbarComponents } from './toolbar-configuration';
import type { PrimaryToolbarPluginState } from './types';
import Separator from './ui/separator';

export const primaryToolbarPluginKey = new PluginKey<PrimaryToolbarPluginState>(
  'primaryToolbar',
);

export enum PrimaryToolbarPluginAction {
  REGISTER,
}

export const createPlugin = () => {
  return new SafePlugin({
    key: primaryToolbarPluginKey,
    state: {
      init: (): PrimaryToolbarPluginState => {
        const componentRegistry = new Map<string, ToolbarUIComponentFactory>();

        // Pre-fill registry with the separator component
        componentRegistry.set('separator', Separator);

        return {
          componentRegistry,
          components: [],
        };
      },
      apply: (
        tr: ReadonlyTransaction,
        pluginState: PrimaryToolbarPluginState,
      ): PrimaryToolbarPluginState => {
        const action = tr.getMeta(primaryToolbarPluginKey)?.type;
        switch (action) {
          case PrimaryToolbarPluginAction.REGISTER:
            const { name, component } = tr.getMeta(primaryToolbarPluginKey);
            pluginState.componentRegistry.set(name, component);
            return {
              ...pluginState,
              components: getToolbarComponents(pluginState),
            };
          default:
            return pluginState;
        }
      },
    },
  });
};
