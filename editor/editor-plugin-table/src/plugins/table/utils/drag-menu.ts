import { TableSortOrder as SortOrder } from '@atlaskit/custom-steps';
import {
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
  backspace,
  tooltip,
} from '@atlaskit/editor-common/keymaps';
import type {
  Command,
  CommandDispatch,
  DropdownOptionT,
  GetEditorContainerWidth,
  IconProps,
} from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { Rect, TableMap } from '@atlaskit/editor-tables/table-map';
import ArrowDownIcon from '@atlaskit/icon/glyph/arrow-down';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import ArrowUpIcon from '@atlaskit/icon/glyph/arrow-up';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import EditorLayoutThreeEqualIcon from '@atlaskit/icon/glyph/editor/layout-three-equal';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import HipchatChevronDoubleDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-double-down';
import HipchatChevronDoubleUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-double-up';

import {
  clearMultipleCells,
  insertColumn,
  insertRow,
  sortByColumn,
} from '../commands';
import { deleteColumnsCommand } from '../commands/delete';
import { moveSource } from '../pm-plugins/drag-and-drop/commands';
import { deleteRows } from '../transforms';
import type { TableDirection } from '../types';
import {
  AddColLeftIcon,
  AddColRightIcon,
  AddRowAboveIcon,
  AddRowBelowIcon,
} from '../ui/icons';

const canDecrease = (index?: number, min: number = 0) =>
  index !== undefined && index > min;
const canIncrease = (index?: number, max: number = 0) =>
  index !== undefined && index < max;

export interface DragMenuConfig extends DropdownOptionT<Command> {
  id: string;
  icon?: React.ComponentType<IconProps>;
  keymap?: string;
}

export const getDragMenuConfig = (
  direction: TableDirection,
  getEditorContainerWidth: GetEditorContainerWidth,
  tableMap?: TableMap,
  index?: number,
  targetCellPosition?: number,
  selectionRect?: Rect,
): DragMenuConfig[] => {
  const addOptions =
    direction === 'row'
      ? [
          {
            label: 'above',
            offset: 0,
            icon: AddRowAboveIcon,
            keymap: addRowBefore,
          },
          {
            label: 'below',
            offset: 1,
            icon: AddRowBelowIcon,
            keymap: addRowAfter,
          },
        ]
      : [
          {
            label: 'left',
            offset: 0,
            icon: AddColLeftIcon,
            keymap: addColumnBefore,
          },
          {
            label: 'right',
            offset: 1,
            icon: AddColRightIcon,
            keymap: addColumnAfter,
          },
        ];
  const moveOptions =
    direction === 'row'
      ? [
          { label: 'up', offset: -1, canMove: canDecrease, icon: ArrowUpIcon },
          {
            label: 'down',
            offset: 1,
            canMove: (index?: number) =>
              canIncrease(index, (tableMap?.height ?? 0) - 1),
            icon: ArrowDownIcon,
          },
        ]
      : [
          {
            label: 'left',
            offset: -1,
            canMove: canDecrease,
            icon: ArrowLeftIcon,
          },
          {
            label: 'right',
            offset: 1,
            canMove: (index?: number) =>
              canIncrease(index, (tableMap?.width ?? 0) - 1),
            icon: ArrowRightIcon,
          },
        ];

  const sortOptions =
    direction === 'column'
      ? [
          {
            label: 'increasing',
            order: SortOrder.ASC,
            icon: HipchatChevronDoubleUpIcon,
          },
          {
            label: 'decreasing',
            order: SortOrder.DESC,
            icon: HipchatChevronDoubleDownIcon,
          },
        ]
      : [];
  return [
    ...addOptions.map(({ label, offset, icon, keymap }) => ({
      id: `add_${direction}_${label}`,
      title: `Add ${direction} ${label}`,
      icon,
      onClick: (state: EditorState, dispatch?: CommandDispatch) => {
        if (direction === 'row') {
          insertRow(index! + offset, true)(state, dispatch);
        } else {
          insertColumn(getEditorContainerWidth)(index! + offset)(
            state,
            dispatch,
          );
        }
        return true;
      },
      keymap: keymap && tooltip(keymap),
    })),
    direction === 'column'
      ? {
          id: 'distribute_columns',
          title: 'Distribute columns',
          disabled: true,
          onClick: () => {
            return false;
          },
          icon: EditorLayoutThreeEqualIcon,
        }
      : undefined,
    {
      id: 'clear_cells',
      title: 'Clear cells',
      onClick: (state: EditorState, dispatch?: CommandDispatch) => {
        clearMultipleCells(targetCellPosition)(state, dispatch);
        return true;
      },
      icon: CrossCircleIcon,
      keymap: tooltip(backspace),
    },
    {
      id: `delete_${direction}`,
      title: `Delete ${direction}`,
      onClick: (state: EditorState, dispatch?: CommandDispatch) => {
        if (direction === 'row') {
          dispatch?.(deleteRows(selectionRect!, false)(state.tr));
        } else {
          deleteColumnsCommand(selectionRect!)(state, dispatch);
        }
        return true;
      },
      icon: RemoveIcon,
    },
    ...moveOptions.map(({ label, offset, canMove, icon }) => ({
      id: `move_${direction}_${label}`,
      title: `Move ${direction} ${label}`,
      disabled: !canMove(index),
      icon,
      onClick: (state: EditorState, dispatch?: CommandDispatch) => {
        if (canMove(index)) {
          moveSource(
            `table-${direction}`,
            index!,
            index! + offset,
          )(state, dispatch);
          return true;
        }
        return false;
      },
    })),

    ...sortOptions.map(({ label, order, icon }) => ({
      id: `sort_column_${order}`,
      title: `Sort ${label}`,
      icon,
      onClick: (state: EditorState, dispatch?: CommandDispatch) => {
        sortByColumn(index!, order)(state, dispatch);
        return true;
      },
    })),
  ].filter(Boolean) as DragMenuConfig[];
};
