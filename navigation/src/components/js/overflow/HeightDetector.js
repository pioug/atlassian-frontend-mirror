import React, { Component } from 'react';
import SizeDetector from '@atlaskit/size-detector';
import rafSchd from 'raf-schd';

export default class HeightDetector extends Component {
  notifyHeight = rafSchd(height => {
    // eslint-disable-next-line react/prop-types
    this.props.onHeightChange(height);
  });

  render() {
    return (
      <SizeDetector>
        {({ height }) => {
          if (height === null) {
            return null;
          }
          this.notifyHeight(height);
          return this.props.children;
        }}
      </SizeDetector>
    );
  }
}
