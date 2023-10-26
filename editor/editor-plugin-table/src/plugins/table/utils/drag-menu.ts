import type {
  Command,
  CommandDispatch,
  DropdownOptionT,
} from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { TableMap } from '@atlaskit/editor-tables/table-map';

import { moveSource } from '../pm-plugins/drag-and-drop/commands';
import type { TableDirection } from '../types';

const canDecrease = (index?: number, min: number = 0) =>
  index !== undefined && index > min;
const canIncrease = (index?: number, max: number = 0) =>
  index !== undefined && index < max;

export interface DragMenuConfig extends DropdownOptionT<Command> {
  id: string;
}

export const getDragMenuConfig = (
  direction: TableDirection,
  tableMap?: TableMap,
  index?: number,
): DragMenuConfig[] => {
  const moveOptions =
    direction === 'row'
      ? [
          { label: 'up', offset: -1, canMove: canDecrease },
          {
            label: 'down',
            offset: 1,
            canMove: (index?: number) =>
              canIncrease(index, (tableMap?.height ?? 0) - 1),
          },
        ]
      : [
          { label: 'left', offset: -1, canMove: canDecrease },
          {
            label: 'right',
            offset: 1,
            canMove: (index?: number) =>
              canIncrease(index, (tableMap?.width ?? 0) - 1),
          },
        ];

  return [
    ...moveOptions.map(({ label, offset, canMove }) => ({
      id: `move_${direction}_${label}`,
      title: `Move ${direction} ${label}`,
      disabled: !canMove(index),
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
  ];
};
