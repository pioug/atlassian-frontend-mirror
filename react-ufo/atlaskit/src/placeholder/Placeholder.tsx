import React, { useContext } from 'react';

import UFOLoadHold from '../load-hold';

import { LazySuspense, type LazySuspenseProps, WaitContext } from './loosely-lazy';

/**
 * @private
 * @deprecated Use `atlaskit/react-ufo/suspense` instead.
 *
 * Provides a placeholder for lazily loaded content (via react-loosely-lazy), improving perceived performance.
 */
export default function Placeholder({
	name,
	children,
	fallback = null,
}: {
	name: string;
	children?: LazySuspenseProps['children'];
	fallback?: LazySuspenseProps['fallback'];
}): React.JSX.Element {
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
