import React, { Component } from 'react';

import { styleReducerNoOp, withContentTheme } from '../../../theme';

import ItemAvatar from './ItemAvatar';

const ItemAvatarWithTheme = withContentTheme(ItemAvatar);

export default class ConnectedItemAvatar extends Component {
  static defaultProps = {
    styles: styleReducerNoOp,
  };

  render() {
    return <ItemAvatarWithTheme {...this.props} />;
  }
}
