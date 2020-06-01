import React from 'react';
import { AnnotationSharedClassNames } from '@atlaskit/editor-common';
import { ReactNodeView, ForwardRef } from '../../nodeviews';
import WithPluginState from '../../ui/WithPluginState';
import { stateKey as reactPluginKey } from '../../plugins/base/pm-plugins/react-nodeview';
import { InlineCommentPluginState } from './pm-plugins/types';
import { inlineCommentPluginKey } from './pm-plugins/plugin-factory';

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
          selectionState: reactPluginKey,
        }}
        editorView={this.view}
        render={({
          inlineCommentState,
        }: {
          inlineCommentState: InlineCommentPluginState;
        }) => {
          // Check if selection includes current annotation ID
          const id = this.node.attrs.id;
          const { annotations, annotationsInSelection } = inlineCommentState;
          const visible = annotations[id] === false;
          const annotationHasFocus = annotationsInSelection.includes(id);

          let className;
          if (visible) {
            className = annotationHasFocus
              ? AnnotationSharedClassNames.focus
              : AnnotationSharedClassNames.blur;
          }

          return <span className={className} ref={forwardRef} />;
        }}
      />
    );
  }
}

export type AnnotationViewWrapperProps = {
  children: React.ReactNode;
  onViewed?: () => void;
};
// component allows us to know when its mounted, allowing for analytics to be fired
export class AnnotationViewWrapper extends React.Component<
  AnnotationViewWrapperProps
> {
  componentDidMount() {
    const { onViewed } = this.props;
    if (onViewed) {
      onViewed();
    }
  }

  render() {
    const { children, onViewed, ...otherProps } = this.props;

    return <div {...otherProps}>{children}</div>;
  }
}
