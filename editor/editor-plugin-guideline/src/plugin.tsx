import React from 'react';

import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
  ExtractInjectionAPI,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
import type { widthPlugin } from '@atlaskit/editor-plugin-width';

import {
  DisplayGuideline,
  GuidelinePluginOptions,
  GuidelinePluginState,
} from './types';

const key = new PluginKey<GuidelinePluginState>('guidelinePlugin');

const displayGuideline: DisplayGuideline = (_view: EditorView) => {};

const EMPTY_STATE: GuidelinePluginState = {
  guidelines: [],
};

const guidelinePMPlugin = new SafePlugin<GuidelinePluginState>({
  key,
  state: {
    init() {
      return EMPTY_STATE;
    },
    apply(tr, currentPluginState) {
      const nextPluginState = tr.getMeta(key);
      if (nextPluginState) {
        return nextPluginState as GuidelinePluginState;
      }

      return currentPluginState;
    },
  },
});

const ContentComponent = ({
  api,
  editorView,
  options,
}: {
  api: ExtractInjectionAPI<typeof guidelinePlugin> | undefined;
  editorView: EditorView;
  options: GuidelinePluginOptions | undefined;
}) => {
  const { widthState, guidelineState } = useSharedPluginState(api, [
    'width',
    'guideline',
  ]);

  if (!guidelineState || !widthState) {
    return null;
  }

  return <div></div>;
};

export const guidelinePlugin: NextEditorPlugin<
  'guideline',
  {
    dependencies: [typeof widthPlugin];
    sharedState: GuidelinePluginState | null;
    actions: {
      displayGuideline: DisplayGuideline;
    };
  }
> = (options?, api?) => ({
  name: 'guideline',
  getSharedState(editorState) {
    if (!editorState) {
      return null;
    }
    return key.getState(editorState);
  },
  actions: {
    displayGuideline: displayGuideline,
  },

  pmPlugins() {
    return [
      {
        name: 'guideline',
        plugin: () => guidelinePMPlugin,
      },
    ];
  },

  contentComponent: ({ editorView }) => (
    <ContentComponent editorView={editorView} options={options} api={api} />
  ),
});
