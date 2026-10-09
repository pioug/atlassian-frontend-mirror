/**
 * Mirrors the internal check in `@atlaskit/smart-card`
 * (`src/utils/is-intersection-observer-supported.tsx`), which is not part of that package's
 * public API and so cannot be imported here.
 *
 * Smart Card only forwards its `container` prop to `react-lazily-render` when
 * `IntersectionObserver` is unavailable. When it is available the prop is never read, so the
 * caller can skip resolving a scroll container entirely.
 */
export const isIntersectionObserverSupported = (): boolean =>
	typeof IntersectionObserver !== 'undefined';
