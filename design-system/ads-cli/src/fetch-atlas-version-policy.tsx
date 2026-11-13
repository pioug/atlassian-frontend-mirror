import { get } from 'https';

const POLICY_URL = 'https://statlas.prod.atl-paas.net/atlas-cli-plugin-ads/version-policy.json';
const REQUEST_TIMEOUT_MS = 1500;
const MAX_POLICY_BYTES = 16 * 1024;

/**
 * A bounded, unauthenticated read of the ADS-owned policy; failures leave the CLI usable.
 */
export const fetchAtlasVersionPolicy = (): Promise<unknown> =>
	new Promise((resolve) => {
		let request: ReturnType<typeof get> | undefined;
		const deadline = setTimeout(() => {
			request?.destroy();
			resolve(undefined);
		}, REQUEST_TIMEOUT_MS);
		const finish = (value?: unknown) => {
			clearTimeout(deadline);
			resolve(value);
		};
		try {
			// Statlas explicitly bypasses its ten-minute proxy cache for Pragma requests.
			request = get(
				POLICY_URL,
				{ headers: { Accept: 'application/json', Pragma: 'no-cache' } },
				(response) => {
					if (response.statusCode !== 200) {
						response.destroy();
						finish();
						return;
					}
					let body = '';
					response.setEncoding('utf8');
					response.on('data', (chunk: string) => {
						body += chunk;
						if (Buffer.byteLength(body) > MAX_POLICY_BYTES) {
							request?.destroy();
							finish();
						}
					});
					response.on('error', () => finish());
					response.on('end', () => {
						try {
							finish(JSON.parse(body));
						} catch {
							finish();
						}
					});
				},
			);
			request.on('error', () => finish());
		} catch {
			finish();
		}
	});
