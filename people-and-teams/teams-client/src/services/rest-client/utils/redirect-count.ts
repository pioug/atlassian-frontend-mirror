import once from 'lodash/once';

import { clearCookie } from './clear-cookie';
import { REDIRECT_COUNT } from './cookie';
import { getCookieAsInteger } from './get-cookie-as-integer';
import { setCookie } from './set-cookie';

function createOnceFlaggedHandlers() {
	return {
		increment: once(() => setCookie(REDIRECT_COUNT, getCookieAsInteger(REDIRECT_COUNT) + 1)),
		clear: once(() => clearCookie(REDIRECT_COUNT)),
	};
}

let handlers = createOnceFlaggedHandlers();

/**
 * Owns the `redirectCount` cookie used to break the infinite login-redirect loop
 * on repeated 401 responses. `increment` and `clear` are each `once`-wrapped, so
 * a single page session writes the cookie at most one time per operation.
 *
 * This state is deliberately a module singleton: every `RestClient` instance must
 * share the same once-flags, otherwise each client would get its own redirect
 * budget and the loop guard would not hold.
 */
export const redirectCount = {
	increment: (): void => handlers.increment(),
	clear: (): void => handlers.clear(),
	/**
	 * Resets the once-ness of `increment` and `clear`. Used by tests so each case
	 * starts from a clean redirect budget.
	 */
	resetOnceFlag: (): void => {
		handlers = createOnceFlaggedHandlers();
	},
};
