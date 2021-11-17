/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import PropTypes from 'prop-types';

export interface CellWithColumnWidthProps {
  width?: number | string;
  columnIndex?: number;
}

export default function withColumnWidth<T extends object>(
  Cell: React.ComponentType<T>,
) {
  return class CellWithColumnWidth extends Component<
    T & CellWithColumnWidthProps
  > {
    static contextTypes = {
      tableTree: PropTypes.object.isRequired,
    };

    UNSAFE_componentWillMount() {
      this.setColumnWidth(this.props.width);
    }

    setColumnWidth(width?: number | string) {
      if (width !== undefined) {
        this.context.tableTree.setColumnWidth(this.props.columnIndex, width);
      }
    }

    UNSAFE_componentWillReceiveProps(nextProps: CellWithColumnWidthProps) {
      this.setColumnWidth(nextProps.width);
    }

    render() {
      const { width, columnIndex, ...other } = this.props;
      const columnWidth =
        width !== null && width !== undefined
          ? width
          : this.context.tableTree.getColumnWidth(columnIndex);
      return <Cell width={columnWidth} {...(other as T)} />;
    }
  };
}
