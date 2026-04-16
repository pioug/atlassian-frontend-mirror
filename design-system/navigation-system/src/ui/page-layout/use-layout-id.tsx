import { useSkipLinkId } from './use-skip-link-id';

/**
 * Returns an ID for use by the layout element and skip links.
 *
 * If the consumer has already provided an ID, it will be used instead.
 * Otherwise, a unique ID will be returned.
 */
export function useLayoutId({
	providedId,
}: {
	/**
	 * The ID provided by the consumer. If provided, it will be used instead.
	 */
	providedId?: string;
} = {}): string {
	const uniqueId = useSkipLinkId();
	const id = providedId ? providedId : uniqueId;

	return id;
}
