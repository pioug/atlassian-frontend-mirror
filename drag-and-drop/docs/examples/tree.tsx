/** @jsx jsx */
import { useContext, useEffect, useMemo, useReducer, useRef } from 'react';

import { css, jsx } from '@emotion/react';
import memoizeOne from 'memoize-one';
import invariant from 'tiny-invariant';

import {
  Instruction,
  ItemMode,
} from '@atlaskit/drag-and-drop-hitbox/experimental/tree-item';
import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import { token } from '@atlaskit/tokens';

import {
  dataReducer,
  getInitialData,
  tree,
  TreeItem as TreeItemType,
} from './data/tree';
import {
  DependencyContext,
  TreeContext,
  TreeContextValue,
} from './pieces/tree/tree-context';
import TreeItem from './pieces/tree/tree-item';

const treeStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  width: 240,
  padding: 8,
  flexDirection: 'column',
  background: token('elevation.surface.sunken', '#F7F8F9'),
});

export default function Tree() {
  const [data, updateData] = useReducer(dataReducer, null, getInitialData);
  const ref = useRef<HTMLDivElement>(null);
  const { extractInstruction } = useContext(DependencyContext);

  let lastStateRef = useRef<TreeItemType[]>(data);
  useEffect(() => {
    lastStateRef.current = data;
  }, [data]);

  const context = useMemo<TreeContextValue>(
    () => ({
      dispatch: updateData,
      uniqueContextId: Symbol('unique-id'),
      // memoizing this function as it is called by all tree items repeatedly
      // An ideal refactor would be to update our data shape
      // to allow quick lookups of parents
      getPathToItem: memoizeOne(
        (targetId: string) =>
          tree.getPathToItem({ current: lastStateRef.current, targetId }) ?? [],
      ),
    }),
    [updateData],
  );

  useEffect(() => {
    invariant(ref.current);
    return combine(
      monitorForElements({
        canMonitor: ({ source }) =>
          source.data.uniqueContextId === context.uniqueContextId,
        onDrop(args) {
          const { location, source } = args;
          // didn't drop on anything
          if (!location.current.dropTargets.length) {
            return;
          }

          if (source.data.type === 'tree-item') {
            const itemId = source.data.id as string;

            const target = location.current.dropTargets[0];
            const targetId = target.data.id as string;

            const instruction: Instruction | null = extractInstruction(
              target.data,
            );

            if (instruction !== null) {
              updateData({
                type: 'instruction',
                instruction,
                itemId,
                targetId,
              });
            }
          }
        },
      }),
    );
  }, [context, extractInstruction]);

  return (
    <TreeContext.Provider value={context}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <div css={treeStyles} id="tree" ref={ref}>
          {data.map((item, index, array) => {
            const type: ItemMode = (() => {
              if (item.children.length && item.isOpen) {
                return 'expanded';
              }

              if (index === array.length - 1) {
                return 'last-in-group';
              }

              return 'standard';
            })();

            return <TreeItem item={item} level={0} key={item.id} mode={type} />;
          })}
        </div>
      </div>
    </TreeContext.Provider>
  );
}
