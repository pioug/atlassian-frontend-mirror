import React from 'react';

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

    // close annotation view if annotation is gone (annotationText is empty)
    if (!nextProps.annotationText && nextState.renderChild !== false) {
      this.setState({ renderChild: false });
      return true;
    }
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
