import { createContext, type Context } from 'react';

import type { XpcActivationCoordinator } from './xpcActivationCoordinator';
import type { XpcDestinationRegistry, XpcSource } from './xpcDestinationResolver';
import type { XpcNavigationReporter, XpcSurface } from './xpcNavigationObservation';
import type { CompatibleXpis } from './xpcNavigationObservation';

export interface XpcNavigationSurfaces {
	native: XpcSurface;
	renderer?: XpcSurface;
	smartLink?: XpcSurface;
}

export interface XpcNavigationContextValue {
	baseUrl: string;
	coordinator: XpcActivationCoordinator;
	isEnabled?: () => boolean;
	parseCompatibleXpis?: (encodedValue: string) => CompatibleXpis | null;
	registry: XpcDestinationRegistry;
	reporter: XpcNavigationReporter;
	source: XpcSource;
	surfaces: XpcNavigationSurfaces;
}

export const XpcNavigationContext: Context<XpcNavigationContextValue | undefined> = createContext<
	XpcNavigationContextValue | undefined
>(undefined);
