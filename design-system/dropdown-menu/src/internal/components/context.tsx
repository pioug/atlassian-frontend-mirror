import React, {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useMemo,
  useRef,
} from 'react';

/**
 *
 *  @internal
 * Context which maintains the current level of dropdown menu if it is nested
 * Default is 0
 *
 */
export const NestedLevelContext = createContext(0);

/**
 *
 * @internal
 * Context which maintains the maximun level of dropdown menu if it is nested
 * Default is 0
 *
 */
export const TrackMaxLevelContext = createContext<{
  maxLevelRef: MutableRefObject<number>;
  setMaxLevel: (level: number, isMin?: boolean) => void;
}>({
  maxLevelRef: { current: 0 },
  setMaxLevel: () => {},
});

/**
 *
 *  @internal
 * Context provider which maintains the maximun level of dropdown menu if it is nested
 *
 */
export const TrackLevelProvider = ({ children }: PropsWithChildren<{}>) => {
  const maxLevelRef = useRef(0);

  const value = useMemo(
    () => ({
      maxLevelRef,
      setMaxLevel: (level: number, isMin = false) => {
        maxLevelRef.current = isMin
          ? Math.min(maxLevelRef.current, level)
          : level;
      },
    }),
    [maxLevelRef],
  );
  return (
    <TrackMaxLevelContext.Provider value={value}>
      {children}
    </TrackMaxLevelContext.Provider>
  );
};
