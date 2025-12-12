import React, { useEffect } from 'react';

import invariant from 'tiny-invariant';

import { OpenLayerObserverNamespaceContext } from './open-layer-observer-namespace-context';
import { useOpenLayerObserverNamespace } from './use-open-layer-observer-namespace';

/**
 * Creates a layer namespace for grouping layers together.
 */
export function OpenLayerObserverNamespaceProvider({
	children,
	namespace,
}: {
	children: React.ReactNode;
	namespace: string;
}): React.JSX.Element {
	// If there is an existing namespace context being provided, throw an invariant.
	// This use case is not supported at this time.
	const parentContext = useOpenLayerObserverNamespace();

	useEffect(() => {
		invariant(
			parentContext === null,
			`An OpenLayerObserver namespace already exists in this component tree: ${parentContext}. Nesting OpenLayerObserverNamespaceProvider is not supported.`,
		);
	}, [parentContext]);

	return (
		<OpenLayerObserverNamespaceContext.Provider value={namespace}>
			{children}
		</OpenLayerObserverNamespaceContext.Provider>
	);
}
