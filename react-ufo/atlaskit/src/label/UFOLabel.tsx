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
const UFOLabel: {
	(props: { name: string; children: ReactNode }): React.JSX.Element;
	displayName: string;
} = ({ name, children }) => {
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
};

UFOLabel.displayName = 'UFOLabel';

export default UFOLabel;
