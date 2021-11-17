/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import Cell from './cell';
import Header from './header';
import Headers from './headers';
import Row from './row';
import Rows from './rows';

interface State {
  columnWidths: number[];
}

export default class TableTree extends Component<any, State> {
  static childContextTypes = {
    tableTree: PropTypes.object.isRequired,
  };

  state: State = {
    columnWidths: [],
  };

  componentDidMount() {
    const widths = this.props.columnWidths;
    if (widths) {
      this.setState({ columnWidths: widths }); // eslint-disable-line
    }
  }

  setColumnWidth = (columnIndex: number, width: number) => {
    const { columnWidths } = this.state;
    if (width === columnWidths[columnIndex]) {
      return;
    }
    columnWidths[columnIndex] = width;
    this.setState({ columnWidths });
  };

  getColumnWidth = (columnIndex: any) => {
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
        {(headers as any[]).map((header, index) => (
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
          render={({ id, children, hasChildren, content }: any) => (
            <Row itemId={id} items={children} hasChildren={hasChildren}>
              {(columns as any[]).map((CellContent, index) => (
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
      <div role="treegrid" aria-readonly>
        {heads}
        {rows}
        {this.props.children}
      </div>
    );
  }
}
