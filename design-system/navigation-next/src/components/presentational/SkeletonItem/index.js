import React, { PureComponent } from 'react';

import { styleReducerNoOp, withContentTheme } from '../../../theme';

class SkeletonItem extends PureComponent {
  static defaultProps = {
    hasBefore: false,
    styles: styleReducerNoOp,
  };

  render() {
    const { hasBefore, styles: styleReducer, theme } = this.props;

    const { mode, context } = theme;
    const defaultStyles = mode.skeletonItem()[context];
    const styles = styleReducer(defaultStyles);

    return (
      <div css={{ '&&': styles.wrapper }}>
        {hasBefore && <div css={styles.before} />}
        <div css={styles.content} />
      </div>
    );
  }
}

export default withContentTheme(SkeletonItem);
