/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
  ExtractInjectionAPI,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
import type { widthPlugin } from '@atlaskit/editor-plugin-width';
import { akEditorGridLineZIndex } from '@atlaskit/editor-shared-styles';

import { GuidelineContainer } from './guildelineContainer';
import {
  DisplayGuideline,
  GuidelinePluginOptions,
  GuidelinePluginState,
} from './types';
import { getEditorCenterX } from './utils';

const guidelineStyles = css({
  position: 'absolute',
  width: '100%',
  left: 0,
  right: 0,
  transform: `scale(1)`,
  zIndex: `${akEditorGridLineZIndex};`,
  display: 'flex',
  justifyContent: 'center',
});

const key = new PluginKey<GuidelinePluginState>('guidelinePlugin');

const displayGuideline: DisplayGuideline = view => props => {
  const { dispatch, state } = view;
  const tr = state.tr.setMeta(key, props);
  dispatch(tr);
  return true;
};

export const EMPTY_STATE: GuidelinePluginState = {
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

  if (
    !widthState ||
    !widthState.containerWidth ||
    !widthState.lineLength ||
    !guidelineState ||
    !guidelineState.guidelines ||
    guidelineState.guidelines.length === 0
  ) {
    return null;
  }

  return (
    <div css={guidelineStyles}>
      <GuidelineContainer
        guidelines={guidelineState.guidelines}
        height={(editorView.dom as HTMLElement).scrollHeight}
        centerOffset={getEditorCenterX(editorView)}
        containerWidth={widthState.containerWidth}
        editorWidth={widthState.lineLength}
      />
    </div>
  );
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
