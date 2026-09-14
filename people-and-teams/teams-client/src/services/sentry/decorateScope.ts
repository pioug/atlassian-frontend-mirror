// See Sentry accepted options in here https://docs.sentry.io/error-reporting/configuration/?platform=javascript

import type { Scope } from '@sentry/browser';

import type { Context } from './Context';

export function decorateScope(scope: Scope, context: Context): Scope {
	const { tags, ...otherContext } = context;

	if (tags) {
		scope.setTags(tags);
	}

	if (Object.keys(otherContext).length) {
		scope.setExtras(otherContext);
	}

	return scope;
}
