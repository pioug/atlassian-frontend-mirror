/**
 * The upstream `useCrossProductUrlWrapper` hook short-circuits whenever the
 * global interaction-session-tracking client is missing or returns an empty
 * session id. In a real Atlassian product (Confluence / Jira) the client is
 * bootstrapped early by `@atlassiansox/analytics-cross-product-interaction-client`,
 * but the standalone smart-card example bundle has no host product — so we
 * install a tiny fake on `window` here just to surface the wrapping behaviour
 * in the browser.
 *
 * This is example-only scaffolding. Do NOT copy this pattern into product or
 * library code.
 */

// (sic — the upstream key is misspelt and we must match it exactly)
const ANALYTICS_INTERACTION_SESSION_CLIENT_KEY = 'analyticsInteractionSesssionTrackingClient';

export const installInteractionSessionFake = (sessionId = 'example-session-id'): void => {
	if (typeof window === 'undefined') {
		return;
	}
	(window as unknown as Record<string, unknown>)[ANALYTICS_INTERACTION_SESSION_CLIENT_KEY] = {
		getCurrentInteractionSessionId: () => sessionId,
	};
};
