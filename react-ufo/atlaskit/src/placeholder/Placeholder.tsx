import React, { useContext } from 'react';

import UFOLoadHold from '../load-hold';

import { LazySuspense, type LazySuspenseProps, WaitContext } from './loosely-lazy';

/**
 * Provides a placeholder for lazily loaded content, improving perceived performance.
 *
 * Named placeholders are especially useful for analyzing page load breakdowns
 * in performance monitoring tools like Performance Portal.
 */
export default function Placeholder({
	name,
	children,
	fallback = null,
}: {
	name: string;
	children?: LazySuspenseProps['children'];
	fallback?: LazySuspenseProps['fallback'];
}) {
	const waitContext = useContext(WaitContext);
	const shouldHold = !waitContext || !!waitContext.currentValue();

	return (
		<LazySuspense
			fallback={
				<>
					{fallback}
					<UFOLoadHold name={name} hold={shouldHold} />
				</>
			}
			name={name}
		>
			{children}
		</LazySuspense>
	);
}
