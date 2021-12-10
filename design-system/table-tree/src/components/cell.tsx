import React, { Component } from 'react';

import CommonCell from './internal/common-cell';
import OverflowContainer from './internal/overflow-container';
import withColumnWidth from './internal/with-column-width';

export interface CellProps {
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  singleLine?: boolean;
  indentLevel?: number;
  width?: number | string;
  className?: string;
}

class Cell extends Component<CellProps> {
  render() {
    const {
      children,
      singleLine,
      indentLevel,
      width,
      className,
      ...props
    } = this.props;
    return (
      <CommonCell
        role="gridcell"
        indent={indentLevel ? `${25 * indentLevel}px` : undefined}
        width={width}
        className={className}
        {...props}
      >
        <OverflowContainer isSingleLine={singleLine}>
          {children}
        </OverflowContainer>
      </CommonCell>
    );
  }
}

export default withColumnWidth(Cell);
