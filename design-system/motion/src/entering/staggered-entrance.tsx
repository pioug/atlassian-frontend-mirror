import React, { createContext, Ref, useContext, useRef, useState } from 'react';

import { useLayoutEffect } from '../utils/use-layout-effect';
import { useUniqueId } from '../utils/use-unique-id';

export interface StaggeredEntranceProps {
  /**
   * Delay in ms.
   * How long each element group will be staggered.
   * This will be multipled by the column and row of the element.
   * Defaults to `50`.
   */
  delayStep?: number;

  /**
   Number of columns the children elements will be displayed over.
   Use `"responsive"` to have it calculate dynamically on the client side.

   **NOTE:** This has a big caveat that the elements will be invisible until the client side Javascript executes.
   If you have a fixed grid or list, set this to a specific number.
   Defaults to `"responsive"`.
   */
  columns?: number | 'responsive';

  /**
   * Index of the column.
   * Useful if you want to have columns inside separate containers.
   * Starts from `0`.
   */
  column?: number;

  /**
   * Any valid react child with an entrance motion somewhere in the tree as a descendant.
   */
  children: JSX.Element | JSX.Element[];
}

const StaggeredEntranceContext = createContext<
  (id: string) => { isReady: boolean; delay: number; ref: Ref<any> }
>(() => ({ isReady: true, delay: 0, ref: () => {} }));

export const useStaggeredEntrance = () => {
  const indentifier = useUniqueId();
  const context = useContext(StaggeredEntranceContext);
  return context(indentifier);
};

/**
 * For a list of elements that need to animate in,
 * this should be used in conjunction with entering components.
 * This does not need Javascript to execute so it will run immediately for any SSR rendered React apps before the JS has executed.
 *
 * Will dynamically add delay to each child entering component.
 * Unfortunately all entering components _NEED_ to be a direct descendant.
 */
const StaggeredEntrance: React.FC<StaggeredEntranceProps> = ({
  children,
  column,
  columns = 'responsive',
  delayStep = 50,
}: StaggeredEntranceProps) => {
  const elementRefs = useRef<(HTMLElement | null)[]>([]);
  const indexes: string[] = [];

  const [actualColumns, setActualColumns] = useState(() => {
    if (typeof columns === 'number') {
      // A hardcoded columns is set so bail out and set it to that!
      return columns;
    }

    if (typeof column === 'number') {
      // A hardcoded column is set so we will set actualColumns to be 1.
      return 1;
    }

    // We are in "responsive" mode.
    // So we will be calculating when the Javascript executes on the client how many columns there will be.
    return 0;
  });

  useLayoutEffect(() => {
    // We want to only run this code when we are in "responsive" mode.
    // It is assumed we are in responsive mode if `columns` is "responsive",
    // we have children element refs ready to be read (i.e. if there are no children this won't run as well)
    // and finally that `actualColumns` is `0` - this is because for the first render cycle `actualColumns` will be `0` (set above)
    // and then after this layout effect runs the value for `actualColumns` will then be calculated and set.
    if (
      columns === 'responsive' &&
      elementRefs.current.length &&
      actualColumns === 0
    ) {
      let currentTop: number = 0;
      let numberColumns: number = 0;

      if (elementRefs.current.length <= 1) {
        setActualColumns(1);
        return;
      }

      // We set the current top to the first elements.
      // We will be comparing this and incrementing the column count
      // until we hit an element that has a different offset top (or we run out of elements).
      currentTop = elementRefs.current[0]
        ? elementRefs.current[0].offsetTop
        : 0;

      for (let i = 0; i < elementRefs.current.length; i++) {
        const child = elementRefs.current[i];
        if (!child) {
          break;
        }

        if (currentTop === child.offsetTop) {
          numberColumns += 1;

          if (elementRefs.current.length - 1 === i) {
            setActualColumns(numberColumns);
          }

          continue;
        }

        setActualColumns(numberColumns);
        break;
      }
    }
    // We only want this effect to run once - on initial mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StaggeredEntranceContext.Provider
      value={(id) => {
        if (!indexes.includes(id)) {
          indexes.push(id);
        }

        const isReady = actualColumns > 0;
        const index = indexes.indexOf(id);
        const currentColumn = column || index % actualColumns;
        const currentRow = Math.floor(index / actualColumns);
        const distanceFromTopLeftElement = currentRow + currentColumn;
        // We don't want loads of elements to have the same staggered delay as it ends up looking slow for users.
        // To get around that we calculate the logarithm using `distanceFromTopLeftElement` which ends making
        // elements appear faster the further away from the top left element.
        const delay =
          Math.ceil(
            Math.log(distanceFromTopLeftElement + 1) * delayStep * 1.5,
          ) || 0;

        return {
          delay,
          isReady,
          ref: (element: HTMLElement | null) =>
            (elementRefs.current[index] = element),
        };
      }}
    >
      {children}
    </StaggeredEntranceContext.Provider>
  );
};

export default StaggeredEntrance;
