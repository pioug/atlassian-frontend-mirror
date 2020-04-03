import React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { clearHoverSelection } from '../../../commands';
import { TableCssClassName as ClassName } from '../../../types';
import {
  RowParams,
  getRowHeights,
  getRowsParams,
  getRowClassNames,
} from '../../../utils';

export interface Props {
  editorView: EditorView;
  tableRef: HTMLTableElement;
  selectRow: (row: number, expand: boolean) => void;
  hoverRows: (rows: number[], danger?: boolean) => void;
  hoveredRows?: number[];
  isInDanger?: boolean;
  isResizing?: boolean;
  insertRowButtonIndex?: number;
}

export default class RowControls extends Component<Props, any> {
  render() {
    const {
      editorView,
      tableRef,
      hoveredRows,
      isInDanger,
      isResizing,
    } = this.props;
    if (!tableRef) {
      return null;
    }
    const { selection } = editorView.state;
    const rowHeights = getRowHeights(tableRef);
    const rowsParams = getRowsParams(rowHeights);

    return (
      <div className={ClassName.ROW_CONTROLS}>
        <div className={ClassName.ROW_CONTROLS_INNER}>
          {rowsParams.map(({ startIndex, endIndex, height }: RowParams) => (
            <div
              className={`${
                ClassName.ROW_CONTROLS_BUTTON_WRAP
              } ${getRowClassNames(
                startIndex,
                selection,
                hoveredRows,
                isInDanger,
                isResizing,
              )}`}
              key={startIndex}
              style={{ height }}
            >
              <button
                type="button"
                className={`${ClassName.ROW_CONTROLS_BUTTON}
                  ${ClassName.CONTROLS_BUTTON}
                `}
                onClick={event =>
                  this.props.selectRow(startIndex, event.shiftKey)
                }
                onMouseOver={() => this.props.hoverRows([startIndex])}
                onMouseOut={this.clearHoverSelection}
                data-start-index={startIndex}
                data-end-index={endIndex}
              />

              <div className={ClassName.CONTROLS_INSERT_MARKER} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  private clearHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    clearHoverSelection()(state, dispatch);
  };
}
