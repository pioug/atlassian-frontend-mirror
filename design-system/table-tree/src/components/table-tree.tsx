/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import Cell from './cell';
import Header from './header';
import Headers from './headers';
import { type ColumnWidth, TableTreeContext } from './internal/context';
import Row from './row';
import Rows from './rows';

interface State {
  columnWidths: ColumnWidth[];
}

export default class TableTree extends Component<any, State> {
  state: State = {
    columnWidths: [],
  };

  componentDidMount() {
    const widths = this.props.columnWidths;
    if (widths) {
      this.setState({ columnWidths: widths }); // eslint-disable-line
    }
  }

  setColumnWidth = (columnIndex: number, width: ColumnWidth) => {
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

  render() {
    const {
      items,
      shouldExpandOnClick,
      headers,
      columns,
      columnWidths = [],
      mainColumnForExpandCollapseLabel,
    } = this.props;
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
    let rows: React.ReactNode = null;
    if (columns && items) {
      rows = (
        <Rows
          items={items}
          render={({ id, children, hasChildren, content }: any) => {
            return (
              <Row
                itemId={id}
                items={children}
                hasChildren={hasChildren}
                shouldExpandOnClick={shouldExpandOnClick}
                mainColumnForExpandCollapseLabel={
                  mainColumnForExpandCollapseLabel
                }
              >
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
            );
          }}
        />
      );
    }
    return (
      <TableTreeContext.Provider
        value={{
          setColumnWidth: this.setColumnWidth,
          getColumnWidth: this.getColumnWidth,
        }}
      >
        <div role="treegrid" aria-readonly>
          {heads}
          {rows}
          {this.props.children}
        </div>
      </TableTreeContext.Provider>
    );
  }
}
