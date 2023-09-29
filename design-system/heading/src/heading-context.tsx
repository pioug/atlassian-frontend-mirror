import React, { createContext, ReactNode, useContext } from 'react';

// Allows support for heading levels 1-9 via aria-level
type HeadingElement = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const HeadingLevelContext = createContext<HeadingElement>(0 as HeadingElement);

/**
 * @internal
 * @returns The current heading level context.
 */
export const useHeadingElement = (): HeadingElement => {
  return useContext(HeadingLevelContext);
};

export interface HeadingLevelContextProps {
  /**
   * Optional - only apply this value if the intent is to reset the heading context outside the normal content flow, for example inside a `section`.
   */
  value?: HeadingElement;
  /**
   * Semantic heirarchy of content below the heading context.
   */
  children: ReactNode;
}

/**
 * __Heading level provider__
 *
 * The Heading level provider injectes the heading level to all `Heading` components below it in the component tree.
 *
 * @example
 * ```tsx
 * // Will correctly infer the heading level
 * <HeadingContext value={1}>
 *  <Heading>H1</Heading>
 *  <HeadingContext>
 *    <Heading>H2</Heading>
 *  </HeadingContext>
 * </HeadingContext>
 * ```
 */
const HeadingLevelContextProvider = ({
  children,
  value,
}: HeadingLevelContextProps) => {
  const parentHeadingLevel = useHeadingElement();
  const headingLevel = (parentHeadingLevel + 1) as HeadingElement;
  return (
    <HeadingLevelContext.Provider value={value || headingLevel}>
      {children}
    </HeadingLevelContext.Provider>
  );
};

export default HeadingLevelContextProvider;
