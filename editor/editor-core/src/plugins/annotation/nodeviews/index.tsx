import React from 'react';
import { AnnotationSharedClassNames } from '@atlaskit/editor-common';
import { ReactNodeView, ForwardRef } from '../../../nodeviews';
import WithPluginState from '../../../ui/WithPluginState';
import { InlineCommentPluginState } from '../pm-plugins/types';
import { inlineCommentPluginKey } from '../utils';

export class AnnotationNodeView extends ReactNodeView {
  createDomRef() {
    return document.createElement('span');
  }

  getContentDOM() {
    const dom = document.createElement('span');
    dom.className = 'ak-editor-annotation';
    return { dom };
  }

  render(_props: {}, forwardRef: ForwardRef) {
    return (
      <WithPluginState
        plugins={{
          inlineCommentState: inlineCommentPluginKey,
        }}
        editorView={this.view}
        render={({
          inlineCommentState,
        }: {
          inlineCommentState: InlineCommentPluginState;
        }) => {
          // Check if selection includes current annotation ID
          const {
            annotations,
            selectedAnnotations,
            isVisible,
          } = inlineCommentState;

          if (!isVisible) {
            return <span ref={forwardRef} />;
          }

          const id = this.node.attrs.id;
          const isUnresolved = annotations[id] === false;
          const annotationHasFocus = selectedAnnotations.some(x => x.id === id);
          const className = getAnnotationViewClassname(
            isUnresolved,
            annotationHasFocus,
          );

          return <span className={className} ref={forwardRef} />;
        }}
      />
    );
  }
}

export const getAnnotationViewClassname = (
  isUnresolved: boolean,
  hasFocus: boolean,
): string | undefined => {
  if (!isUnresolved) {
    return;
  }

  return hasFocus
    ? AnnotationSharedClassNames.focus
    : AnnotationSharedClassNames.blur;
};
