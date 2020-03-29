/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import SpacerInner from '../styled/SpacerInner';

export default class Spacer extends PureComponent {
  static defaultProps = {
    shouldAnimate: false,
    width: 0,
  };

  render() {
    const {
      children,
      innerRef,
      onTransitionEnd,
      shouldAnimate,
      width,
    } = this.props;

    return (
      <SpacerInner
        innerRef={innerRef}
        onTransitionEnd={onTransitionEnd}
        shouldAnimate={shouldAnimate}
        style={{ width }}
      >
        {children}
      </SpacerInner>
    );
  }
}
