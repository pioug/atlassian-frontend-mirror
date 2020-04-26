import React, { Component } from 'react';

import { HeadersContainer } from '../styled';

export default class Headers extends Component {
  render() {
    return (
      <HeadersContainer role="row">
        {React.Children.map(this.props.children, (header, index) =>
          // eslint-disable-next-line react/no-array-index-key
          React.cloneElement(header, { key: index, columnIndex: index }),
        )}
      </HeadersContainer>
    );
  }
}
