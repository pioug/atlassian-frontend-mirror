/** @jsx jsx */
import { jsx } from '@emotion/react';
import {
  VirtualItem as VirtualItemContext,
  Virtualizer,
  VirtualizerOptions,
  observeElementRect,
  observeElementOffset,
  elementScroll,
} from '@tanstack/react-virtual';
import React, { PureComponent, createRef, UIEvent } from 'react';
import { virtualList } from './styles';

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

export const virtualListScrollContainerTestId = 'virtual-list-scroll-container';

export class VirtualList extends PureComponent<Props> {
  private parentRef: React.RefObject<HTMLDivElement>;
  private rowVirtualizer: Virtualizer<any, any>;
  /**
   * Determine if the component is mounted to the DOM or not
   */
  private _isMounted = false;

  constructor(props: Props) {
    super(props);
    this.parentRef = createRef<HTMLDivElement>();
    this.rowVirtualizer = new Virtualizer(this.getVirtualizerOptions(props));
  }

  private getVirtualizerOptions(props: Props) {
    const { rowCount, rowHeight, overscanRowCount } = props;
    return {
      observeElementRect: observeElementRect,
      observeElementOffset: observeElementOffset,
      scrollToFn: elementScroll,
      count: rowCount,
      getScrollElement: () => this.parentRef.current,
      estimateSize: rowHeight,
      overscan: overscanRowCount,
      onChange: () => {
        this.forceUpdateGrid();
      },
    } as VirtualizerOptions<any, any>;
  }

  private isElementVisible(element: Element) {
    const parent = this.parentRef.current as Element;
    const elementRect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const elemTop = elementRect.top;
    const elemBottom = elementRect.bottom;
    const parentTop = parentRect.top;
    const parentBottom = parentRect.bottom;

    // Only completely visible elements return true:
    const isVisible = elemTop >= parentTop && elemBottom <= parentBottom;
    return isVisible;
  }

  private getFirstVisibleListElementIndex() {
    const virtualList = this.rowVirtualizer.getVirtualItems();
    const renderedElements = this.parentRef.current?.firstChild?.childNodes;
    let firstVisibleIndex: number = 0;
    renderedElements?.forEach((value, key) => {
      if (this.isElementVisible(value as Element)) {
        firstVisibleIndex = key;
        return;
      }
    });

    return virtualList[firstVisibleIndex]?.index || 0;
  }

  private onRendered() {
    const { onRowsRendered } = this.props;
    this.rowVirtualizer.setOptions(this.getVirtualizerOptions(this.props));

    const startIndex = this.getFirstVisibleListElementIndex();
    onRowsRendered({ startIndex });
  }

  componentDidUpdate() {
    this.onRendered();
  }

  componentDidMount() {
    if (this.rowVirtualizer) {
      this.rowVirtualizer._didMount();
      this.rowVirtualizer._willUpdate();
      this._isMounted = true;
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  scrollToRow(index?: number) {
    const { scrollToAlignment } = this.props;
    if (index !== undefined) {
      this.rowVirtualizer?.scrollToIndex(index, {
        align: scrollToAlignment,
        smoothScroll: false,
      });
      this.forceUpdateGrid();
    }
  }

  forceUpdateGrid() {
    if (this._isMounted) {
      this.forceUpdate();
    }
  }

  recomputeRowHeights() {
    this.rowVirtualizer?.measure();
  }

  handleScroll(e: UIEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  render() {
    const { rowRenderer, width, height } = this.props;
    return (
      <div
        ref={this.parentRef}
        role="grid"
        style={{
          height: `${height}px`,
          width: `${width}px`,
          overflow: 'auto',
        }}
        css={virtualList}
        data-testid={virtualListScrollContainerTestId}
        onScroll={this.handleScroll}
      >
        <div
          style={{
            height: `${this.rowVirtualizer?.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {this.rowVirtualizer?.getVirtualItems().map((virtualRow) => (
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
  }
}
