import React from 'react';
import { findDomRefAtPos } from 'prosemirror-utils';
import { annotation } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import { stateKey as reactPluginKey } from '../../plugins/base/pm-plugins/react-nodeview';

import {
  AnnotationProvider,
  AnnotationInfo,
  AnnotationState,
  InlineCommentState,
  AnnotationComponentProps,
  AnnotationTypeProvider,
} from './types';
import { reorderAnnotations } from './utils';
import {
  removeInlineCommentNearSelection,
  resolveInlineComment,
} from './commands';
import {
  inlineCommentPlugin,
  getPluginState,
} from './pm-plugins/inline-comment';
import { pluginKey as inlineCommentPluginKey } from './pm-plugins/plugin-factory';

const annotationPlugin = (
  annotationProvider?: AnnotationProvider,
): EditorPlugin => {
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

    pmPlugins: () => [
      {
        name: 'annotation',
        plugin: ({ dispatch, portalProviderAPI }) => {
          return annotationProvider &&
            annotationProvider.providers &&
            annotationProvider.providers.inlineComment
            ? inlineCommentPlugin({
                dispatch,
                portalProviderAPI,
                inlineCommentProvider:
                  annotationProvider.providers.inlineComment,
                pollingInterval:
                  annotationProvider.providers.inlineComment.pollingInterval,
              })
            : undefined;
        },
      },
    ],

    contentComponent({ editorView }) {
      const { annotation: annotationMarkType } = editorView.state.schema.marks;
      if (!annotationProvider) {
        return null;
      }

      const { component: Component, providers } = annotationProvider;
      if (!Component || !providers || !providers.inlineComment) {
        return null;
      }

      return (
        <WithPluginState
          plugins={{
            selectionState: reactPluginKey,
            annotationState: inlineCommentPluginKey,
          }}
          render={() => {
            const { state, dispatch } = editorView;
            const { from, $from } = state.selection;
            const node = state.doc.nodeAt(from);
            if (!node) {
              return null;
            }

            const annotationsMarks = node.marks.filter(
              mark => mark.type === annotationMarkType,
            );

            if (!annotationsMarks.length) {
              return null;
            }

            let annotations = annotationsMarks.map(mark => {
              return {
                id: mark.attrs.id,
                type: mark.attrs.annotationType,
              };
            });

            const inlineCommentState = getPluginState(state);
            // This is currently specific to inlineComments. In future this will need to check all providers, not just one.
            annotations = annotations.filter(
              mark => inlineCommentState[mark.id] === false,
            );

            if (!annotations.length) {
              return null;
            }

            // re-order to handle nested annotations
            reorderAnnotations(annotations, $from);

            const dom = findDomRefAtPos(
              from,
              editorView.domAtPos.bind(editorView),
            ) as HTMLElement;

            return (
              <Component
                annotations={annotations}
                dom={dom}
                onDelete={(id: string) =>
                  removeInlineCommentNearSelection(id)(state, dispatch)
                }
                onResolve={(id: string) =>
                  resolveInlineComment(id)(state, dispatch)
                }
              />
            );
          }}
        />
      );
    },
  };
};

export default annotationPlugin;
export {
  AnnotationProvider,
  AnnotationComponentProps,
  AnnotationTypeProvider,
  AnnotationInfo,
  AnnotationState,
  InlineCommentState,
};
