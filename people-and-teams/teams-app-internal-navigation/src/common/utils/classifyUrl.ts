import type { NavigationIntent } from './getNavigationProps';

/**
 * Auto-classifies a URL into a {@link NavigationIntent}.
 *
 * Only runs when the consumer has not provided an explicit intent (i.e. intent is `unknown` or omitted)
 */
export function classifyUrl(): NavigationIntent {
	return 'unknown';
}
