import React, { PureComponent } from 'react';

import { navigationItemClicked } from '../../../common/analytics';
import { styleReducerNoOp, withGlobalTheme } from '../../../theme';
import InteractionStateManager from '../InteractionStateManager';

import GlobalItemPrimitive from './primitives';

export class GlobalItemBase extends PureComponent {
  static defaultProps = {
    label: '',
    size: 'large',
    styles: styleReducerNoOp,
  };

  renderItem = (state) => {
    const { createAnalyticsEvent, theme, ...props } = this.props;
    return <GlobalItemPrimitive {...state} {...props} />;
  };

  render() {
    const {
      size,
      theme: { mode },
    } = this.props;
    const { itemWrapper: itemWrapperStyles } = styleReducerNoOp(
      mode.globalItem({ size }),
    );
    return (
      <div css={itemWrapperStyles}>
        <InteractionStateManager>{this.renderItem}</InteractionStateManager>
      </div>
    );
  }
}

export default navigationItemClicked(
  withGlobalTheme(GlobalItemBase),
  'globalItem',
  true,
);
