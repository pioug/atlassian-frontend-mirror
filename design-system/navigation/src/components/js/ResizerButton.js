/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import ResizerButtonInner from '../styled/ResizerButtonInner';

export default class ResizerButton extends PureComponent {
  static defaultProps = {
    isPointingRight: false,
    isVisible: false,
    resizerButtonLabel: 'Expand or collapse the navigation [ (left bracket)',
  };

  // Note: we always render the ResizerButtonInner here (instead of returning null immediately
  // when isVisible = false) because we want the user to be able to tab to the button always.
  render() {
    return (
      <ResizerButtonInner
        aria-label={this.props.resizerButtonLabel}
        aria-expanded={!this.props.isPointingRight}
        isPointingRight={this.props.isPointingRight}
        onClick={this.props.onClick}
        isVisible={this.props.isVisible}
        onMouseDown={e => e.preventDefault()}
      />
    );
  }
}
