import { useContext, useMemo } from 'react';

import { XpcDestinationResolver } from './xpcDestinationResolver';
import { XpcFinalSinkDepartureCapture } from './xpcFinalSinkDepartureCapture';
import { XpcNavigationContext, type XpcNavigationSurfaces } from './xpcNavigationContext';

export const useXpcFinalSinkCapture = (
	surface: Exclude<keyof XpcNavigationSurfaces, 'native'>,
): XpcFinalSinkDepartureCapture | undefined => {
	const context = useContext(XpcNavigationContext);

	return useMemo(() => {
		const controlledSurface = context?.surfaces[surface];
		if (!context || !controlledSurface) {
			return;
		}

		return new XpcFinalSinkDepartureCapture({
			baseUrl: context.baseUrl,
			coordinator: context.coordinator,
			isEnabled: context.isEnabled,
			parseCompatibleXpis: context.parseCompatibleXpis,
			reporter: context.reporter,
			resolveDestination: (url) =>
				XpcDestinationResolver.resolve({
					baseUrl: context.baseUrl,
					registry: context.registry,
					source: context.source,
					url,
				}),
			source: context.source,
			surface: controlledSurface,
		});
	}, [context, surface]);
};
