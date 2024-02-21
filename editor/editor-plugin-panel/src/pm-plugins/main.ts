import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createSelectionClickHandler } from '@atlaskit/editor-common/selection';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { getPanelNodeView } from '../nodeviews/panel';
import type { PanelPluginOptions } from '../types';
import { pluginKey } from '../types';
import { handleCut } from '../utils';

export type PanelOptions = {
  color?: string;
  emoji?: string;
  emojiId?: string;
  emojiText?: string;
};

export const createPlugin = (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  pluginOptions: PanelPluginOptions,
) => {
  const { useLongPressSelection = false } = pluginOptions;
  return new SafePlugin({
    key: pluginKey,
    appendTransaction: (transactions, oldState, newState) => {
      if (getBooleanFF('platform.editor.allow-custom-cut-for-panel')) {
        const tr = transactions.find(tr => tr.getMeta('uiEvent') === 'cut');
        if (tr) {
          return handleCut(newState, oldState);
        }
      }
    },
    props: {
      nodeViews: {
        panel: getPanelNodeView(pluginOptions, providerFactory),
      },
      handleClickOn: createSelectionClickHandler(
        ['panel'],
        target => !!target.closest(`.${PanelSharedCssClassName.prefix}`),
        { useLongPressSelection },
      ),
    },
  });
};
