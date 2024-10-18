import { ConfigCollection } from '@atlaskit/config-common-libs';
import type { IdentifierEnum } from '@atlassian/feature-gate-node-client-standalone';

export interface FetchOptions {
	/**
	 * Base URL of the feature-flag-service
	 */
	ffsBaseUrl: string;
	/**
	 * Your fx3/feature-flag-service API Key
	 * You can get it from here: https://developer.atlassian.com/platform/frontend-feature-flags/resources/api-keys/
	 */
	ffsApiKey: string;
	/**
	 * User context to evaluate against
	 */
	context: {
		namespace: string;
		identifiers: { [id in IdentifierEnum]?: string | undefined };
		metadata: Record<string, string | number | boolean>;
	};

	/**
	 * Optional: use this to pass in your own `fetch` instance.
	 */
	fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

export class ConfigClient {
	public static async fetch(options: FetchOptions): Promise<ConfigCollection> {
		const fetch = options.fetch ?? globalThis.fetch;
		const response = await fetch(`${options.ffsBaseUrl}/api/v2/configurations`, {
			method: 'POST',
			body: JSON.stringify(options.context),
			headers: {
				'content-type': 'application/json',
				'x-api-key': options.ffsApiKey,
			},
		});

		if (!response.ok) {
			throw new Error(`Unexpected response ${response.status}: ${await response.text()}`);
		}

		const valuesPayload = await response.text();
		return ConfigCollection.fromValues(valuesPayload);
	}
}
