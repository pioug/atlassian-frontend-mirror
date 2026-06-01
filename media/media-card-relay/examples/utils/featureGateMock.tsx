/**
 * Feature Gate Mock Utilities for Examples
 *
 * This file provides example-only infrastructure for overriding feature gates
 * during development and testing. It is NOT intended for production use.
 *
 * The `FeatureGateMock` component allows examples to temporarily force a feature
 * gate to a specific value (true/false) and automatically restores the original
 * behavior on unmount.
 */

import React, { useEffect, useRef, type ReactNode } from 'react';

import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

// PFF_GLOBAL_KEY is the window key used by @atlaskit/platform-feature-flags internals.
// We inline the string here to avoid importing from an unexported subpath.
const PFF_GLOBAL_KEY = '__PLATFORM_FEATURE_FLAGS__' as const;

type FeatureFlagResolverBoolean = (key: string) => boolean;

export interface FeatureGateMockProps {
	/** The name of the feature gate to mock (e.g., 'platform_media_ssr_data_seed') */
	gateName: string;
	/** The value to force the gate to return */
	gateValue: boolean;
	/** Child components to render within the mock context */
	children: ReactNode;
}

/**
 * FeatureGateMock component that temporarily overrides a feature gate value.
 *
 * This component saves the current gate resolver on mount, replaces it with
 * one that returns `gateValue` for the specified `gateName`, and restores
 * the original resolver on unmount.
 *
 * @example
 * // Force a gate ON for demonstration
 * <FeatureGateMock gateName="platform_media_ssr_data_seed" gateValue={true}>
 *   <MyComponent />
 * </FeatureGateMock>
 */
export const FeatureGateMock: React.FC<FeatureGateMockProps> = ({
	gateName,
	gateValue,
	children,
}) => {
	// Track the original resolver to restore it on unmount
	const originalResolverRef = useRef<FeatureFlagResolverBoolean | undefined>();

	useEffect(() => {
		// Save the current global state
		const globalVar = (typeof window !== 'undefined' ? window : globalThis) as any;
		const currentState = globalVar[PFF_GLOBAL_KEY];
		originalResolverRef.current = currentState?.booleanResolver;

		// Create a new resolver that returns gateValue for gateName,
		// and delegates other gates to the original resolver
		const mockResolver: FeatureFlagResolverBoolean = (key: string) => {
			if (key === gateName) {
				return gateValue;
			}
			// Delegate to the original resolver if it exists
			if (originalResolverRef.current) {
				return originalResolverRef.current(key);
			}
			// Fallback: use the default fg behavior (which may check FeatureGates.checkGate)
			return false;
		};

		// Install the mock resolver
		setBooleanFeatureFlagResolver(mockResolver);

		// Cleanup: restore the original resolver on unmount
		return () => {
			if (originalResolverRef.current) {
				setBooleanFeatureFlagResolver(originalResolverRef.current);
			} else {
				// If there was no original resolver, clear it (set to undefined)
				const globalVar = (typeof window !== 'undefined' ? window : globalThis) as any;
				if (globalVar[PFF_GLOBAL_KEY]) {
					globalVar[PFF_GLOBAL_KEY].booleanResolver = undefined;
				}
			}
		};
	}, [gateName, gateValue]);

	return <>{children}</>;
};

/**
 * HOC that wraps a component with FeatureGateMock set to gateValue={true}
 *
 * @example
 * export const MediaCardRelayWithGateOn = withGateOn(
 *   'platform_media_ssr_data_seed',
 *   MediaCardRelay
 * );
 */
export function withGateOn<P extends object>(
	gateName: string,
	Component: React.ComponentType<P>,
): React.FC<P> {
	const WrappedComponent = (props: P) => (
		<FeatureGateMock gateName={gateName} gateValue={true}>
			<Component {...props} />
		</FeatureGateMock>
	);
	WrappedComponent.displayName = `withGateOn(${Component.displayName || Component.name || 'Component'})`;
	return WrappedComponent;
}

/**
 * HOC that wraps a component with FeatureGateMock set to gateValue={false}
 *
 * @example
 * export const MediaCardRelayWithGateOff = withGateOff(
 *   'platform_media_ssr_data_seed',
 *   MediaCardRelay
 * );
 */
export function withGateOff<P extends object>(
	gateName: string,
	Component: React.ComponentType<P>,
): React.FC<P> {
	const WrappedComponent = (props: P) => (
		<FeatureGateMock gateName={gateName} gateValue={false}>
			<Component {...props} />
		</FeatureGateMock>
	);
	WrappedComponent.displayName = `withGateOff(${Component.displayName || Component.name || 'Component'})`;
	return WrappedComponent;
}
