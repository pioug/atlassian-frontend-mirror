import React, { Component } from 'react';
import { Popup } from '@atlaskit/editor-common';
import { CellSelection } from 'prosemirror-tables';
import { getSelectionRect, isTableSelected } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { INPUT_METHOD } from '../../../analytics';
import { clearHoverSelection, hoverColumns, hoverRows } from '../../commands';
import {
  deleteColumnsWithAnalytics,
  deleteRowsWithAnalytics,
} from '../../commands-with-analytics';
import { TableCssClassName as ClassName } from '../../types';
import {
  getColumnDeleteButtonParams,
  getColumnsWidths,
  getRowDeleteButtonParams,
  getRowHeights,
} from '../../utils';
import tableMessages from '../messages';
import DeleteButton from './DeleteButton';
import getPopupOptions from './getPopUpOptions';
import { CellSelectionType } from './types';
import { Selection } from 'prosemirror-state';
import { getPluginState as getTablePluginState } from '../../pm-plugins/plugin-factory';
import { closestElement } from '../../../../utils/dom';

export interface Props {
  editorView: EditorView;
  selection: Selection;
  tableRef?: HTMLTableElement;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
}

export interface State {
  selectionType?: CellSelectionType;
  left: number;
  top: number;
  indexes: number[];
}

export function getSelectionType(
  selection: Selection,
): 'column' | 'row' | undefined {
  if (!isTableSelected(selection) && selection instanceof CellSelection) {
    if (selection.isRowSelection()) {
      return 'row';
    }
    if (selection.isColSelection()) {
      return 'column';
    }
  }

  return;
}

class FloatingDeleteButton extends Component<Props, State> {
  static displayName = 'FloatingDeleteButton';

  constructor(props: Props) {
    super(props);

    this.state = {
      selectionType: undefined,
      top: 0,
      left: 0,
      indexes: [],
    };
  }

  shouldComponentUpdate(_: Props, nextState: State) {
    return (
      this.state.selectionType !== nextState.selectionType ||
      this.state.left !== nextState.left ||
      this.state.top !== nextState.top
    );
  }

  /**
   * We derivate the button state from the properties passed.
   * We do this in here because we need this information in different places
   * and this prevent to do multiple width calculations in the same component.
   */
  static getDerivedStateFromProps(
    nextProps: Readonly<Props>,
    prevState: State,
  ): Partial<State> | null {
    const selectionType = getSelectionType(nextProps.selection);

    if (selectionType) {
      switch (selectionType) {
        case 'column': {
          // Calculate the button position and indexes for columns
          const columnsWidths = getColumnsWidths(nextProps.editorView);
          const deleteBtnParams = getColumnDeleteButtonParams(
            columnsWidths,
            nextProps.editorView.state.selection,
          );
          if (deleteBtnParams) {
            return {
              ...deleteBtnParams,
              top: 0,
              selectionType,
            };
          }
          return null;
        }
        case 'row': {
          // Calculate the button position and indexes for rows
          if (nextProps.tableRef) {
            const rowHeights = getRowHeights(nextProps.tableRef);
            const deleteBtnParams = getRowDeleteButtonParams(
              rowHeights,
              nextProps.editorView.state.selection,
            );
            if (deleteBtnParams) {
              return {
                ...deleteBtnParams,
                left: 0,
                selectionType: selectionType,
              };
            }
          }

          return null;
        }
      }
    }

    // Clean state if no type
    if (prevState.selectionType !== selectionType) {
      return {
        selectionType: undefined,
        top: 0,
        left: 0,
        indexes: [],
      };
    }

    // Do nothing if doesn't change anything
    return null;
  }

  private handleMouseEnter = () => {
    const { state, dispatch } = this.props.editorView;
    switch (this.state.selectionType) {
      case 'row': {
        return hoverRows(this.state.indexes!, true)(
          state,
          dispatch,
          this.props.editorView,
        );
      }
      case 'column': {
        return hoverColumns(this.state.indexes!, true)(
          state,
          dispatch,
          this.props.editorView,
        );
      }
    }
    return false;
  };

  private handleMouseLeave = () => {
    const { state, dispatch } = this.props.editorView;
    return clearHoverSelection()(state, dispatch);
  };

  /**
   *
   *
   * @private
   * @memberof FloatingDeleteButton
   */
  private handleClick = () => {
    let { state, dispatch } = this.props.editorView;
    const {
      pluginConfig: { isHeaderRowRequired },
    } = getTablePluginState(state);

    const rect = getSelectionRect(state.selection);
    if (rect) {
      switch (this.state.selectionType) {
        case 'column': {
          deleteColumnsWithAnalytics(INPUT_METHOD.BUTTON, rect)(
            state,
            dispatch,
          );
          return;
        }
        case 'row': {
          deleteRowsWithAnalytics(
            INPUT_METHOD.BUTTON,
            rect,
            !!isHeaderRowRequired,
          )(state, dispatch);
          return;
        }
      }
    }
    ({ state, dispatch } = this.props.editorView);
    clearHoverSelection()(state, dispatch);
  };

  render() {
    const { mountPoint, boundariesElement, tableRef } = this.props;
    const { selectionType } = this.state;

    if (!selectionType || !tableRef) {
      return null;
    }

    const tableContainerWrapper = closestElement(
      tableRef,
      `.${ClassName.TABLE_CONTAINER}`,
    );

    const tableWrapper = closestElement(
      tableRef,
      `.${ClassName.TABLE_NODE_WRAPPER}`,
    );

    return (
      <Popup
        target={tableRef!}
        mountTo={tableContainerWrapper || mountPoint}
        boundariesElement={tableContainerWrapper || boundariesElement}
        scrollableElement={tableWrapper!}
        forcePlacement={true}
        allowOutOfBounds
        {...getPopupOptions({
          left: this.state.left,
          top: this.state.top,
          selectionType: this.state.selectionType,
          tableWrapper,
        })}
      >
        <DeleteButton
          removeLabel={
            selectionType === 'column'
              ? tableMessages.removeColumns
              : tableMessages.removeRows
          }
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
      </Popup>
    );
  }
}

export default FloatingDeleteButton;
