import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { HighlightPlugin } from './plugin';

export interface HighlightPluginState {}

export const highlightPluginKey = new PluginKey<HighlightPluginState>(
  'highlight',
);

export const createPlugin = ({
  api,
}: {
  api: ExtractInjectionAPI<HighlightPlugin> | undefined;
}) => {
  return new SafePlugin({
    key: highlightPluginKey,
  });
};
