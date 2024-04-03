import React, { Component } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { clearHoverSelection } from '../../../commands';
import { TableCssClassName as ClassName } from '../../../types';
import type { RowParams } from '../../../utils';
import { getRowClassNames, getRowHeights, getRowsParams } from '../../../utils';
import { tableControlsSpacing, tableToolbarSize } from '../../consts';

export interface Props {
  editorView: EditorView;
  tableRef: HTMLTableElement;
  selectRow: (row: number, expand: boolean) => void;
  hoverRows: (rows: number[], danger?: boolean) => void;
  hoveredRows?: number[];
  isInDanger?: boolean;
  isResizing?: boolean;
  insertRowButtonIndex?: number;
  stickyTop?: number;
  selection?: Selection;
}

class RowControlsComponent extends Component<Props & WrappedComponentProps> {
  render() {
    const {
      editorView,
      tableRef,
      hoveredRows,
      isInDanger,
      isResizing,
      intl: { formatMessage },
      selection: selectionState,
    } = this.props;
    if (!tableRef) {
      return null;
    }
    const { selection } = editorView.state;
    const rowHeights = getRowHeights(tableRef);
    const rowsParams = getRowsParams(rowHeights);

    const firstRow = tableRef.querySelector('tr');
    const hasHeaderRow = firstRow
      ? firstRow.getAttribute('data-header-row')
      : false;

    return (
      <div className={ClassName.ROW_CONTROLS}>
        <div className={ClassName.ROW_CONTROLS_INNER}>
          {rowsParams.map(
            ({ startIndex, endIndex, height }: RowParams, index) => {
              // if previous row was header row, add its height to our margin
              let marginTop = -1;
              if (
                index === 1 &&
                hasHeaderRow &&
                this.props.stickyTop !== undefined
              ) {
                marginTop += rowHeights[index - 1] + tableToolbarSize;
              }

              const thisRowSticky =
                this.props.stickyTop !== undefined &&
                index === 0 &&
                hasHeaderRow;

              return (
                <div
                  className={`${
                    ClassName.ROW_CONTROLS_BUTTON_WRAP
                  } ${getRowClassNames(
                    startIndex,
                    selectionState || selection,
                    hoveredRows,
                    isInDanger,
                    isResizing,
                  )} ${thisRowSticky ? 'sticky' : ''}`}
                  key={startIndex}
                  style={{
                    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
                    height: height,
                    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
                    marginTop: `${marginTop}px`,
                    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
                    top: thisRowSticky
                      ? `${this.props.stickyTop! + 3}px`
                      : undefined,
                    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
                    paddingTop: thisRowSticky
                      ? `${tableControlsSpacing}px`
                      : undefined,
                  }}
                >
                  <button
                    aria-label={formatMessage(messages.rowControl)}
                    type="button"
                    className={`${ClassName.ROW_CONTROLS_BUTTON} ${ClassName.CONTROLS_BUTTON}`}
                    onClick={(event) =>
                      this.props.selectRow(startIndex, event.shiftKey)
                    }
                    onMouseOver={() => this.props.hoverRows([startIndex])}
                    onMouseOut={this.clearHoverSelection}
                    data-start-index={startIndex}
                    data-end-index={endIndex}
                  />

                  <div className={ClassName.CONTROLS_INSERT_MARKER} />
                </div>
              );
            },
          )}
        </div>
      </div>
    );
  }

  private clearHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    clearHoverSelection()(state, dispatch);
  };
}

export const RowControls = injectIntl(RowControlsComponent);
