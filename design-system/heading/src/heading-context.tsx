import React, { createContext, type ReactNode, useContext } from 'react';

// Allows support for heading levels 1-9 via aria-level
type HeadingLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type HeadingElement = `h${1 | 2 | 3 | 4 | 5 | 6}` | 'div';

const HeadingLevelContext = createContext<HeadingLevel>(0);

/**
 * @internal
 * @returns The current heading level context.
 */
const useHeadingLevel = (): HeadingLevel => {
	return useContext(HeadingLevelContext);
};

/**
 * Infers the correct heading markup based on the current heading level context.
 */
export const useHeading: (fallback: HeadingElement) => readonly [HeadingLevel, HeadingElement] = (
	fallback: HeadingElement,
) => {
	const hLevel = useHeadingLevel();
	/**
	 * Order here is important, we for now apply
	 * 1. inferred a11y level (this only applies if context is present)
	 * 2. default final fallback
	 */
	return [
		hLevel,
		((hLevel && (hLevel > 6 ? 'div' : `h${hLevel as 1 | 2 | 3 | 4 | 5 | 6}`)) ||
			fallback) as HeadingElement,
	] as const;
};

interface HeadingLevelContextProps {
	/**
	 * Optional - only apply this value if the intent is to reset the heading context outside the normal content flow, for example inside a `section`.
	 */
	value?: HeadingLevel;
	/**
	 * Semantic hierarchy of content below the heading context.
	 */
	children: ReactNode;
}

/**
 * __Heading level provider__
 *
 * The Heading level provider injects the heading level to all `Heading` components below it in the component tree.
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
}: HeadingLevelContextProps): React.JSX.Element => {
	const parentHeadingLevel = useHeadingLevel();
	const headingLevel = (parentHeadingLevel + 1) as HeadingLevel;
	return (
		<HeadingLevelContext.Provider value={value || headingLevel}>
			{children}
		</HeadingLevelContext.Provider>
	);
};

export default HeadingLevelContextProvider;
