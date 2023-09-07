import React, {
  createContext,
  FC,
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import __noop from '@atlaskit/ds-lib/noop';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

/**
 *
 *  @internal
 * LevelContext which maintains the current level of nested layers
 * Default is 0
 */
const LevelContext = createContext(0);

/**
 *
 *  @internal
 * TopLevelContext which maintains the top level ref and setTopLevel method of layers
 * Default ref value is null
 *
 */
const TopLevelContext = createContext<{
  topLevelRef: MutableRefObject<number | null>;
  setTopLevel: (level: number) => void;
}>({
  topLevelRef: { current: null },
  setTopLevel: __noop,
});

/**
 *
 *  @internal
 * Context Provider Component which provider the current level of nested layers
 * It handles level management when it mounts and unmounts
 *
 */
const LevelProvider: FC<{
  children: ReactNode;
  currentLevel: number;
}> = ({ children, currentLevel }) => {
  const { setTopLevel } = useContext(TopLevelContext);
  setTopLevel(currentLevel);
  useEffect(() => {
    return () => setTopLevel(currentLevel - 1);
  }, [setTopLevel, currentLevel]);
  return (
    <LevelContext.Provider value={currentLevel}>
      {children}
    </LevelContext.Provider>
  );
};

/**
 *
 *  @internal
 * Context Provider Component which provides the top level of all nested layers
 * It provides initial top level ref value as 0 and set top level method
 *
 */
const LayeringProvider: FC = ({ children }) => {
  const topLevelRef = useRef(0);
  const value = useMemo(
    () => ({
      topLevelRef,
      setTopLevel: (level: number) => {
        topLevelRef.current = level;
      },
    }),
    [topLevelRef],
  );
  return (
    <TopLevelContext.Provider value={value}>
      {children}
    </TopLevelContext.Provider>
  );
};

/**
 * __UNSAFE_LAYERING__
 *
 * @experimental Still under development. Do not use.
 *
 * @important the component is under feature flag platform.design-system-team.layering_qmiw3
 *
 * Layering component is a wrapper to let children to consume layer contexts and hooks.
 *
 */
export const UNSAFE_LAYERING: FC = ({ children }) => {
  const currentLevel = useContext(LevelContext);
  const isNested = currentLevel > 0;
  if (!getBooleanFF('platform.design-system-team.layering_qmiw3')) {
    return <>{children}</>;
  }

  const content = (
    <LevelProvider currentLevel={currentLevel + 1}>{children}</LevelProvider>
  );

  return isNested ? content : <LayeringProvider>{content}</LayeringProvider>;
};

/**
 *
 * @@experimental Still under development. Do not use.
 *
 * Layering hook to get layering info like the current level, the top level of
 * the given component
 *
 */
export const UNSAFE_useLayering = () => {
  const currentLevel = useContext(LevelContext);
  const { topLevelRef } = useContext(TopLevelContext);
  const checkIfTopLayer = useCallback(
    () => currentLevel !== topLevelRef.current,
    [currentLevel, topLevelRef],
  );
  return { currentLevel, topLevelRef, checkIfTopLayer };
};
