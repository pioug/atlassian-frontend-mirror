import React, { PureComponent } from 'react';

import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import { styleReducerNoOp } from '../../../theme';
import SkeletonItem from '../SkeletonItem';

const gridSize = gridSizeFn();

const modifyStyles = (defaultStyles) => ({
  ...defaultStyles,
  wrapper: {
    ...defaultStyles.wrapper,
    height: `${gridSize * 4.75}px`,
    paddingLeft: gridSize / 2,
    paddingRight: gridSize / 2,
  },
  before: {
    ...defaultStyles.before,
    height: gridSize * 3,
    marginRight: 0,
    width: gridSize * 3,
  },
});

export default class GlobalNavigationSkeletonItem extends PureComponent {
  static defaultProps = {
    hasBefore: true,
    styles: styleReducerNoOp,
  };

  render() {
    const { styles: styleReducer, ...props } = this.props;

    // We modify the SkeletonItem styles ourselves, then allow the consumer to
    // modify these if they want to.
    const patchedStyles = (defaultStyles) =>
      styleReducer(modifyStyles(defaultStyles));

    return <SkeletonItem {...props} styles={patchedStyles} />;
  }
}
