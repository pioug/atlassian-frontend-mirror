import React, { PureComponent } from 'react';

import { navigationItemClicked } from '../../../common/analytics';
import { styleReducerNoOp } from '../../../theme';
import InteractionStateManager from '../InteractionStateManager';

import ItemPrimitive from './primitives';

class Item extends PureComponent {
  static defaultProps = {
    styles: styleReducerNoOp,
    isSelected: false,
    spacing: 'default',
    text: '',
  };

  renderItem = (state) => {
    const { createAnalyticsEvent, ...props } = this.props;
    return <ItemPrimitive {...state} {...props} />;
  };

  render() {
    return <InteractionStateManager>{this.renderItem}</InteractionStateManager>;
  }
}

export { Item as ItemBase };

export default navigationItemClicked(Item, 'item');
