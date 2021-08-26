import React, { useContext, useRef, useCallback } from 'react';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type { TypeAheadItem, OnSelectItem } from '../types';
import { TypeAheadListItem } from './TypeAheadListItem';
import { useResizeObserver } from './hooks/use-resize-observer';

type ListItemActionsContextProps = {
  onItemHover: OnSelectItem;
  onItemClick: (mode: SelectItemMode, index: number) => void;
};
type DynamicHeightListItemProps = {
  index: number;
  data: Array<TypeAheadItem>;
  style: any;
};
type UpdateListItemHeightContextType = (props: {
  index: number;
  height: number;
}) => void;

const noop = () => {};
export const SelectedIndexContext = React.createContext<number>(0);
export const ListItemActionsContext = React.createContext<
  ListItemActionsContextProps
>({
  onItemClick: noop,
  onItemHover: noop,
});
export const UpdateListItemHeightContext = React.createContext<
  UpdateListItemHeightContextType
>(noop);

export const DynamicHeightListItem: React.FC<DynamicHeightListItemProps> = ({
  index,
  data,
  style,
}) => {
  const item = data[index];
  const selectedIndex = useContext(SelectedIndexContext);
  const { onItemClick, onItemHover } = useContext(ListItemActionsContext);
  const updateItemHeight = useContext(UpdateListItemHeightContext);
  const innerDivRef = useRef(document.createElement('div'));
  const onResize = useCallback(
    (entry: ResizeObserverEntry) => {
      if (typeof updateItemHeight !== 'function') {
        return;
      }

      updateItemHeight({ index, height: entry.contentRect.height });
    },
    [updateItemHeight, index],
  );

  useResizeObserver(innerDivRef, onResize);

  return (
    <div style={style} data-index={index}>
      <div ref={innerDivRef} data-testid={`list-item-height-observed-${index}`}>
        <TypeAheadListItem
          key={item.title}
          item={item}
          itemIndex={index}
          selectedIndex={selectedIndex}
          onItemClick={onItemClick}
          onItemHover={onItemHover}
        />
      </div>
    </div>
  );
};
