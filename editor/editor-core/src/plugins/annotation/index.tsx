import React from 'react';
import { annotation } from '@atlaskit/adf-schema';
import type {
  NextEditorPlugin,
  ExtractInjectionAPI,
  FloatingToolbarConfig,
  SelectionToolbarGroup,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { keymapPlugin } from './pm-plugins/keymap';
import { inlineCommentPlugin } from './pm-plugins/inline-comment';
import type {
  AnnotationProviders,
  InlineCommentAnnotationProvider,
  AnnotationInfo,
  AnnotationState,
  InlineCommentState,
  InlineCommentCreateComponentProps,
  InlineCommentViewComponentProps,
  AnnotationTypeProvider,
} from './types';
import type { UpdateEvent } from './update-provider';
import { AnnotationUpdateEmitter } from './update-provider';
import { getPluginState } from './utils';
import { buildToolbar } from './toolbar';
import { InlineCommentView } from './ui/InlineCommentView';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { InlineCommentPluginState } from './pm-plugins/types';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

export type AnnotationPlugin = NextEditorPlugin<
  'annotation',
  {
    pluginConfiguration: AnnotationProviders | undefined;
    sharedState: InlineCommentPluginState | undefined;
    dependencies: [OptionalPlugin<AnalyticsPlugin>];
  }
>;

const annotationPlugin: AnnotationPlugin = ({
  config: annotationProviders,
  api,
}) => {
  return {
    name: 'annotation',

    marks() {
      return [
        {
          name: 'annotation',
          mark: annotation,
        },
      ];
    },

    getSharedState(editorState) {
      if (!editorState) {
        return undefined;
      }
      return getPluginState(editorState) || undefined;
    },

    pmPlugins: () => [
      {
        name: 'annotation',
        plugin: ({ dispatch, portalProviderAPI, eventDispatcher }) => {
          if (annotationProviders) {
            return inlineCommentPlugin({
              dispatch,
              portalProviderAPI,
              eventDispatcher,
              provider: annotationProviders.inlineComment,
              editorAnalyticsAPI: api?.analytics?.actions,
            });
          }

          return;
        },
      },
      {
        name: 'annotationKeymap',
        plugin: () => {
          if (annotationProviders) {
            return keymapPlugin(api?.analytics?.actions);
          }
          return;
        },
      },
    ],

    pluginsOptions: {
      floatingToolbar(state, intl): FloatingToolbarConfig | undefined {
        if (
          getBooleanFF('platform.editor.enable-selection-toolbar_ucdwd') ||
          !annotationProviders
        ) {
          return;
        }

        const pluginState = getPluginState(state);
        if (
          pluginState &&
          pluginState.isVisible &&
          !pluginState.bookmark &&
          !pluginState.mouseData.isSelecting
        ) {
          const { isToolbarAbove } = annotationProviders.inlineComment;
          return buildToolbar(api?.analytics?.actions)(
            state,
            intl,
            isToolbarAbove,
          );
        }
      },
      selectionToolbar(state, intl): SelectionToolbarGroup | undefined {
        if (
          !getBooleanFF('platform.editor.enable-selection-toolbar_ucdwd') ||
          !annotationProviders
        ) {
          return;
        }

        const pluginState = getPluginState(state);
        if (
          pluginState &&
          pluginState.isVisible &&
          !pluginState.bookmark &&
          !pluginState.mouseData.isSelecting
        ) {
          const { isToolbarAbove } = annotationProviders.inlineComment;
          return buildToolbar(api?.analytics?.actions)(
            state,
            intl,
            isToolbarAbove,
          ) as SelectionToolbarGroup;
        }
      },
    },

    contentComponent({ editorView, dispatchAnalyticsEvent }) {
      if (!annotationProviders) {
        return null;
      }
      return (
        <AnnotationContentComponent
          api={api}
          editorView={editorView}
          annotationProviders={annotationProviders}
          dispatchAnalyticsEvent={dispatchAnalyticsEvent}
        />
      );
    },
  };
};

interface AnnotationContentComponentProps {
  api: ExtractInjectionAPI<typeof annotationPlugin> | undefined;
  editorView: EditorView;
  annotationProviders: AnnotationProviders;
  dispatchAnalyticsEvent: DispatchAnalyticsEvent | undefined;
}

function AnnotationContentComponent({
  api,
  editorView,
  annotationProviders,
  dispatchAnalyticsEvent,
}: AnnotationContentComponentProps) {
  const { annotationState: inlineCommentState } = useSharedPluginState(api, [
    'annotation',
  ]);
  if (inlineCommentState && !inlineCommentState.isVisible) {
    return null;
  }

  return (
    <div data-editor-popup="true">
      <InlineCommentView
        providers={annotationProviders}
        editorView={editorView}
        dispatchAnalyticsEvent={dispatchAnalyticsEvent}
        editorAnalyticsAPI={api?.analytics?.actions}
      />
    </div>
  );
}

export default annotationPlugin;
export { AnnotationUpdateEmitter };
export type {
  AnnotationProviders,
  InlineCommentAnnotationProvider,
  InlineCommentCreateComponentProps,
  InlineCommentViewComponentProps,
  AnnotationTypeProvider,
  AnnotationInfo,
  AnnotationState,
  InlineCommentState,
  UpdateEvent,
};
