import React, { useEffect, useRef, useState } from 'react';

import invariant from 'tiny-invariant';

import {
  Edge,
  extractClosestEdge,
} from '@atlaskit/drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/drag-and-drop-hitbox/reorder-with-edge';
import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { monitorForFiles } from '@atlaskit/drag-and-drop/adapter/file';
import {
  extractCrossWindowResult,
  monitorForCrossWindowElements,
} from '@atlaskit/drag-and-drop/experimental/cross-window-element-adapter';
import { combine } from '@atlaskit/drag-and-drop/util/combine';

import Board from './cross-window-pieces/board';
import { Column } from './cross-window-pieces/column';
import { ColumnMap, ColumnType, getInitialData, Item } from './data/tasks';

export default function BoardExample() {
  const [data, setData] = useState<{
    columnMap: ColumnMap;
    orderedColumnIds: string[];
  }>(() => getInitialData());
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    invariant(ref.current);
    return combine(
      monitorForFiles({
        onDragStart: args => console.log('start:file', args.source.items),
        onDrop: args => console.log('drop:file', args.source.items),
      }),
      monitorForCrossWindowElements({
        onDragStart: args => console.log('start:external', args.source),
        onDrop: args => console.log('drop:external', args.source),
      }),
      monitorForCrossWindowElements({
        onDrop(args) {
          const { location, source } = args;
          // dropping on this list
          if (!location.current.dropTargets.length) {
            return;
          }
          console.log('dropping external', source);
          // TODO: document that all keys go to lower case
          const itemId = source.data.itemId;
          if (typeof itemId !== 'string') {
            return;
          }
          const newItem: Item = {
            itemId: (() => {
              // moving back to home window
              if (itemId.endsWith('[🛬]')) {
                return itemId.replace('[🛬]', '');
              }
              // moving to new window
              return `${itemId} [🛬]`;
            })(),
          };

          // dropping on a column but not a card - add to the end of the column
          if (location.current.dropTargets.length === 1) {
            const [destinationColumnRecord] = location.current.dropTargets;
            const destinationId = destinationColumnRecord.data.columnId;
            invariant(typeof destinationId === 'string');
            const destinationColumn = data.columnMap[destinationId];
            invariant(destinationColumn);

            const updatedMap = {
              ...data.columnMap,
              [destinationColumn.columnId]: {
                ...destinationColumn,
                items: [...destinationColumn.items, newItem],
              },
            };
            setData({ ...data, columnMap: updatedMap });
            return;
          }
          // dropping on a card in a column
          if (location.current.dropTargets.length === 2) {
            // need to insert into correct position
            const [
              destinationItemRecord,
              destinationColumnRecord,
            ] = location.current.dropTargets;
            const destinationItemId = destinationItemRecord.data.itemId;
            invariant(typeof destinationItemId === 'string');
            const destinationId = destinationColumnRecord.data.columnId;
            invariant(typeof destinationId === 'string');
            const destinationColumn = data.columnMap[destinationId];
            const destinationItemIndex = destinationColumn.items.findIndex(
              item => item.itemId === destinationItemId,
            );

            const edge: Edge | null = extractClosestEdge(
              destinationItemRecord.data,
            );

            // 1. if edge is null, new item into destinationItemIndex
            // 2. if edge is 'top', new item into destinationItemIndex
            // 3. if edge is 'bottom', net item into destinationItemIndex + 1
            const insertIndex: number =
              edge === 'bottom'
                ? destinationItemIndex + 1
                : destinationItemIndex;

            const newItems = Array.from(destinationColumn.items);
            newItems.splice(insertIndex, 0, newItem);
            const updatedMap = {
              ...data.columnMap,
              [destinationColumn.columnId]: {
                ...destinationColumn,
                items: newItems,
              },
            };
            setData({ ...data, columnMap: updatedMap });
            return;
          }
        },
      }),
      monitorForElements({
        onDrop(args) {
          const { location, source } = args;

          // if dropping a card on another window, remove it from here
          const resultFromAnotherWindow = extractCrossWindowResult();

          if (resultFromAnotherWindow) {
            // nothing to do
            if (resultFromAnotherWindow === 'none') {
              return;
            }
            // moved - need to remove card from board
            if (source.data.type !== 'card') {
              return;
            }
            const itemId = source.data.itemId;
            invariant(typeof itemId === 'string', 'unable to find itemId');

            const columnMap: ColumnMap = data.orderedColumnIds.reduce(
              (acc: ColumnMap, columnId) => {
                const column = data.columnMap[columnId];
                const updated = {
                  ...column,
                  items: column.items.filter(item => item.itemId !== itemId),
                };
                acc[column.columnId] = updated;
                return acc;
              },
              {},
            );
            setData({ ...data, columnMap });
            return;
          }

          // didn't drop on anything
          if (!location.current.dropTargets.length) {
            return;
          }
          // need to handle drop

          // 1. remove element from original position
          // 2. move to new position

          if (source.data.type === 'column') {
            const startIndex: number = data.orderedColumnIds.findIndex(
              columnId => columnId === source.data.columnId,
            );

            const target = location.current.dropTargets[0];
            const finishIndex: number = data.orderedColumnIds.findIndex(
              id => id === target.data.columnId,
            );
            const edge: Edge | null = extractClosestEdge(target.data);

            const updated = reorderWithEdge({
              list: data.orderedColumnIds,
              startIndex,
              finishIndex,
              edge,
              axis: 'horizontal',
            });

            console.log('reordering column', {
              startIndex,
              destinationIndex: updated.findIndex(
                columnId => columnId === target.data.columnId,
              ),
              edge,
            });

            setData({ ...data, orderedColumnIds: updated });
          }
          // Dragging a card
          if (source.data.type === 'card') {
            const itemId = source.data.itemId;
            invariant(typeof itemId === 'string');
            // TODO: these lines not needed if item has columnId on it
            const [, startColumnRecord] = location.initial.dropTargets;
            const sourceId = startColumnRecord.data.columnId;
            invariant(typeof sourceId === 'string');
            const sourceColumn = data.columnMap[sourceId];
            const itemIndex = sourceColumn.items.findIndex(
              item => item.itemId === itemId,
            );
            const item: Item = sourceColumn.items[itemIndex];

            if (location.current.dropTargets.length === 1) {
              const [destinationColumnRecord] = location.current.dropTargets;
              const destinationId = destinationColumnRecord.data.columnId;
              invariant(typeof destinationId === 'string');
              const destinationColumn = data.columnMap[destinationId];
              invariant(destinationColumn);

              // reordering in same column
              if (sourceColumn === destinationColumn) {
                const updated = reorderWithEdge({
                  list: sourceColumn.items,
                  startIndex: itemIndex,
                  finishIndex: sourceColumn.items.length - 1,
                  edge: null,
                  axis: 'vertical',
                });
                const updatedMap = {
                  ...data.columnMap,
                  [sourceColumn.columnId]: {
                    ...sourceColumn,
                    items: updated,
                  },
                };
                setData({ ...data, columnMap: updatedMap });
                console.log('moving card to end position in same column', {
                  startIndex: itemIndex,
                  destinationIndex: updated.findIndex(i => i.itemId === itemId),
                  edge: null,
                });
                return;
              }

              // moving to a new column
              const updatedMap = {
                ...data.columnMap,
                [sourceColumn.columnId]: {
                  ...sourceColumn,
                  items: sourceColumn.items.filter(i => i.itemId !== itemId),
                },
                [destinationColumn.columnId]: {
                  ...destinationColumn,
                  items: [...destinationColumn.items, item],
                },
              };

              setData({ ...data, columnMap: updatedMap });
              console.log('moving card to end position of another column', {
                startIndex: itemIndex,
                destinationIndex: updatedMap[
                  destinationColumn.columnId
                ].items.findIndex(i => i.itemId === itemId),
                edge: null,
              });
              return;
            }

            // dropping in a column (relative to a card)
            if (location.current.dropTargets.length === 2) {
              const [
                destinationCardRecord,
                destinationColumnRecord,
              ] = location.current.dropTargets;
              const destinationColumnId = destinationColumnRecord.data.columnId;
              invariant(typeof destinationColumnId === 'string');
              const destinationColumn = data.columnMap[destinationColumnId];

              const finishIndex = destinationColumn.items.findIndex(
                item => item.itemId === destinationCardRecord.data.itemId,
              );
              const edge: Edge | null = extractClosestEdge(
                destinationCardRecord.data,
              );

              // case 1: ordering in the same column
              if (sourceColumn === destinationColumn) {
                const updated = reorderWithEdge({
                  list: sourceColumn.items,
                  startIndex: itemIndex,
                  finishIndex,
                  edge,
                  axis: 'vertical',
                });
                const updatedSourceColumn: ColumnType = {
                  ...sourceColumn,
                  items: updated,
                };
                const updatedMap: ColumnMap = {
                  ...data.columnMap,
                  [sourceColumn.columnId]: updatedSourceColumn,
                };
                console.log('dropping relative to card in the same column', {
                  startIndex: itemIndex,
                  destinationIndex: updated.findIndex(i => i.itemId === itemId),
                  edge,
                });
                setData({ ...data, columnMap: updatedMap });
                return;
              }

              // case 2: moving into a new column relative to a card

              const updatedSourceColumn: ColumnType = {
                ...sourceColumn,
                items: sourceColumn.items.filter(i => i !== item),
              };
              const updated: Item[] = Array.from(destinationColumn.items);
              const destinationIndex =
                edge === 'bottom' ? finishIndex + 1 : finishIndex;
              updated.splice(destinationIndex, 0, item);

              const updatedDestinationColumn: ColumnType = {
                ...destinationColumn,
                items: updated,
              };
              const updatedMap: ColumnMap = {
                ...data.columnMap,
                [sourceColumn.columnId]: updatedSourceColumn,
                [destinationColumn.columnId]: updatedDestinationColumn,
              };
              console.log('dropping on a card in different column', {
                sourceColumn: sourceColumn.columnId,
                destinationColumn: destinationColumn.columnId,
                startIndex: itemIndex,
                destinationIndex,
                edge,
              });
              setData({ ...data, columnMap: updatedMap });
            }
          }
        },
      }),
    );
  }, [data]);

  return (
    <Board ref={ref}>
      {data.orderedColumnIds.map(columnId => {
        return <Column column={data.columnMap[columnId]} key={columnId} />;
      })}
    </Board>
  );
}
