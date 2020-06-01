import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { TableCssClassName as ClassName } from '../../../types';
import { containsClassName, closestElement } from '../../../../../utils/dom';
import { getPluginState as getMainPluginState } from '../../plugin-factory';
import { updateOverflowShadows } from '../../../nodeviews/update-overflow-shadows';
import { getRowHeights } from '../../../utils';

export const updateControls = (state: EditorState) => {
  const { tableRef } = getMainPluginState(state);
  if (!tableRef) {
    return;
  }
  const tr = tableRef.querySelector('tr');
  if (!tr) {
    return;
  }
  const wrapper = tableRef.parentElement;
  if (!(wrapper && wrapper.parentElement)) {
    return;
  }

  const rowControls = wrapper.parentElement.querySelectorAll<HTMLElement>(
    `.${ClassName.ROW_CONTROLS_BUTTON_WRAP}`,
  );
  const numberedRows = wrapper.parentElement.querySelectorAll<HTMLElement>(
    ClassName.NUMBERED_COLUMN_BUTTON,
  );

  const rowHeights = getRowHeights(tableRef);

  // update rows controls height on resize
  for (let i = 0, count = rowControls.length; i < count; i++) {
    const height = rowHeights[i];
    if (height) {
      rowControls[i].style.height = `${height}px`;

      if (numberedRows.length) {
        numberedRows[i].style.height = `${height}px`;
      }
    }
  }

  updateOverflowShadows(
    wrapper,
    tableRef,
    wrapper.parentElement.querySelector<HTMLElement>(
      `.${ClassName.TABLE_RIGHT_SHADOW}`,
    ),
    wrapper.parentElement.querySelector<HTMLElement>(
      `.${ClassName.TABLE_LEFT_SHADOW}`,
    ),
  );
};

export const isClickNear = (
  event: MouseEvent,
  click: { x: number; y: number },
): boolean => {
  const dx = click.x - event.clientX,
    dy = click.y - event.clientY;
  return dx * dx + dy * dy < 100;
};

export const getResizeCellPos = (
  view: EditorView,
  event: MouseEvent,
  lastColumnResizable: boolean,
): number | null => {
  const target = event.target as HTMLElement;

  if (!containsClassName(target, ClassName.RESIZE_HANDLE_DECORATION)) {
    return null;
  }

  const tableCell = closestElement(target, 'td, th');

  if (!tableCell) {
    return null;
  }

  const cellStartPosition = view.posAtDOM(tableCell, 0);
  return cellStartPosition - 1;
};
