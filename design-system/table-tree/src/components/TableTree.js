/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { TableTreeContainer } from '../styled';

import Cell from './Cell';
import Header from './Header';
import Headers from './Headers';
import Row from './Row';
import Rows from './Rows';

export default class TableTree extends Component {
  static childContextTypes = {
    tableTree: PropTypes.object.isRequired,
  };

  state = {
    columnWidths: [],
  };

  componentDidMount() {
    const widths = this.props.columnWidths;
    if (widths) {
      this.setState({ columnWidths: widths }); // eslint-disable-line
    }
  }

  setColumnWidth = (columnIndex, width) => {
    const { columnWidths } = this.state;
    if (width === columnWidths[columnIndex]) {
      return;
    }
    columnWidths[columnIndex] = width;
    this.setState({ columnWidths });
  };

  getColumnWidth = (columnIndex) => {
    return (this.state && this.state.columnWidths[columnIndex]) || null;
  };

  getChildContext() {
    return {
      tableTree: {
        columnWidths: this.state.columnWidths,
        setColumnWidth: this.setColumnWidth,
        getColumnWidth: this.getColumnWidth,
      },
    };
  }

  render() {
    const { items, headers, columns, columnWidths = [] } = this.props;
    const heads = headers && (
      <Headers>
        {headers.map((header, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Header key={index} columnIndex={index} width={columnWidths[index]}>
            {header}
          </Header>
        ))}
      </Headers>
    );
    let rows = null;
    if (columns && items) {
      rows = (
        <Rows
          items={items}
          render={({ id, children, hasChildren, content }) => (
            <Row itemId={id} items={children} hasChildren={hasChildren}>
              {columns.map((CellContent, index) => (
                <Cell
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  columnIndex={index}
                  width={columnWidths[index]}
                >
                  <CellContent {...content} />
                </Cell>
              ))}
            </Row>
          )}
        />
      );
    }
    return (
      <TableTreeContainer role="treegrid" aria-readonly>
        {heads}
        {rows}
        {this.props.children}
      </TableTreeContainer>
    );
  }
}
