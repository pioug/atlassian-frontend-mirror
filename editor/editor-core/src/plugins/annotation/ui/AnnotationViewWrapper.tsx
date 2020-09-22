import React from 'react';

export type AnnotationViewWrapperProps = {
  children: React.ReactNode;
  onViewed?: () => void;
  // While not explicitly used in the component, it's used in part of the PureComponent comparison if the annotation should update
  annotationText?: string;
};

export class AnnotationViewWrapper extends React.PureComponent<
  AnnotationViewWrapperProps
> {
  componentDidMount() {
    const { onViewed } = this.props;
    if (onViewed) {
      onViewed();
    }
  }

  render() {
    return this.props.children;
  }
}
