import React, { Component } from 'react';

import { Selection } from 'prosemirror-state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import {
  getSelectionRect,
  isTableSelected,
} from '@atlaskit/editor-tables/utils';
import { EditorView } from 'prosemirror-view';
import { createPortal } from 'react-dom';

import { Popup } from '@atlaskit/editor-common';
import { akEditorTableNumberColumnWidth } from '@atlaskit/editor-shared-styles';

import { closestElement } from '../../../../utils/dom';
import { INPUT_METHOD } from '../../../analytics';
import { clearHoverSelection, hoverColumns, hoverRows } from '../../commands';
import {
  deleteColumnsWithAnalytics,
  deleteRowsWithAnalytics,
} from '../../commands-with-analytics';
import { getPluginState as getTablePluginState } from '../../pm-plugins/plugin-factory';
import { RowStickyState } from '../../pm-plugins/sticky-headers';
import { TableCssClassName as ClassName } from '../../types';
import {
  getColumnDeleteButtonParams,
  getColumnsWidths,
  getRowDeleteButtonParams,
  getRowHeights,
} from '../../utils';
import tableMessages from '../messages';
import { stickyRowZIndex } from '../consts';

import DeleteButton from './DeleteButton';
import getPopupOptions from './getPopUpOptions';
import { CellSelectionType } from './types';

export interface Props {
  editorView: EditorView;
  selection: Selection;
  tableRef?: HTMLTableElement;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  stickyHeaders?: RowStickyState;
  isNumberColumnEnabled?: boolean;
}

export interface State {
  selectionType?: CellSelectionType;
  left: number;
  top: number;
  indexes: number[];
  position?: string;
  scrollLeft: number;
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

  wrapper: HTMLElement | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      selectionType: undefined,
      top: 0,
      left: 0,
      indexes: [],
      scrollLeft: 0,
    };
  }

  shouldComponentUpdate(_: Props, nextState: State) {
    return (
      this.state.selectionType !== nextState.selectionType ||
      this.state.left !== nextState.left ||
      this.state.top !== nextState.top ||
      this.state.scrollLeft !== nextState.scrollLeft
    );
  }

  componentDidMount() {
    this.updateWrapper();
  }

  componentDidUpdate() {
    this.updateWrapper();
  }

  updateWrapper = () => {
    const tableWrapper = closestElement(
      this.props.tableRef,
      `.${ClassName.TABLE_NODE_WRAPPER}`,
    );
    if (tableWrapper) {
      this.wrapper = tableWrapper;
      this.wrapper.addEventListener('scroll', this.onWrapperScrolled);

      this.setState({
        scrollLeft: tableWrapper.scrollLeft,
      });
    } else {
      if (this.wrapper) {
        // unsubscribe if we previously had one and it just went away
        this.wrapper.removeEventListener('scroll', this.onWrapperScrolled);

        // and reset scroll position
        this.setState({
          scrollLeft: 0,
        });
      }

      this.wrapper = null;
    }
  };

  componentWillUnmount() {
    if (this.wrapper) {
      this.wrapper.removeEventListener('scroll', this.onWrapperScrolled);
    }
  }

  onWrapperScrolled = (e: Event) => {
    const wrapper = e.target as HTMLElement;
    this.setState({
      scrollLeft: wrapper.scrollLeft,
    });
  };

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

    const inStickyMode =
      nextProps.stickyHeaders && nextProps.stickyHeaders.sticky;

    const rect = getSelectionRect(nextProps.selection);

    // only tie row delete to sticky header if it's the only thing
    // in the selection, otherwise the row delete will hover around
    // the rest of the selection
    const firstRowInSelection = rect && rect.top === 0 && rect.bottom === 1;
    const shouldStickyButton = inStickyMode && firstRowInSelection;
    const stickyTop = nextProps.stickyHeaders
      ? nextProps.stickyHeaders.top + nextProps.stickyHeaders.padding
      : 0;

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
              top: inStickyMode ? nextProps.stickyHeaders!.top : 0,
              position: inStickyMode ? 'sticky' : undefined,
              selectionType,
            };
          }
          return null;
        }
        case 'row': {
          // Calculate the button position and indexes for rows
          if (nextProps.tableRef) {
            const rowHeights = getRowHeights(nextProps.tableRef);
            const offsetTop = inStickyMode ? -rowHeights[0] : 0;

            const deleteBtnParams = getRowDeleteButtonParams(
              rowHeights,
              nextProps.editorView.state.selection,
              shouldStickyButton ? stickyTop : offsetTop,
            );

            if (deleteBtnParams) {
              return {
                ...deleteBtnParams,
                position: shouldStickyButton ? 'sticky' : undefined,
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

    const button = (
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
    );

    const popupOpts = getPopupOptions({
      left: this.state.left,
      top: this.state.top,
      selectionType: this.state.selectionType,
      tableWrapper: this.wrapper,
    });

    const mountTo = tableContainerWrapper || mountPoint;
    if (this.state.position === 'sticky' && mountTo) {
      const headerRow = tableRef.querySelector('tr.sticky');
      if (headerRow) {
        const rect = headerRow!.getBoundingClientRect();

        const calculatePosition =
          popupOpts.onPositionCalculated || ((pos) => pos);
        const pos = calculatePosition({
          left: this.state.left,
          top: this.state.top,
        });

        return createPortal(
          <div
            style={{
              position: 'fixed',
              top: pos.top,
              zIndex: stickyRowZIndex,
              left:
                rect.left +
                (pos.left || 0) -
                (this.state.selectionType === 'column'
                  ? this.state.scrollLeft
                  : 0) -
                (this.props.isNumberColumnEnabled
                  ? akEditorTableNumberColumnWidth
                  : 0),
            }}
          >
            {button}
          </div>,
          mountTo,
        );
      }
    }

    return (
      <Popup
        target={tableRef}
        mountTo={mountTo}
        boundariesElement={tableContainerWrapper || boundariesElement}
        scrollableElement={this.wrapper || undefined}
        forcePlacement={true}
        allowOutOfBounds
        {...popupOpts}
      >
        {button}
      </Popup>
    );
  }
}

export default FloatingDeleteButton;
