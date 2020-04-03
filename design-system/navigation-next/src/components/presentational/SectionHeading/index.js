import React, { Component } from 'react';

import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

const gridSize = gridSizeFn();

export default class SectionHeading extends Component {
  render() {
    const { children } = this.props;
    return (
      <div
        css={{
          alignItems: 'center',
          color: 'inherit',
          display: 'flex',
          flexShrink: 0,
          fontSize: 'inherit',
          fontWeight: 600,
          height: gridSize * 5.5,
          paddingLeft: gridSize * 1.5,
          paddingRight: gridSize * 1.5,
          marginTop: gridSize,
        }}
      >
        {children}
      </div>
    );
  }
}
