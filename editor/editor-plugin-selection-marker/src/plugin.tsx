import React, { useEffect } from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';

import { createPlugin, dispatchShouldHideDecorations } from './pm-plugins/main';
import type { SelectionMarkerPlugin } from './types';
import { GlobalStylesWrapper } from './ui/global-styles';

export const selectionMarkerPlugin: SelectionMarkerPlugin = ({ api }) => {
  return {
    name: 'selectionMarker',

    pmPlugins() {
      return [
        {
          name: 'selectionMarkerPmPlugin',
          plugin: () => createPlugin(api),
        },
      ];
    },

    usePluginHook({ editorView }) {
      const { focusState, typeAheadState } = useSharedPluginState(api, [
        'focus',
        'typeAhead',
      ]);
      useEffect(() => {
        const shouldHide =
          (focusState?.hasFocus || (typeAheadState?.isOpen ?? false)) ?? true;

        requestAnimationFrame(() =>
          dispatchShouldHideDecorations(editorView, shouldHide),
        );
      }, [editorView, focusState, typeAheadState]);
    },

    contentComponent() {
      return <GlobalStylesWrapper />;
    },
  };
};
