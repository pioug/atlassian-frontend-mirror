import React, { Component } from 'react';

import { Selection } from 'prosemirror-state';
import { isRowSelected } from '@atlaskit/editor-tables/utils';
import { EditorView } from 'prosemirror-view';

import { clearHoverSelection } from '../../../commands';
import { TableCssClassName as ClassName } from '../../../types';
import { getRowHeights } from '../../../utils';

export interface Props {
  editorView: EditorView;
  tableRef: HTMLTableElement;
  tableActive?: boolean;
  hoverRows: (rows: number[], danger?: boolean) => void;
  hoveredRows?: number[];
  selectRow: (row: number, expand: boolean) => void;
  hasHeaderRow?: boolean;
  isInDanger?: boolean;
  isResizing?: boolean;
  stickyTop?: number;
}

export default class NumberColumn extends Component<Props, any> {
  render() {
    const { tableRef, hasHeaderRow } = this.props;
    const rowHeights = getRowHeights(tableRef);

    return (
      <div
        className={ClassName.NUMBERED_COLUMN}
        style={{
          marginTop:
            hasHeaderRow && this.props.stickyTop !== undefined
              ? rowHeights[0]
              : undefined,
        }}
      >
        {rowHeights.map((rowHeight, index) => (
          <div
            key={`wrapper-${index}`}
            className={this.getClassNames(index)}
            data-index={index}
            style={{
              height: rowHeight,
              top:
                this.props.stickyTop !== undefined &&
                hasHeaderRow &&
                index === 0
                  ? `${this.props.stickyTop}px`
                  : undefined,
            }}
            onClick={(event) => this.selectRow(index, event)}
            onMouseOver={() => this.hoverRows(index)}
            onMouseOut={this.clearHoverSelection}
          >
            {hasHeaderRow ? (index > 0 ? index : null) : index + 1}
          </div>
        ))}
      </div>
    );
  }

  private hoverRows = (index: number) =>
    this.props.tableActive ? this.props.hoverRows([index]) : null;

  private selectRow = (
    index: number,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    const { tableActive, editorView, selectRow } = this.props;
    // If selection is outside the table then first reset the selection inside table
    if (!tableActive && event.target && event.target instanceof Node) {
      const { doc, selection, tr } = editorView.state;
      const pos = editorView.posAtDOM(event.target, 1);
      const $pos = doc.resolve(pos);
      const newPos =
        selection.head > pos
          ? // Selection is after table
            // nodeSize - 3 will move the position inside last table cell
            Selection.near(doc.resolve(pos + ($pos.parent.nodeSize - 3)), -1)
          : // Selection is before table
            Selection.near($pos);
      editorView.dispatch(tr.setSelection(newPos));
    }
    selectRow(index, event.shiftKey);
  };

  private clearHoverSelection = () => {
    const { tableActive, editorView } = this.props;
    if (tableActive) {
      const { state, dispatch } = editorView;
      clearHoverSelection()(state, dispatch);
    }
  };

  private getClassNames = (index: number) => {
    const { hoveredRows, editorView, isInDanger, isResizing } = this.props;
    const isActive =
      isRowSelected(index)(editorView.state.selection) ||
      ((hoveredRows || []).indexOf(index) !== -1 && !isResizing);
    return [
      ClassName.NUMBERED_COLUMN_BUTTON,
      isActive ? ClassName.HOVERED_CELL_ACTIVE : '',
      isActive && isInDanger ? ClassName.HOVERED_CELL_IN_DANGER : '',
    ].join(' ');
  };
}
