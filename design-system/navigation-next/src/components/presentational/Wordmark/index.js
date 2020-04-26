import React, { Component } from 'react';

import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

const gridSize = gridSizeFn();

export default class Wordmark extends Component {
  render() {
    const { wordmark: WordmarkLogo } = this.props;
    return (
      <div
        css={{
          lineHeight: 0,
          // -2px here to account for the extra space at the top of a MenuSection
          // for the scroll hint.
          paddingBottom: gridSize * 3.5 - 2,
          paddingLeft: gridSize * 2,
          paddingTop: gridSize,
        }}
      >
        <WordmarkLogo />
      </div>
    );
  }
}
