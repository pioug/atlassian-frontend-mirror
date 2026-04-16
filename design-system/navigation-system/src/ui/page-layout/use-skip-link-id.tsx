import { useId } from '@atlaskit/ds-lib/use-id';

// Exposing a hook as a convenience for consumers, so they don't need to import
// from ds-lib themselves.
/**
 * Returns a unique ID for use by layout elements and skip links.
 * You can use this for custom skip links.
 */
export function useSkipLinkId(): string {
	const uniqueId = useId();

	return uniqueId;
}
