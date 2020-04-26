/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import PropTypes from 'prop-types';

export default function withColumnWidth(Cell) {
  return class CellWithColumnWidth extends Component {
    static contextTypes = {
      tableTree: PropTypes.object.isRequired,
    };

    UNSAFE_componentWillMount() {
      this.setColumnWidth(this.props.width);
    }

    setColumnWidth(width) {
      if (width !== undefined) {
        this.context.tableTree.setColumnWidth(this.props.columnIndex, width);
      }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      this.setColumnWidth(nextProps.width);
    }

    render() {
      const { width, columnIndex } = this.props;
      const columnWidth =
        width !== null && width !== undefined
          ? width
          : this.context.tableTree.getColumnWidth(columnIndex);
      return <Cell {...this.props} width={columnWidth} />;
    }
  };
}
