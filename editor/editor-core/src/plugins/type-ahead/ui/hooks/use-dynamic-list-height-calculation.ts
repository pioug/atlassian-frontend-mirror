import { useMemo, useState, useRef, useCallback, useLayoutEffect } from 'react';
import throttle from 'lodash/throttle';

export const calcVisibleListHeight = ({
  startIndex,
  indexHeightMap,
  limit,
  listMaxHeight,
  listItemEstimatedHeight,
}: {
  startIndex: number;
  indexHeightMap: Array<number>;
  limit: number;
  listMaxHeight: number;
  listItemEstimatedHeight: number;
}) => {
  let hasSpace = true;
  let totalHeight = 0;
  let i = startIndex;
  while (hasSpace && i < limit) {
    const nextHeight = indexHeightMap[i] || listItemEstimatedHeight;

    if (totalHeight < listMaxHeight) {
      totalHeight += nextHeight;
    }

    i++;
    hasSpace = totalHeight <= listMaxHeight;
  }

  return totalHeight;
};

type SetListItemHeight = (props: { index: number; height: number }) => void;
type GetListItemHeight = (index: number) => number;
type Props = {
  redrawListAtIndex: (index: number) => void;
  getFirstVisibleIndex: () => number;
  listLength: number;
  listMaxHeight: number;
  listItemEstimatedHeight: number;
};
export const useDynamicListHeightCalculation = ({
  redrawListAtIndex,
  getFirstVisibleIndex,
  listLength,
  listMaxHeight,
  listItemEstimatedHeight,
}: Props) => {
  const [renderedListHeight, setRenderedListHeight] = useState<number | null>(
    null,
  );
  const indexHeightMap = useRef<Array<number>>([]);
  const resetScreenThrottled = useMemo(() => {
    return throttle(
      () => {
        requestAnimationFrame(() => {
          const startIndex = getFirstVisibleIndex();
          const lastItemRenderer = indexHeightMap.current[startIndex];
          if (!lastItemRenderer) {
            return;
          }

          // This is an expensive method
          // So, we are calling it only
          // for the last top one visible
          redrawListAtIndex(startIndex);
          const nextListHeight = calcVisibleListHeight({
            startIndex,
            limit: listLength,
            indexHeightMap: indexHeightMap.current,
            listMaxHeight,
            listItemEstimatedHeight,
          });

          if (nextListHeight) {
            setRenderedListHeight(nextListHeight);
          }
        });
      },
      16, // wait for one frame
    );
  }, [
    redrawListAtIndex,
    listLength,
    listMaxHeight,
    listItemEstimatedHeight,
    getFirstVisibleIndex,
  ]);

  const setListItemHeight = useCallback<SetListItemHeight>(
    ({ index, height }) => {
      if (typeof height !== 'number') {
        return;
      }

      indexHeightMap.current[index] = height;
      resetScreenThrottled();
    },
    [resetScreenThrottled],
  );

  const getListItemHeight = useCallback<GetListItemHeight>(
    (index) => {
      const result = indexHeightMap.current[index];

      if (result && typeof result === 'number') {
        return result;
      }

      return listItemEstimatedHeight;
    },
    [listItemEstimatedHeight],
  );

  useLayoutEffect(() => {
    indexHeightMap.current = [];

    return () => {
      indexHeightMap.current = [];
    };
  }, [listLength]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    getListItemHeight,
    setListItemHeight,
    renderedListHeight,
  };
};
