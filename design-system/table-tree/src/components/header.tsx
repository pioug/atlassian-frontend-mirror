/** @jsx jsx */
import { Component } from 'react';

import { css, jsx } from '@emotion/react';

import { N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import ColumnCell from './internal/common-cell';
import withColumnWidth from './internal/with-column-width';

const headerStyles = css({
  color: token('color.text.subtle', N300),
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: -0.1,
  lineHeight: '1.67',
});

class Header extends Component<any> {
  render() {
    const { props } = this;
    return (
      <ColumnCell
        css={headerStyles}
        role="columnheader"
        style={{ width: props.width }}
        {...props}
      >
        {props.children}
      </ColumnCell>
    );
  }
}

export default withColumnWidth(Header);
