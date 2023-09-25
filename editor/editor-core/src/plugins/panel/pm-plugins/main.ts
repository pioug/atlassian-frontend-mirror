import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';

import { getPanelNodeView } from '../nodeviews/panel';
import type { PanelPluginOptions } from '../types';
import { pluginKey } from '../types';
import type { Dispatch } from '../../../event-dispatcher';
import { createSelectionClickHandler } from '@atlaskit/editor-common/selection';

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
    props: {
      nodeViews: {
        panel: getPanelNodeView(pluginOptions, providerFactory),
      },
      handleClickOn: createSelectionClickHandler(
        ['panel'],
        (target) => !!target.closest(`.${PanelSharedCssClassName.prefix}`),
        { useLongPressSelection },
      ),
    },
  });
};
