import React from 'react';
import { Component } from 'react';
import classnames from 'classnames';
import { EditorView } from 'prosemirror-view';
import { isTableSelected, selectTable, findTable } from 'prosemirror-utils';
import { TableMap } from 'prosemirror-tables';

import { clearHoverSelection, hoverTable } from '../../../commands';
import { TableCssClassName as ClassName } from '../../../types';

export interface Props {
  editorView: EditorView;
  tableRef?: HTMLTableElement;
  isInDanger?: boolean;
  isResizing?: boolean;
  hoveredRows?: number[];
  isHeaderColumnEnabled?: boolean;
  isHeaderRowEnabled?: boolean;
}

export default class CornerControls extends Component<Props, any> {
  render() {
    const {
      isInDanger,
      tableRef,
      isHeaderColumnEnabled,
      isHeaderRowEnabled,
    } = this.props;
    if (!tableRef) {
      return null;
    }
    const isActive = this.isActive();

    return (
      <div
        className={classnames(ClassName.CORNER_CONTROLS, {
          active: isActive,
        })}
      >
        <button
          type="button"
          className={classnames(ClassName.CONTROLS_CORNER_BUTTON, {
            danger: isActive && isInDanger,
          })}
          onClick={this.selectTable}
          onMouseOver={this.hoverTable}
          onMouseOut={this.clearHoverSelection}
        />

        {!isHeaderRowEnabled && (
          <div className={ClassName.CORNER_CONTROLS_INSERT_ROW_MARKER}>
            <div className={ClassName.CONTROLS_INSERT_MARKER} />
          </div>
        )}
        {!isHeaderColumnEnabled && (
          <div className={ClassName.CORNER_CONTROLS_INSERT_COLUMN_MARKER}>
            <div className={ClassName.CONTROLS_INSERT_MARKER} />
          </div>
        )}
      </div>
    );
  }

  private isActive = () => {
    const { editorView, hoveredRows, isResizing } = this.props;
    const { selection } = editorView.state;
    const table = findTable(selection);
    if (!table) {
      return false;
    }
    return (
      isTableSelected(selection) ||
      (hoveredRows &&
        hoveredRows.length === TableMap.get(table.node).height &&
        !isResizing)
    );
  };

  private clearHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    clearHoverSelection()(state, dispatch);
  };

  private selectTable = () => {
    const { state, dispatch } = this.props.editorView;
    dispatch(selectTable(state.tr).setMeta('addToHistory', false));
  };

  private hoverTable = () => {
    const { state, dispatch } = this.props.editorView;
    hoverTable()(state, dispatch);
  };
}
