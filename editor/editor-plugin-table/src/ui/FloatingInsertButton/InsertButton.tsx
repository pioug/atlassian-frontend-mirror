/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import type { SyntheticEvent } from 'react';
import React from 'react';

import classnames from 'classnames';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import {
  addColumnAfter,
  addRowAfter,
  ToolTipContent,
} from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { tableMarginTop } from '@atlaskit/editor-common/styles';
import { closestElement } from '@atlaskit/editor-common/utils';
import { akEditorTableNumberColumnWidth } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import type { TableDirection } from '../../types';
import { TableCssClassName as ClassName } from '../../types';
import { tableToolbarSize } from '../consts';

export interface ButtonProps {
  type: TableDirection;
  tableRef: HTMLElement;
  onMouseDown: (event: SyntheticEvent<HTMLButtonElement>) => void;
  hasStickyHeaders: boolean;
}

const getInsertLineHeight = (
  tableRef: HTMLElement,
  hasStickyHeaders: boolean,
  isDragAndDropEnabled?: boolean,
) => {
  // The line gets height 100% from the table,
  // but since we have an overflow on the left,
  // we should add an offset to make up for it.
  const LINE_OFFSET = 3;

  const ADDITIONAL_HEIGHT = hasStickyHeaders
    ? tableRef.getBoundingClientRect().top -
      tableMarginTop * (isDragAndDropEnabled ? 3 : 4) -
      LINE_OFFSET
    : tableToolbarSize + LINE_OFFSET;
  return tableRef.offsetHeight + ADDITIONAL_HEIGHT;
};

const getToolbarSize = (tableRef: HTMLElement): number => {
  const parent = closestElement(tableRef, `.${ClassName.TABLE_CONTAINER}`);
  if (parent) {
    return parent.querySelector(`.${ClassName.NUMBERED_COLUMN}`)
      ? tableToolbarSize + akEditorTableNumberColumnWidth - 1
      : tableToolbarSize;
  }

  return tableToolbarSize;
};

const getInsertLineWidth = (
  tableRef: HTMLElement,
  isDragAndDropEnabled?: boolean,
) => {
  // The line gets width 100% from the table,
  // but since we have an overflow on the left,
  // we should add an offset to make up for it.
  const LINE_OFFSET = 4;
  const DRAG_LINE_OFFSET = 6;
  const { parentElement, offsetWidth } = tableRef;
  const parentOffsetWidth = parentElement!.offsetWidth;
  const { scrollLeft } = parentElement!;
  const diff = offsetWidth - parentOffsetWidth;
  const toolbarSize = isDragAndDropEnabled ? 0 : getToolbarSize(tableRef);
  const lineOffset = isDragAndDropEnabled ? DRAG_LINE_OFFSET : LINE_OFFSET;

  return (
    Math.min(
      offsetWidth + toolbarSize,
      parentOffsetWidth + toolbarSize - Math.max(scrollLeft - diff, 0),
    ) + lineOffset
  );
};

const tooltipMessageByType = (type: TableDirection) => {
  return type === 'row' ? messages.insertRow : messages.insertColumn;
};

export const InsertButtonForDragAndDrop = ({
  onMouseDown,
  tableRef,
  type,
  intl: { formatMessage },
  hasStickyHeaders,
}: ButtonProps & WrappedComponentProps) => {
  const isRow = type === 'row';

  const content = (
    <Tooltip
      content={
        <ToolTipContent
          description={formatMessage(
            isRow ? messages.insertRowDrag : messages.insertColumnDrag,
          )}
          keymap={isRow ? addRowAfter : addColumnAfter}
        />
      }
      position="top"
    >
      <>
        <div
          className={classnames(ClassName.DRAG_CONTROLS_INSERT_BUTTON_INNER, {
            [ClassName.DRAG_CONTROLS_INSERT_BUTTON_INNER_ROW]: isRow,
            [ClassName.DRAG_CONTROLS_INSERT_BUTTON_INNER_COLUMN]: !isRow,
          })}
        >
          <button
            type="button"
            className={ClassName.DRAG_CONTROLS_INSERT_BUTTON}
            onMouseDown={onMouseDown}
          >
            <svg
              className={ClassName.CONTROLS_BUTTON_ICON}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 4C7.44771 4 7 4.44771 7 5V7H5C4.44771 7 4 7.44771 4 8C4 8.55229 4.44771 9 5 9H7V11C7 11.5523 7.44771 12 8 12C8.55229 12 9 11.5523 9 11V9H11C11.5523 9 12 8.55229 12 8C12 7.44771 11.5523 7 11 7H9V5C9 4.44771 8.55229 4 8 4Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div
          className={ClassName.CONTROLS_INSERT_LINE}
          style={
            type === 'row'
              ? {
                  width: getInsertLineWidth(tableRef, true),
                  left: token('space.150', '12px'),
                }
              : {
                  height:
                    getInsertLineHeight(tableRef, hasStickyHeaders, true) - 8,
                  top: '-3px',
                }
          }
        />
      </>
    </Tooltip>
  );

  const floatingButtonClassName = isRow
    ? ClassName.CONTROLS_FLOATING_BUTTON_ROW
    : ClassName.CONTROLS_FLOATING_BUTTON_COLUMN;

  return (
    <div className={floatingButtonClassName}>
      <div
        className={`${ClassName.DRAG_CONTROLS_INSERT_BUTTON_WRAP} ${ClassName.CONTROLS_INSERT_ROW}`}
      >
        {content}
      </div>
    </div>
  );
};

export const DragAndDropInsertButton = injectIntl(InsertButtonForDragAndDrop);

const InsertButton = ({
  onMouseDown,
  tableRef,
  type,
  intl: { formatMessage },
  hasStickyHeaders,
}: ButtonProps & WrappedComponentProps) => {
  const content = (
    <Tooltip
      content={
        <ToolTipContent
          description={formatMessage(tooltipMessageByType(type))}
          keymap={type === 'row' ? addRowAfter : addColumnAfter}
        />
      }
      position="top"
    >
      <>
        <div className={ClassName.CONTROLS_INSERT_BUTTON_INNER}>
          <button
            type="button"
            className={ClassName.CONTROLS_INSERT_BUTTON}
            onMouseDown={onMouseDown}
          >
            <svg className={ClassName.CONTROLS_BUTTON_ICON}>
              <path
                d="M10 4a1 1 0 0 1 1 1v4h4a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div
          className={ClassName.CONTROLS_INSERT_LINE}
          style={
            type === 'row'
              ? { width: getInsertLineWidth(tableRef) }
              : { height: getInsertLineHeight(tableRef, hasStickyHeaders) }
          }
        />
      </>
    </Tooltip>
  );

  const floatingButtonClassName =
    type === 'column'
      ? ClassName.CONTROLS_FLOATING_BUTTON_COLUMN
      : ClassName.CONTROLS_FLOATING_BUTTON_ROW;

  return (
    <div className={floatingButtonClassName}>
      <div
        className={`${ClassName.CONTROLS_INSERT_BUTTON_WRAP} ${ClassName.CONTROLS_INSERT_ROW}`}
      >
        {content}
      </div>
    </div>
  );
};

export default injectIntl(InsertButton);
