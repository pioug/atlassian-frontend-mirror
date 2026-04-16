import { useSkipLinkInternal } from './use-skip-link-internal';

/**
 * Call `useSkipLink` to register a skip link for important elements on the page.
 */
export const useSkipLink: (
	/**
	 * The unique ID for the skip link.
	 * You can use the `useSkipLinkId` hook to generate a unique ID.
	 */
	id: string,
	/**
	 * The label for the skip link.
	 */
	label: string,
	/**
	 * You can optionally set the position of the skip link in the list of skip links.
	 * Positions are zero-indexed.
	 */
	listIndex?: number,
) => void = (
	/**
	 * The unique ID for the skip link.
	 * You can use the `useSkipLinkId` hook to generate a unique ID.
	 */
	id: string,
	/**
	 * The label for the skip link.
	 */
	label: string,
	/**
	 * You can optionally set the position of the skip link in the list of skip links.
	 * Positions are zero-indexed.
	 */
	listIndex?: number,
): void => {
	useSkipLinkInternal({ id, label, listIndex });
};
