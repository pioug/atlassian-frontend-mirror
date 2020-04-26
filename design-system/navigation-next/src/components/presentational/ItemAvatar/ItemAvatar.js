import React, { Component } from 'react';

import Avatar from '@atlaskit/avatar';

import { withContentTheme } from '../../../theme';

class ItemAvatar extends Component {
  render() {
    const { itemState, styles: styleReducer, theme, ...props } = this.props;
    const { mode, context } = theme;
    const borderColor = styleReducer(mode.item(itemState)[context], itemState)
      .itemBase.backgroundColor;

    return <Avatar borderColor={borderColor} {...props} />;
  }
}

export default withContentTheme(ItemAvatar);
