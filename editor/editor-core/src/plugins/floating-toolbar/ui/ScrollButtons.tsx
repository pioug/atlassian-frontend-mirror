/** @jsx jsx */
import React, { useEffect, useState, useRef } from 'react';
import { css, jsx } from '@emotion/react';
import { Node } from 'prosemirror-model';
import { IntlShape } from 'react-intl-next';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { gridSize } from '@atlaskit/theme/constants';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';
import Button from './Button';
import messages from './messages';
import rafSchedule from 'raf-schd';

const akGridSize = gridSize();

const toolbarScrollButtons = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${akGridSize / 2}px;
  padding: ${akGridSize / 2}px ${akGridSize}px;
  border-left: solid ${token('color.border', N30)} 1px;
  flex-shrink: 0;
  align-items: center;
`;

const LeftIcon = ChevronLeftLargeIcon as React.ComponentClass<any>;
const RightIcon = ChevronRightLargeIcon as React.ComponentClass<any>;

export interface Props {
  intl: IntlShape;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  node: Node;
  disabled: boolean;
}

export default ({ intl, scrollContainerRef, node, disabled }: Props) => {
  const buttonsContainerRef = useRef<HTMLDivElement>(null);
  const [needScroll, setNeedScroll] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const items = Array.from(
    (scrollContainerRef.current?.firstChild
      ?.childNodes as NodeListOf<HTMLElement>) || {},
  );

  const scheduledSetCanScroll = rafSchedule(() => {
    const { scrollLeft, scrollWidth, offsetWidth } =
      scrollContainerRef.current!;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + offsetWidth < scrollWidth - 1); // -1 to account for half pixel
  });

  const onScroll = () => scheduledSetCanScroll();

  const scrollLeft = () => {
    // find the first item partially visible
    for (const [itemIndex, item] of items.reverse().entries()) {
      const { left: itemLeft, width: itemWidth } = item.getBoundingClientRect();
      const { left: scrollContainerLeft = 0, width: scrollContainerWidth = 0 } =
        scrollContainerRef.current?.getBoundingClientRect() || {};

      // if item is partially visible on the left, scroll to it so it became the last item visible
      if (itemLeft <= scrollContainerLeft) {
        const gap = scrollContainerWidth - itemWidth;
        let scrollTo = item.offsetLeft - gap;

        // if scrollTo is same as current scrollLeft
        if (
          Math.floor(scrollTo) ===
          Math.floor(scrollContainerRef?.current?.scrollLeft || 0)
        ) {
          // if this is the first item, scroll to the beginning, otherwise find next item to scroll to
          if (itemIndex === items.length - 1) {
            scrollTo = 0;
          } else {
            continue;
          }
        }
        scrollContainerRef?.current?.scrollTo({
          top: 0,
          left: scrollTo,
          behavior: 'smooth',
        });
        break;
      }
    }
  };
  const scrollRight = () => {
    // find the last item partially visible
    for (const item of items) {
      const { left: itemLeft, width: itemWidth } = item.getBoundingClientRect();
      const { left: scrollContainerLeft = 0, width: scrollContainerWidth = 0 } =
        scrollContainerRef.current?.getBoundingClientRect() || {};

      // if item is partially visible on the right
      if (itemLeft + itemWidth >= scrollContainerLeft + scrollContainerWidth) {
        let scrollTo = item.offsetLeft;

        // if the item is longer than the entire container width, just scroll past it
        if (
          itemWidth >= scrollContainerWidth &&
          (scrollContainerRef.current?.scrollLeft || 0) >= itemLeft - 1
        ) {
          scrollTo = item.offsetLeft + item.offsetWidth;
        }

        // if scrollTo is same as current scrollLeft, find next item to scroll to
        if (
          Math.floor(scrollTo) ===
          Math.floor(scrollContainerRef?.current?.scrollLeft || 0)
        ) {
          continue;
        }

        scrollContainerRef.current?.scrollTo({
          top: 0,
          left: scrollTo,
          behavior: 'smooth',
        });
        break;
      }
    }
  };

  const resizeObserver = new ResizeObserver((t) => {
    const widthNeededToShowAllItems =
      scrollContainerRef.current?.scrollWidth || 0;
    const availableSpace = (
      scrollContainerRef.current?.parentNode as HTMLElement
    )?.offsetWidth;

    if (availableSpace >= widthNeededToShowAllItems) {
      setNeedScroll(false);
    } else {
      setNeedScroll(true);
      onScroll();
    }
  });

  useEffect(() => {
    const scrollContainerRefCurrent = scrollContainerRef.current;
    onScroll();
    if (scrollContainerRefCurrent) {
      // enable/disable scroll buttons depending on scroll position
      scrollContainerRefCurrent.addEventListener('scroll', onScroll);

      // watch for toolbar resize and show/hide scroll buttons if needed
      resizeObserver.observe(scrollContainerRefCurrent);

      // reset scroll position when switching from one node with toolbar to another
      scrollContainerRefCurrent.scrollTo({
        left: 0,
      });
    }

    return () => {
      if (scrollContainerRefCurrent) {
        scrollContainerRefCurrent.removeEventListener('scroll', onScroll);
        resizeObserver.unobserve(scrollContainerRefCurrent);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, scrollContainerRef]);

  return needScroll ? (
    <div ref={buttonsContainerRef} css={toolbarScrollButtons}>
      <Button
        title={intl.formatMessage(messages.floatingToolbarScrollLeft)}
        icon={
          <LeftIcon
            label={intl.formatMessage(messages.floatingToolbarScrollLeft)}
          />
        }
        onClick={scrollLeft}
        disabled={!canScrollLeft || disabled}
      />
      <Button
        title={intl.formatMessage(messages.floatingToolbarScrollRight)}
        icon={
          <RightIcon
            label={intl.formatMessage(messages.floatingToolbarScrollRight)}
          />
        }
        onClick={scrollRight}
        disabled={!canScrollRight || disabled}
      />
    </div>
  ) : null;
};
