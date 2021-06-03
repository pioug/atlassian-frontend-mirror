import React, { PureComponent } from 'react';

import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import { styleReducerNoOp } from '../../../theme';
import Item from '../Item';

const gridSize = gridSizeFn();

const modifyStyles = (defaultStyles) => ({
  ...defaultStyles,
  itemBase: {
    ...defaultStyles.itemBase,
    height: gridSize * 6,
    paddingBottom: 0,
    paddingLeft: gridSize / 2 - 2, // Offset by 2px to account for border of avatar
    paddingRight: gridSize / 2,
    paddingTop: 0,
  },
  beforeWrapper: {
    ...defaultStyles.beforeWrapper,
    marginRight: gridSize - 2, // Offset by 2px to account for border of avatar
  },
  afterWrapper: {
    ...defaultStyles.afterWrapper,
    marginLeft: gridSize,
  },
  textWrapper: {
    ...defaultStyles.textWrapper,
    fontWeight: 600,
  },
});

export default class ContainerHeader extends PureComponent {
  static defaultProps = {
    styles: styleReducerNoOp,
    isSelected: false,
    text: '',
  };

  render() {
    const { styles: styleReducer, ...props } = this.props;

    // We modify the Item styles ourselves, then allow the consumer to modify
    // these if they want to.
    const patchedStyles = (defaultStyles, state) =>
      styleReducer(modifyStyles(defaultStyles), state);

    return <Item {...props} styles={patchedStyles} spacing="default" />;
  }
}
