import { type SentryClient } from '../types';

/**
 * Holds the process-wide Sentry client.
 *
 * The client used to live here as an exported `let`, but the getter and setter now live in their own
 * modules and an imported binding cannot be reassigned. Keeping the state behind a mutable ref lets
 * every module read and write the same value.
 */
export const sentryClientRef: { current: SentryClient | undefined } = { current: undefined };
