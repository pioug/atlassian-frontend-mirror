import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { BlockControlsPlugin } from '../types';

export const DragHandleMenu = ({
  api,
}: {
  api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
}) => {
  const { blockControlsState } = useSharedPluginState(api, ['blockControls']);
  return blockControlsState?.isMenuOpen ? <div>menu</div> : null;
};
