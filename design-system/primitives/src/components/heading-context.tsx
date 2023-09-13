import React, { createContext, FC, ReactNode, useContext } from 'react';

// Allows support for heading levels 1-9 via aria-level
type HeadingElement = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const HeadingContext = createContext<HeadingElement>(0);

export const useHeadingElement = (): HeadingElement => {
  return useContext(HeadingContext);
};

export interface HeadingContextProps {
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
 * __Heading context__
 *
 * The HeadingContext
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
const HeadingContextProvider: FC<HeadingContextProps> = ({
  children,
  value,
}) => {
  const parentHeadingLevel = useHeadingElement();
  const headingLevel = (parentHeadingLevel + 1) as HeadingElement;
  return (
    <HeadingContext.Provider value={value || headingLevel}>
      {children}
    </HeadingContext.Provider>
  );
};

export default HeadingContextProvider;
