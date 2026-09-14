import { normaliseJqlString } from '@atlaskit/jql-ast';

/**
 * Normalise a JQL string for use as a hydration map key.
 * Strips quotes/escaping and lowercases to ensure case-insensitive matching
 * between field names from different sources (e.g. AST vs hydration API).
 */
export const normaliseHydrationKey = (key: string): string => normaliseJqlString(key).toLowerCase();
