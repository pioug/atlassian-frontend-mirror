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
          const { annotations, selectedAnnotations } = inlineCommentState;
          const visible = annotations[id] === false;
          const annotationHasFocus = selectedAnnotations.some(x => x.id === id);

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
  dismissHandler?: (callback: () => void) => void;
  annotationText?: string;
};

type AnnotationViewWrapperState = {
  renderChild?: boolean;
};
// component allows us to know when its mounted, allowing for analytics to be fired
export class AnnotationViewWrapper extends React.Component<
  AnnotationViewWrapperProps
> {
  state: AnnotationViewWrapperState = {
    renderChild: undefined,
  };

  // Note: this will not be called for initial render
  // for subsequent rerender we dont want to render its children if we are on the same annotation
  shouldComponentUpdate(
    nextProps: AnnotationViewWrapperProps,
    nextState: AnnotationViewWrapperState,
  ) {
    const textChanged = this.props.annotationText !== nextProps.annotationText;

    // reopen comment when clicking the same annotation if it was closed before
    // but keep closed when text is changing
    if (
      !textChanged &&
      this.state.renderChild === false &&
      nextState.renderChild === false
    ) {
      this.setState({ renderChild: true });
    }

    //do not rerender children if same annotation clicked and text not changed
    //if view comments already opened
    if (
      nextProps.annotationText &&
      !textChanged &&
      this.state.renderChild &&
      nextState.renderChild
    ) {
      return false;
    }
    return true;
  }

  componentDidMount() {
    const { onViewed } = this.props;
    if (onViewed) {
      onViewed();
    }
  }

  dismiss = () => {
    this.setState({ renderChild: false });
  };

  render() {
    const { children } = this.props;
    const renderChildren = children as (props: any) => React.ReactNode;

    // check false explicitly, undefined is initial state and we need to render in this case
    return this.state.renderChild !== false ? (
      <div>{renderChildren(this.dismiss)}</div>
    ) : null;
  }
}
