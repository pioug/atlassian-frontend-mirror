import React, { type ReactNode, useContext, useMemo } from 'react';

import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';

export type UFOIgnoreHoldsReason = 'third-party-element';

export type UFOIgnoreHoldsProps = {
	children?: ReactNode;
	ignore?: boolean;
	reason?: UFOIgnoreHoldsReason;
};

/**
 * Prevent a subtree from holding up an interaction
 * Use this when you have a component which loads in late, but
 * isn't considered to be a breach of SLO
 *
 * ```js
 * <App>
 *   <Main />
 *   <Sidebar>
 *     <UFOIgnoreHolds>
 *       <InsightsButton />
 *     </UFOIgnoreHolds>
 *   </Sidebar>
 * </App>
 * ```
 *
 * Has an `ignore` prop, to allow you to use it conditionally
 * Has a `reason` prop, to specify why the hold is being ignored
 */
export default function UFOIgnoreHolds({
	children,
	ignore = true,
}: UFOIgnoreHoldsProps): React.JSX.Element {
	const parentContext = useContext(InteractionContext);

	const ignoredInteractionContext: InteractionContextType | null = useMemo(() => {
		if (!parentContext) {
			return null;
		}
		return {
			...parentContext,
			hold(...args) {
				if (!ignore) {
					return parentContext.hold(...args);
				}
			},
		};
	}, [parentContext, ignore]);

	// react-18: Use children directly
	const kids = children != null ? children : null;

	if (!ignoredInteractionContext) {
		return <>{kids}</>;
	}

	return (
		<InteractionContext.Provider value={ignoredInteractionContext}>
			{kids}
		</InteractionContext.Provider>
	);
}
