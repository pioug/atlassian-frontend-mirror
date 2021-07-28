import { Plugin } from 'prosemirror-state';

import {
  PanelSharedCssClassName,
  ProviderFactory,
} from '@atlaskit/editor-common';

import { getPanelNodeView } from '../nodeviews/panel';
import { PanelPluginOptions, pluginKey } from '../types';
import { Dispatch } from '../../../event-dispatcher';
import { createSelectionClickHandler } from '../../selection/utils';

export type PanelOptions = {
  color?: string;
  emoji?: string;
};

export const createPlugin = (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  pluginOptions: PanelPluginOptions,
) => {
  const { useLongPressSelection = false } = pluginOptions;
  return new Plugin({
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
