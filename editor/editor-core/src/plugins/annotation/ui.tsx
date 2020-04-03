import React from 'react';
import { ReactNodeView, ForwardRef } from '../../nodeviews';
import WithPluginState from '../../ui/WithPluginState';
import { stateKey as reactPluginKey } from '../../plugins/base/pm-plugins/react-nodeview';

import { InlineCommentPluginState } from './types';
import { pluginKey as annotationPluginKey } from './pm-plugins/plugin-factory';

export class AnnotationNodeView extends ReactNodeView {
  createDomRef() {
    return document.createElement('span');
  }

  getContentDOM() {
    const dom = document.createElement('span');
    dom.className = 'fabric-editor-annotation';
    return { dom };
  }

  render(_props: {}, forwardRef: ForwardRef) {
    return (
      <WithPluginState
        plugins={{
          annotationState: annotationPluginKey,
          selectionState: reactPluginKey,
        }}
        editorView={this.view}
        render={({
          annotationState,
        }: {
          annotationState: InlineCommentPluginState;
        }) => {
          const id = this.node.attrs.id;
          return (
            <span
              style={{
                backgroundColor:
                  annotationState[id] === false
                    ? 'rgba(255, 196, 0, 0.4)'
                    : 'transparent',
              }}
              ref={forwardRef}
            />
          );
        }}
      />
    );
  }
}
