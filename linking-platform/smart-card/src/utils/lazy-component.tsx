import React, { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';

const RenderNothing = (): null => null;

/**
 * `.catch` handler for a lazy loader: renders nothing if the chunk fails to load, instead of
 * throwing to the nearest error boundary (matches `react-loadable` with `loading: () => null`).
 *
 * @example lazy(() => import('./Foo').catch(renderNothingOnLoadError))
 */
export const renderNothingOnLoadError = (): { default: never } => ({
	// Typed as `never` so the fallback is assignable to whatever component type the loader
	// resolves to, and `lazy()` keeps inferring that component's props.
	default: RenderNothing as never,
});

/**
 * Wraps a `React.lazy` component in its own `<Suspense fallback={null}>`, so it renders nothing
 * while its chunk loads and never suspends (and blanks out) an ancestor such as the card itself.
 *
 * Call `lazy(() => import('...'))` inline at module scope and pass the result here, rather than
 * passing a loader into a helper that calls `lazy()` for you. Product SSR tooling (e.g.
 * Confluence's LoadableReactLazyBabelPlugin) only tracks and preloads `lazy()` calls whose loader
 * reads no function parameters or other render-time values.
 */
export const withSuspense = <P extends object>(
	LazyComponent: ComponentType<P> | LazyExoticComponent<ComponentType<P>>,
	displayName?: string,
): ComponentType<P> => {
	// Typed loosely internally: TS cannot spread generic props onto a LazyExoticComponent.
	// The returned component is still strictly typed as ComponentType<P>.
	const Component: ComponentType<any> = LazyComponent;
	const LazyComponentWithSuspense = (props: P) => (
		<Suspense fallback={null}>
			<Component {...props} />
		</Suspense>
	);

	if (displayName) {
		LazyComponentWithSuspense.displayName = displayName;
	}

	return LazyComponentWithSuspense;
};

const lazyIconCache = new Map<string, ComponentType<any>>();

/**
 * Returns a lazily loaded icon component for a dynamic icon import.
 *
 * Callers resolve the icon on every render, so the component is cached by `cacheKey` to keep a
 * stable component identity across renders (otherwise React would remount and re-suspend the
 * icon on every render). The cache entry is dropped if the chunk fails to load, so the next
 * render retries the import.
 *
 * Prefer an inline module-scope `lazy(() => import('...'))` with `withSuspense` where the set of
 * components is known up front, so product SSR tooling can preload the chunks. This helper is a
 * deliberate exception for open-ended icon sets (any Atlaskit icon / file type) that cannot be
 * enumerated statically: its loader reads render-time values, so SSR tooling cannot preload it.
 *
 * @param cacheKey Must uniquely identify the module `importFn` resolves to.
 */
export const getLazyIconComponent = (
	cacheKey: string,
	importFn: () => Promise<any>,
): ComponentType<any> => {
	const cached = lazyIconCache.get(cacheKey);
	if (cached) {
		return cached;
	}

	const LazyIcon = withSuspense(
		lazy(() =>
			importFn().catch(() => {
				lazyIconCache.delete(cacheKey);
				return renderNothingOnLoadError();
			}),
		),
		`lazy(${cacheKey})`,
	);
	lazyIconCache.set(cacheKey, LazyIcon);
	return LazyIcon;
};
