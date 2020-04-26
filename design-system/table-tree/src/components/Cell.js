import React, { Component } from 'react';

import { OverflowContainer, Cell as StyledCell } from '../styled';

import withColumnWidth from './withColumnWidth';

class Cell extends Component {
  render() {
    const { props } = this;
    return (
      <StyledCell role="gridcell" {...props}>
        {/* eslint-disable-next-line react/prop-types */}
        <OverflowContainer singleLine={props.singleLine}>
          {props.children}
        </OverflowContainer>
      </StyledCell>
    );
  }
}

export default withColumnWidth(Cell);
