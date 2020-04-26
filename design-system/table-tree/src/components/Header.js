import React, { Component } from 'react';

import { Header as StyledHeader } from '../styled';

import withColumnWidth from './withColumnWidth';

class Header extends Component {
  render() {
    const { props } = this;
    return (
      <StyledHeader role="columnheader" {...props}>
        {props.children}
      </StyledHeader>
    );
  }
}

export default withColumnWidth(Header);
