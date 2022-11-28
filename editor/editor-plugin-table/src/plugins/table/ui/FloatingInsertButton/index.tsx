import React from 'react';

import { Node as PmNode } from 'prosemirror-model';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { findDomRefAtPos } from 'prosemirror-utils';
import { findTable } from '@atlaskit/editor-tables/utils';
import { EditorView } from 'prosemirror-view';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';

import { Popup } from '@atlaskit/editor-common/ui';

import { closestElement } from '@atlaskit/editor-common/utils';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
  insertColumnWithAnalytics,
  insertRowWithAnalytics,
} from '../../commands-with-analytics';
import { TableCssClassName as ClassName } from '../../types';
import { checkIfNumberColumnEnabled } from '../../utils';

import getPopupOptions from './getPopupOptions';
import InsertButton from './InsertButton';
import {
  DispatchAnalyticsEvent,
  AnalyticsEventPayload,
} from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';

export interface Props {
  editorView: EditorView;
  getEditorContainerWidth: GetEditorContainerWidth;
  tableRef?: HTMLElement;
  tableNode?: PmNode;
  insertColumnButtonIndex?: number;
  insertRowButtonIndex?: number;
  isHeaderColumnEnabled?: boolean;
  isHeaderRowEnabled?: boolean;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  hasStickyHeaders?: boolean;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  editorAnalyticsAPI?: EditorAnalyticsAPI;
}
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  CONTENT_COMPONENT,
} from '@atlaskit/editor-common/analytics';

export class FloatingInsertButton extends React.Component<
  Props & WrappedComponentProps,
  any
> {
  static displayName = 'FloatingInsertButton';

  constructor(props: Props & WrappedComponentProps) {
    super(props);
    this.insertColumn = this.insertColumn.bind(this);
    this.insertRow = this.insertRow.bind(this);
  }

  render() {
    const {
      tableNode,
      editorView,
      insertColumnButtonIndex,
      insertRowButtonIndex,
      tableRef,
      mountPoint,
      boundariesElement,
      isHeaderColumnEnabled,
      isHeaderRowEnabled,
      dispatchAnalyticsEvent,
    } = this.props;

    const type =
      typeof insertColumnButtonIndex !== 'undefined'
        ? 'column'
        : typeof insertRowButtonIndex !== 'undefined'
        ? 'row'
        : null;

    if (!tableNode || !tableRef || !type) {
      return null;
    }

    // We can’t display the insert button for row|colum index 0
    // when the header row|colum is enabled, this feature will be change on the future
    if (
      (type === 'column' &&
        isHeaderColumnEnabled &&
        insertColumnButtonIndex === 0) ||
      (type === 'row' && isHeaderRowEnabled && insertRowButtonIndex === 0)
    ) {
      return null;
    }

    const {
      state: { tr },
    } = editorView;
    if (
      tr.selection instanceof CellSelection &&
      ((tr.selection as CellSelection).isColSelection() ||
        (tr.selection as CellSelection).isRowSelection())
    ) {
      return null;
    }

    const cellPosition = this.getCellPosition(type);
    if (!cellPosition) {
      return null;
    }

    const tablePos = findTable(editorView.state.selection);
    if (!tablePos) {
      return null;
    }

    const domAtPos = editorView.domAtPos.bind(editorView);
    const pos = cellPosition + tablePos.start + 1;

    let target: Node | undefined;
    try {
      target = findDomRefAtPos(pos, domAtPos);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
      if (dispatchAnalyticsEvent) {
        const payload: AnalyticsEventPayload = {
          action: ACTION.ERRORED,
          actionSubject: ACTION_SUBJECT.CONTENT_COMPONENT,
          eventType: EVENT_TYPE.OPERATIONAL,
          attributes: {
            component: CONTENT_COMPONENT.FLOATING_INSERT_BUTTON,
            selection: editorView.state.selection.toJSON(),
            position: pos,
            docSize: editorView.state.doc.nodeSize,
            error: (error as any)?.toString(),
            errorStack: (error as any).stack || undefined,
          },
        };
        dispatchAnalyticsEvent(payload);
      }
    }

    if (!target || !(target instanceof HTMLElement)) {
      return null;
    }

    const targetCellRef =
      type === 'row'
        ? closestElement(target, 'tr')
        : closestElement(target, 'td, th');

    if (!targetCellRef) {
      return null;
    }

    const tableContainerWrapper = closestElement(
      targetCellRef,
      `.${ClassName.TABLE_CONTAINER}`,
    );
    const tableWrapper = closestElement(
      targetCellRef,
      `.${ClassName.TABLE_NODE_WRAPPER}`,
    );

    const index: number =
      type === 'column' ? insertColumnButtonIndex! : insertRowButtonIndex!;

    const hasNumberedColumns = checkIfNumberColumnEnabled(
      editorView.state.selection,
    );

    return (
      <Popup
        target={targetCellRef}
        mountTo={tableContainerWrapper || mountPoint}
        boundariesElement={tableContainerWrapper || boundariesElement}
        scrollableElement={tableWrapper!}
        forcePlacement={true}
        allowOutOfBounds
        {...getPopupOptions(
          type,
          index,
          hasNumberedColumns,
          tableContainerWrapper,
        )}
      >
        <InsertButton
          type={type}
          tableRef={tableRef}
          onMouseDown={type === 'column' ? this.insertColumn : this.insertRow}
          hasStickyHeaders={this.props.hasStickyHeaders || false}
        />
      </Popup>
    );
  }

  private getCellPosition(type: 'column' | 'row'): number | null {
    const { tableNode, insertColumnButtonIndex, insertRowButtonIndex } =
      this.props;
    const tableMap = TableMap.get(tableNode!);

    if (type === 'column') {
      const columnIndex =
        insertColumnButtonIndex === 0 ? 0 : insertColumnButtonIndex! - 1;

      if (columnIndex > tableMap.width - 1) {
        return null;
      }

      return tableMap.positionAt(0, columnIndex!, tableNode!);
    } else {
      const rowIndex =
        insertRowButtonIndex === 0 ? 0 : insertRowButtonIndex! - 1;

      if (rowIndex > tableMap.height - 1) {
        return null;
      }

      return tableMap.positionAt(rowIndex!, 0, tableNode!);
    }
  }

  private insertRow(event: React.SyntheticEvent) {
    const { editorView, insertRowButtonIndex, editorAnalyticsAPI } = this.props;

    if (typeof insertRowButtonIndex !== 'undefined') {
      event.preventDefault();

      const { state, dispatch } = editorView;
      insertRowWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.BUTTON, {
        index: insertRowButtonIndex,
        moveCursorToInsertedRow: true,
      })(state, dispatch);
    }
  }

  private insertColumn(event: React.SyntheticEvent) {
    const {
      editorView,
      insertColumnButtonIndex,
      editorAnalyticsAPI,
      getEditorContainerWidth,
    } = this.props;

    if (typeof insertColumnButtonIndex !== 'undefined') {
      event.preventDefault();

      const { state, dispatch } = editorView;
      insertColumnWithAnalytics(getEditorContainerWidth, editorAnalyticsAPI)(
        INPUT_METHOD.BUTTON,
        insertColumnButtonIndex,
      )(state, dispatch, editorView);
    }
  }
}

export default injectIntl(FloatingInsertButton);
