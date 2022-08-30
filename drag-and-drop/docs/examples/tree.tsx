/** @jsx jsx */
import { useEffect, useReducer, useRef } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import {
  Edge,
  extractClosestEdge,
} from '@atlaskit/drag-and-drop-hitbox/experimental/tree';
import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import { token } from '@atlaskit/tokens';

import { dataReducer, getInitialData, TreeItemData } from './data/tree';
import { TreeContext } from './pieces/tree/tree-context';
import TreeItem from './pieces/tree/tree-item';

const treeStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  width: 240,
  padding: 8,
  flexDirection: 'column',
  background: token('elevation.surface.sunken', '#F7F8F9'),
});

const renderTreeItem = ({
  id,
  label,
  isOpen,
  children = [],
}: TreeItemData & { isOpen?: boolean; children?: TreeItemData[] }) => {
  return (
    <TreeItem key={id} id={id} label={label} isOpen={isOpen} inset={32}>
      {children.map(renderTreeItem)}
    </TreeItem>
  );
};

export default function Tree() {
  const [data, updateData] = useReducer(dataReducer, null, getInitialData);
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Fixes issue in Chrome with non-transparent background behind the badge,
   * caused by the tree's background.
   */
  useEffect(() => {
    return combine(
      monitorForElements({
        onGenerateDragPreview: () => {
          if (!ref.current) {
            return;
          }
          ref.current.style.background = 'transparent';
        },
        onDragStart: () => {
          if (!ref.current) {
            return;
          }
          ref.current.style.background = token(
            'elevation.surface.sunken',
            '#F7F8F9',
          );
        },
      }),
    );
  }, []);

  useEffect(() => {
    invariant(ref.current);
    return combine(
      monitorForElements({
        onDrop(args) {
          const { location, source } = args;
          // didn't drop on anything
          if (!location.current.dropTargets.length) {
            return;
          }

          if (source.data.type === 'tree-item') {
            console.log(args);

            const itemId = source.data.id as string;

            const target = location.current.dropTargets[0];
            const targetId = target.data.id as string;

            if (itemId === targetId) {
              return;
            }

            const edge: Edge | null = extractClosestEdge(target.data);

            if (edge !== null) {
              updateData({
                type: edge,
                itemId,
                targetId,
              });
            }
          }
        },
      }),
    );
  }, []);

  return (
    <TreeContext.Provider value={{ dispatch: updateData }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <div css={treeStyles} id="tree" ref={ref}>
          {data.map(renderTreeItem)}
        </div>
      </div>
    </TreeContext.Provider>
  );
}
