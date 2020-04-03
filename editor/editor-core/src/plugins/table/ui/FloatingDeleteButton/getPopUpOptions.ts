import { CellSelectionType } from './types';
import { PopupProps } from '@atlaskit/editor-common';
import {
  tableDeleteButtonOffset,
  tableToolbarSize,
  tableDeleteButtonSize,
} from '../styles';

interface GetPopupOptions {
  left: number;
  top: number;
  selectionType?: CellSelectionType;
  tableWrapper: HTMLElement | null;
}

const DELETE_BUTTON_CONTROLS_OFFSET =
  tableToolbarSize + tableDeleteButtonSize + tableDeleteButtonOffset;

function getColumnOptions(
  left: number,
  tableWrapper: HTMLElement | null,
): Partial<PopupProps> {
  return {
    alignX: 'left',
    alignY: 'start',
    offset: [left, DELETE_BUTTON_CONTROLS_OFFSET],
    shouldRenderPopup() {
      if (tableWrapper) {
        const rect = tableWrapper.getBoundingClientRect();
        const maxVisibleLeftPosition =
          rect.width + tableWrapper.scrollLeft - tableDeleteButtonSize;
        const minVisibleLeftPosition = tableWrapper.scrollLeft;
        return (
          maxVisibleLeftPosition - left > 0 && left > minVisibleLeftPosition
        );
      }
      return true;
    },
  };
}

function getRowOptions(top: number): Partial<PopupProps> {
  return {
    alignX: 'left',
    alignY: 'start',
    forcePlacement: true,
    offset: [0, -top],
    onPositionCalculated(position) {
      return {
        ...position,
        // We need to force left to always be the offset to not be affected by overflow
        left: -DELETE_BUTTON_CONTROLS_OFFSET,
      };
    },
  };
}

export default function getPopupOptions({
  left,
  top,
  selectionType,
  tableWrapper,
}: GetPopupOptions): Partial<PopupProps> {
  switch (selectionType) {
    case 'column':
      return getColumnOptions(left, tableWrapper);
    case 'row':
      return getRowOptions(top);
    default: {
      return {};
    }
  }
}
