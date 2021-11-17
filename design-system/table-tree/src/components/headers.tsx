/** @jsx jsx */
/* eslint-disable @repo/internal/react/no-clone-element */
import { Children, cloneElement, Component } from 'react';

import { css, jsx } from '@emotion/core';

import { token } from '@atlaskit/tokens';

const containerStyles = css({
  display: 'flex',
  borderBottom: `solid 2px ${token('color.border.neutral', '#dfe1e6')}`,
});

export default class Headers extends Component<any> {
  render() {
    return (
      <div css={containerStyles} role="row">
        {Children.map(this.props.children, (header, index) =>
          // eslint-disable-next-line react/no-array-index-key
          cloneElement(header as any, { key: index, columnIndex: index }),
        )}
      </div>
    );
  }
}
