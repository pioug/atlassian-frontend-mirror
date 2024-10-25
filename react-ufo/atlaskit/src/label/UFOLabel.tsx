import React, { type ReactNode, useMemo } from 'react';

import InteractionContext, { useInteractionContext } from '../interaction-context';

/**
 * Annotate part of the react tree with a product name
 * ```
 * <UFOLabel name="card">
 *   <Card card={data} />
 * </UFOLabel>
 * ```
 */
export default function UFOLabel({ name, children }: { name: string; children: ReactNode }) {
	const context = useInteractionContext();

	const newContext = useMemo(() => {
		if (context) {
			return {
				...context,
				labelStack: context.labelStack == null ? [{ name }] : [...context.labelStack, { name }],
			};
		} else {
			return context;
		}
	}, [context, name]);

	return context ? (
		<InteractionContext.Provider value={newContext}>{children}</InteractionContext.Provider>
	) : (
		<>{children}</>
	);
}
