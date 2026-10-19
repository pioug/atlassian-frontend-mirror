import React, { useEffect, useMemo, useRef } from 'react';

import { XpcActivationCoordinator } from './xpcActivationCoordinator';
import { captureXpcArrival } from './xpcArrivalCapture';
import type { XpcDestinationRegistry, XpcSource } from './xpcDestinationResolver';
import { XpcDestinationResolver } from './xpcDestinationResolver';
import { XpcNativeDepartureCapture } from './xpcNativeDepartureCapture';
import {
	XpcNavigationContext,
	type XpcNavigationContextValue,
	type XpcNavigationSurfaces,
} from './xpcNavigationContext';
import {
	type CompatibleXpis,
	XpcNavigationObservation,
	type XpcNavigationReporter,
} from './xpcNavigationObservation';

export type { XpcNavigationSurfaces } from './xpcNavigationContext';

export interface XpcNavigationProviderProps {
	baseUrl: string;
	children?: React.ReactNode;
	initialArrivalUrl?: string;
	isEnabled?: () => boolean;
	parseCompatibleXpis?: (encodedValue: string) => CompatibleXpis | null;
	registry: XpcDestinationRegistry;
	reporter: XpcNavigationReporter;
	root: Document | null;
	source: XpcSource;
	surfaces: XpcNavigationSurfaces;
}

export const XpcNavigationProvider = ({
	baseUrl,
	children,
	initialArrivalUrl,
	isEnabled,
	parseCompatibleXpis = XpcNavigationObservation.parseCompatibleXpis,
	registry,
	reporter,
	root,
	source,
	surfaces,
}: XpcNavigationProviderProps): React.JSX.Element => {
	const coordinator = useMemo(() => new XpcActivationCoordinator(), []);
	const arrivalReported = useRef(false);
	const context = useMemo<XpcNavigationContextValue>(
		() => ({
			baseUrl,
			coordinator,
			isEnabled,
			parseCompatibleXpis,
			registry,
			reporter,
			source,
			surfaces,
		}),
		[baseUrl, coordinator, isEnabled, parseCompatibleXpis, registry, reporter, source, surfaces],
	);
	const nativeCapture = useMemo(() => {
		if (!root) {
			return;
		}

		return new XpcNativeDepartureCapture({
			baseUrl,
			coordinator,
			isEnabled,
			parseCompatibleXpis,
			reporter,
			resolveDestination: (url) =>
				XpcDestinationResolver.resolve({
					baseUrl,
					registry,
					source,
					url,
				}),
			root,
			source,
			surface: surfaces.native,
		});
	}, [
		baseUrl,
		coordinator,
		isEnabled,
		parseCompatibleXpis,
		registry,
		reporter,
		root,
		source,
		surfaces.native,
	]);

	useEffect(() => {
		nativeCapture?.start();
		return () => nativeCapture?.stop();
	}, [nativeCapture]);

	useEffect(() => {
		if (!initialArrivalUrl || arrivalReported.current) {
			return;
		}
		arrivalReported.current = true;
		captureXpcArrival({
			arrivalMethod: 'frontendInitialLoad',
			baseUrl,
			destinationProduct: source.product,
			destinationSubProduct: source.subProduct,
			isEnabled,
			parseCompatibleXpis,
			reporter,
			taxonomyVersion: registry.taxonomyVersion,
			url: initialArrivalUrl,
		});
	}, [
		baseUrl,
		initialArrivalUrl,
		isEnabled,
		parseCompatibleXpis,
		registry.taxonomyVersion,
		reporter,
		source,
	]);

	return <XpcNavigationContext.Provider value={context}>{children}</XpcNavigationContext.Provider>;
};
