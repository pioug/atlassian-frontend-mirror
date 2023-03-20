/** @jsx jsx */
import { jsx } from '@emotion/react';
import { VirtualItem as VirtualItemContext } from '@tanstack/react-virtual';
import React, { useCallback, useImperativeHandle } from 'react';
import { virtualList } from './styles';
import { useVirtualizer } from '@tanstack/react-virtual';

type Props = {
  overscanRowCount: number;
  rowHeight: (index: number) => number;
  rowRenderer: (context: VirtualItemContext) => JSX.Element;
  onRowsRendered: (indexes: { startIndex: number }) => void;
  rowCount: number;
  scrollToAlignment: 'start' | 'end';
  width: number;
  height: number;
};

export type ListRef = {
  scrollToRow: (index?: number) => void;
};

export const virtualListScrollContainerTestId = 'virtual-list-scroll-container';

export const VirtualList = React.forwardRef<ListRef, Props>((props, ref) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const currentIndex = React.useRef<number>(0);
  const { rowRenderer, onRowsRendered, scrollToAlignment, width, height } =
    props;

  const getVirtualizerOptions = () => {
    const { rowCount, rowHeight, overscanRowCount } = props;
    return {
      count: rowCount,
      getScrollElement: () => parentRef.current,
      estimateSize: rowHeight,
      overscan: overscanRowCount,
      onChange: () => {
        const startIndex = getFirstVisibleListElementIndex();
        onRowsRendered({ startIndex });
      },
    };
  };

  const rowVirtualizer = useVirtualizer(getVirtualizerOptions());

  const isElementVisible = (element: Element) => {
    const parent = parentRef.current as Element;
    const elementRect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const elemTop = elementRect.top;
    const elemBottom = elementRect.bottom;
    const parentTop = parentRect.top;
    const parentBottom = parentRect.bottom;

    // Only completely visible elements return true:
    const isVisible = elemTop >= parentTop && elemBottom <= parentBottom;
    return isVisible;
  };

  const getFirstVisibleListElementIndex = useCallback(() => {
    const virtualList = rowVirtualizer.getVirtualItems();
    const renderedElements = parentRef.current?.firstChild?.childNodes;
    if (
      virtualList.length === 0 ||
      !renderedElements ||
      renderedElements.length === 0
    ) {
      return 0;
    }
    // Convert NodeListOf<ChildNodes> to ChildNodes[]
    const renderedElementsToArray = Array.from(renderedElements);
    const firstVisibleIndex = renderedElementsToArray.findIndex((elem) =>
      isElementVisible(elem as Element),
    );
    if (firstVisibleIndex !== -1) {
      return virtualList[firstVisibleIndex]?.index || 0;
    }
    return 0;
  }, [rowVirtualizer]);

  // Exposing a custom ref handle to the parent component EmojiPickerList to trigger scrollToRow via the listRef
  // https://beta.reactjs.org/reference/react/useImperativeHandle
  useImperativeHandle(
    ref,
    () => {
      return {
        scrollToRow(index?: number) {
          // only scroll if row index is defined and has changed
          if (index !== undefined && currentIndex.current !== index) {
            currentIndex.current = index;
            rowVirtualizer.scrollToIndex(index, {
              align: scrollToAlignment,
              smoothScroll: false,
            });
          }
        },
      };
    },
    [scrollToAlignment, rowVirtualizer],
  );

  return (
    <div
      ref={parentRef}
      role="grid"
      style={{
        height: `${height}px`,
        width: `${width}px`,
      }}
      css={virtualList}
      data-testid={virtualListScrollContainerTestId}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {rowRenderer(virtualRow)}
          </div>
        ))}
      </div>
    </div>
  );
});
