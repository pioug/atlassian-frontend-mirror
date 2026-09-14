// See Sentry accepted options in here https://docs.sentry.io/error-reporting/configuration/?platform=javascript

import { type SentryTags } from './types';

export // eslint-disable-next-line @typescript-eslint/no-explicit-any
type Context = any & {
	/**
	 * Any tags to be added to the event.
	 */
	tags?: SentryTags;

	packageName?: string;
	packageVersion?: string;
};
