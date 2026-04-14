import React, { type ReactNode } from 'react';

import { HeadingLevelContext } from './heading-level-context';
import type { HeadingLevel } from './types';
import { useHeadingLevel } from './use-heading-level';

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
