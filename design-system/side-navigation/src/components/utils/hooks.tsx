import { MutableRefObject, useEffect, useRef } from 'react';

import { ROOT_ID } from '../NestableNavigationContent';

export const useChildIds = (
  currentStackId: string,
  committedStack: string[],
  onUnknownNest?: (stack: string[]) => void,
) => {
  const childIdsRef = useRef(new Set<string>());

  useEffect(() => {
    // we are holding navigation item IDs in childIdsRef
    // check if the current displayed nav item (currentStackId) is in childIdsRef. if it's not, this means it's undefined
    if (
      currentStackId === ROOT_ID ||
      !childIdsRef.current.size ||
      childIdsRef.current.has(currentStackId) ||
      !onUnknownNest
    ) {
      return;
    }

    onUnknownNest(committedStack || [currentStackId]);
  }, [currentStackId, committedStack, onUnknownNest]);

  return { childIdsRef };
};

export const useChildIdsEffect = (
  childIds: MutableRefObject<Set<string>>,
  id: string,
) => {
  useEffect(() => {
    if (!childIds || !childIds.current) {
      return;
    }

    if (!childIds.current.has(id)) {
      childIds.current.add(id);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      childIds.current.delete(id);
    };
    // childIds shouldn't change as it's a ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
};
