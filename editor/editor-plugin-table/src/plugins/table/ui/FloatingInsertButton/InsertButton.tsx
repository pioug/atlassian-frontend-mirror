/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import type { SyntheticEvent } from 'react';
import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import {
  addColumnAfter,
  addRowAfter,
  ToolTipContent,
} from '@atlaskit/editor-common/keymaps';
import { tableMarginTop } from '@atlaskit/editor-common/styles';
import { closestElement } from '@atlaskit/editor-common/utils';
import { akEditorTableNumberColumnWidth } from '@atlaskit/editor-shared-styles';
import Tooltip from '@atlaskit/tooltip';

import type { TableDirection } from '../../types';
import { TableCssClassName as ClassName } from '../../types';
import { tableToolbarSize } from '../consts';
import tableMessages from '../messages';

export interface ButtonProps {
  type: TableDirection;
  tableRef: HTMLElement;
  onMouseDown: (event: SyntheticEvent<HTMLButtonElement>) => void;
  hasStickyHeaders: boolean;
}

const getInsertLineHeight = (
  tableRef: HTMLElement,
  hasStickyHeaders: boolean,
) => {
  // The line gets height 100% from the table,
  // but since we have an overflow on the left,
  // we should add an offset to make up for it.
  const LINE_OFFSET = 3;

  const ADDITIONAL_HEIGHT = hasStickyHeaders
    ? tableRef.getBoundingClientRect().top - tableMarginTop * 4 - LINE_OFFSET
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
  const { parentElement, offsetWidth } = tableRef;
  const parentOffsetWidth = parentElement!.offsetWidth;
  const { scrollLeft } = parentElement!;
  const diff = offsetWidth - parentOffsetWidth;
  const toolbarSize = isDragAndDropEnabled ? 0 : getToolbarSize(tableRef);
  return (
    Math.min(
      offsetWidth + toolbarSize,
      parentOffsetWidth + toolbarSize - Math.max(scrollLeft - diff, 0),
    ) + LINE_OFFSET
  );
};

const tooltipMessageByType = (type: TableDirection) => {
  return type === 'row' ? tableMessages.insertRow : tableMessages.insertColumn;
};

export const InsertButtonForDragAndDrop = ({
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
        <div className={ClassName.DRAG_CONTROLS_INSERT_BUTTON_INNER}>
          <button
            type="button"
            className={ClassName.DRAG_CONTROLS_INSERT_BUTTON}
            onMouseDown={onMouseDown}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.41667 4.58333V2.91667C5.41667 2.80616 5.37277 2.70018 5.29463 2.62204C5.21649 2.5439 5.11051 2.5 5 2.5C4.88949 2.5 4.78351 2.5439 4.70537 2.62204C4.62723 2.70018 4.58333 2.80616 4.58333 2.91667V4.58333H2.91667C2.80616 4.58333 2.70018 4.62723 2.62204 4.70537C2.5439 4.78351 2.5 4.88949 2.5 5C2.5 5.11051 2.5439 5.21649 2.62204 5.29463C2.70018 5.37277 2.80616 5.41667 2.91667 5.41667H4.58333V7.08333C4.58333 7.19384 4.62723 7.29982 4.70537 7.37796C4.78351 7.4561 4.88949 7.5 5 7.5C5.11051 7.5 5.21649 7.4561 5.29463 7.37796C5.37277 7.29982 5.41667 7.19384 5.41667 7.08333V5.41667H7.08333C7.19384 5.41667 7.29982 5.37277 7.37796 5.29463C7.4561 5.21649 7.5 5.11051 7.5 5C7.5 4.88949 7.4561 4.78351 7.37796 4.70537C7.29982 4.62723 7.19384 4.58333 7.08333 4.58333H5.41667Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div
          className={ClassName.CONTROLS_INSERT_LINE}
          style={
            type === 'row'
              ? { width: getInsertLineWidth(tableRef, true), left: '14px' }
              : { height: getInsertLineHeight(tableRef, hasStickyHeaders) - 11 }
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
