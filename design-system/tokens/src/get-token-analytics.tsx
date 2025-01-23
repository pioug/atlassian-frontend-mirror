import tokens from './artifacts/token-names';
type Tokens = typeof tokens;

// Extend the Window interface to include optional analyticsWebClient
declare global {
	interface Window {
		analyticsWebClient?: any;
	}
}

/**
 * Records a token call event to the analytics service. This is used to track which tokens are being used at runtime as they should be substituted by the values by @atlaskit/tokens/babel-plugin at build time.
 * @param token - The token that was called.
 * @param fallback - The fallback value that was used.
 */
export const recordTokenCall = async <T extends keyof Tokens>(
	token: T,
	fallback?: string,
): Promise<void> => {
	try {
		// TODO: window.analyticsWebClient is a property specific to Jira. It is not available in the other products. We might consider to register a dedicated analytics client for logging token calls for each product to enable cohesive experience across different products.
		const analyticsClient = window?.analyticsWebClient;
		if (analyticsClient) {
			// Check for a <style> element with a data-theme attribute in the document
			const isThemeEnabled = !!document.querySelector('style[data-theme]');

			// when such property exists, we are using it to send this event https://data-portal.internal.atlassian.com/analytics/registry/75682 which is registered specifically for Jira.
			analyticsClient.sendEvent({
				type: 'TRACK',
				payload: {
					action: 'called_at_runtime',
					actionSubject: 'token',
					source: 'design-system',
					attributes: {
						url: window.location.href,
						token,
						fallback,
						isThemeEnabled,
					},
				},
			});
		}
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(e);
	}
};
