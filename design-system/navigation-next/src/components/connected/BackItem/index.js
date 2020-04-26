import React, { Component } from 'react';

import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/arrow-left-circle';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import ConnectedItem from '../ConnectedItem';

const gridSize = gridSizeFn();

const ArrowLeft = () => (
  <ArrowLeftCircleIcon primaryColor="currentColor" secondaryColor="inherit" />
);

export default class BackItem extends Component {
  static defaultProps = {
    text: 'Back',
  };

  render() {
    const { before: beforeProp, text, ...props } = this.props;
    let before = beforeProp;
    if (!before) {
      before = ArrowLeft;
    }

    return (
      <div css={{ marginBottom: gridSize * 2 }}>
        <ConnectedItem {...props} after={null} before={before} text={text} />
      </div>
    );
  }
}
